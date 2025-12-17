import type { NominatimReverseResult } from "../services/nominatim";

/**
 * Extract a locality/city name from a Nominatim reverse-geocode response.
 */
export const findAdressComponent = (result: NominatimReverseResult) => {
	const address = result.address;
	if (!address) return;

	return (
		address.city ??
		address.town ??
		address.village ??
		address.municipality ??
		address.county
	);
};

const BR_STATE_ABBREV: Record<string, string> = {
	Acre: "AC",
	Alagoas: "AL",
	Amapá: "AP",
	Amazonas: "AM",
	Bahia: "BA",
	Ceará: "CE",
	"Distrito Federal": "DF",
	"Espírito Santo": "ES",
	Goiás: "GO",
	Maranhão: "MA",
	"Mato Grosso": "MT",
	"Mato Grosso do Sul": "MS",
	"Minas Gerais": "MG",
	Pará: "PA",
	Paraíba: "PB",
	Paraná: "PR",
	Pernambuco: "PE",
	Piauí: "PI",
	"Rio de Janeiro": "RJ",
	"Rio Grande do Norte": "RN",
	"Rio Grande do Sul": "RS",
	Rondônia: "RO",
	Roraima: "RR",
	"Santa Catarina": "SC",
	"São Paulo": "SP",
	Sergipe: "SE",
	Tocantins: "TO",
};

type FormatStreetAddressOptions = {
	placeName?: string;
};

const looksLikeHouseNumber = (value: string) =>
	/^[0-9]+[A-Za-z0-9-]*$/.test(value);

const stripNoiseParts = (parts: string[]) => {
	return parts.filter((p) => {
		const lower = p.toLowerCase();
		if (lower === "brasil" || lower === "brazil") return false;
		if (lower.includes("região")) return false;
		if (lower.includes("geográfica")) return false;
		if (lower.includes("metropolitana")) return false;
		if (lower.includes("intermediária")) return false;
		if (lower.includes("imediata")) return false;
		return true;
	});
};

const buildBrazilianStyleAddressFromDisplayName = (
	displayName: string,
	options?: FormatStreetAddressOptions
) => {
	let parts = displayName
		.split(",")
		.map((p) => p.trim())
		.filter(Boolean);

	if (options?.placeName) {
		const first = parts[0]?.toLowerCase();
		const place = options.placeName.trim().toLowerCase();
		if (first && place && first === place) {
			parts = parts.slice(1);
		}
	}

	const postcodeMatch = displayName.match(/\b\d{5}-\d{3}\b/);
	const postcode = postcodeMatch?.[0];

	parts = stripNoiseParts(parts.filter((p) => p !== postcode));

	// City/state: try to find a Brazilian state and use the part right before as city.
	let state: string | undefined;
	let city: string | undefined;
	let stateIndex = -1;
	let cityIndex = -1;
	for (let i = parts.length - 1; i >= 0; i--) {
		const maybeState = parts[i];
		if (BR_STATE_ABBREV[maybeState]) {
			state = maybeState;
			stateIndex = i;
			cityIndex = i - 1;
			city = parts[cityIndex];
			break;
		}
	}

	// If we didn't find a known state, fall back to last occurrence of São Paulo.
	if (!state && parts.includes("São Paulo")) {
		state = "São Paulo";
		// In many Nominatim strings, city and state are both "São Paulo"; keep city as "São Paulo".
		city = "São Paulo";
		stateIndex = parts.lastIndexOf("São Paulo");
		cityIndex = stateIndex;
	}

	const stateAbbrev = state ? BR_STATE_ABBREV[state] : undefined;
	// cityIndex is computed from the state position above; do not use lastIndexOf(city)
	// because city and state can have the same label (e.g. "São Paulo").

	// Try to find a street name (Rua/Avenida/Praça/Alameda/etc).
	const streetKeywords = [
		"Rua",
		"Avenida",
		"Av.",
		"Praça",
		"Praca",
		"Alameda",
		"Travessa",
		"Estrada",
		"Rodovia",
	];
	let streetIndex = -1;
	for (let i = 0; i < parts.length; i++) {
		const p = parts[i];
		if (
			streetKeywords.some(
				(k) => p.startsWith(k + " ") || p === k || p.includes(k + " ")
			)
		) {
			streetIndex = i;
			break;
		}
	}
	if (streetIndex === -1 && parts.length) {
		// Fallback: assume the first non-number part is a street-ish label.
		streetIndex = looksLikeHouseNumber(parts[0]) ? 1 : 0;
		if (streetIndex >= parts.length) streetIndex = 0;
	}

	const streetName = parts[streetIndex];
	const maybeNumber = parts[streetIndex - 1];
	const number =
		maybeNumber && looksLikeHouseNumber(maybeNumber)
			? maybeNumber
			: undefined;
	const streetLine = [streetName, number].filter(Boolean).join(" ");

	// Neighborhood: last part between street and city.
	const startNeighborhood = Math.min(streetIndex + 1, parts.length);
	const endNeighborhood =
		cityIndex > 0 ? cityIndex : stateIndex > 0 ? stateIndex : parts.length;
	const neighborhoodCandidates = parts.slice(
		startNeighborhood,
		endNeighborhood
	);
	const neighborhood = neighborhoodCandidates.length
		? neighborhoodCandidates[neighborhoodCandidates.length - 1]
		: undefined;

	const cityState = city
		? `${city}${stateAbbrev ? ` - ${stateAbbrev}` : ""}`
		: undefined;

	return [
		streetLine,
		neighborhood ? `- ${neighborhood}` : undefined,
		cityState ? `, ${cityState}` : undefined,
		postcode ? `, ${postcode}` : undefined,
	]
		.filter(Boolean)
		.join(" ")
		.replace(/\s+,/g, ",")
		.trim();
};

export const formatStreetAddress = (
	streetAddress?: string | null,
	options?: FormatStreetAddressOptions
) => {
	if (!streetAddress) return "";

	// Prefer Brazilian-style formatting only when it looks like a BR address.
	if (streetAddress.includes(",")) {
		const looksBrazilian =
			/\b\d{5}-\d{3}\b/.test(streetAddress) ||
			/\b(brasil|brazil)\b/i.test(streetAddress) ||
			Object.keys(BR_STATE_ABBREV).some((state) =>
				streetAddress.includes(state)
			);

		if (looksBrazilian) {
			const formatted = buildBrazilianStyleAddressFromDisplayName(
				streetAddress,
				options
			);
			return formatted || streetAddress;
		}

		// Generic fallback for non-BR addresses (keeps it short but still informative)
		const parts = streetAddress
			.split(",")
			.map((p) => p.trim())
			.filter(Boolean);

		if (parts.length <= 4) return streetAddress;
		return [
			parts[0],
			parts[1],
			parts[parts.length - 2],
			parts[parts.length - 1],
		].join(", ");
	}

	return streetAddress;
};

export type NominatimAddressParts = {
	streetAddress?: string;
	addressNumber?: string;
	neighborhood?: string;
	city?: string;
	zipCode?: string;
};

export const extractAddressPartsFromNominatim = (
	address?: Record<string, string>
): NominatimAddressParts => {
	if (!address) return {};

	const streetAddress =
		address.road ??
		address.pedestrian ??
		address.footway ??
		address.path ??
		address.residential ??
		address.cycleway ??
		address.street ??
		address.highway;

	const addressNumber = address.house_number;

	const neighborhood =
		address.neighbourhood ??
		(address as Record<string, string>).neighborhood ??
		address.suburb ??
		address.quarter ??
		address.city_district;

	const city =
		address.city ??
		address.town ??
		address.village ??
		address.municipality ??
		address.county;

	const zipCode = address.postcode;

	return {
		streetAddress,
		addressNumber,
		neighborhood,
		city,
		zipCode,
	};
};

export const formatPlaceAddress = (
	place: {
		streetAddress?: string | null;
		addressNumber?: string | null;
		neighborhood?: string | null;
		city?: string | null;
		zipCode?: string | null;
		name?: string | null;
	},
	options?: FormatStreetAddressOptions
) => {
	const street = (place.streetAddress ?? "").trim();
	const number = (place.addressNumber ?? "").trim();
	const neighborhood = (place.neighborhood ?? "").trim();
	const city = (place.city ?? "").trim();
	const zip = (place.zipCode ?? "").trim();

	const hasParts = Boolean(number || neighborhood || city || zip);

	if (street && hasParts) {
		// Order requested: Street Address, Address Number, Neighborhood, City, Zip Code
		const streetLine = number ? `${street} ${number}` : street;
		return [
			streetLine,
			neighborhood ? `- ${neighborhood}` : undefined,
			city ? `, ${city}` : undefined,
			zip ? `, ${zip}` : undefined,
		]
			.filter(Boolean)
			.join(" ")
			.replace(/\s+,/g, ",")
			.trim();
	}

	return formatStreetAddress(place.streetAddress, {
		placeName: place.name ?? options?.placeName,
	});
};
