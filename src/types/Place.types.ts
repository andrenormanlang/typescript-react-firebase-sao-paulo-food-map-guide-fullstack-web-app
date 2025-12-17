import { Timestamp } from "firebase/firestore";
import type { LatLngLiteral } from "./Geo.types";

export type Location = {
	latitude: number;
	longitude: number;
};

export type Place = {
	_id: string;
	category: Category;
	city: City;
	createdAt: Timestamp;
	description: string;
	email?: string;
	facebook?: string;
	instagram?: string;
	isApproved: boolean;
	location: LatLngLiteral;
	name: string;
	/** Street name (not the full multi-part Nominatim display_name). */
	streetAddress: string;
	/** House / address number (can be alphanumeric). */
	addressNumber?: string;
	/** Neighborhood / district / suburb depending on country. */
	neighborhood?: string;
	/** Postal / ZIP code. */
	zipCode?: string;
	supply: Supply;
	telephone?: string;
	uid: string;
	website?: string;
	distance?: number;
	distanceText?: string;
};

export type City = "Sao Paulo" | "Malmö" | "Copenhagen";

export type Category =
	| "Café"
	| "Pub"
	| "Restaurant"
	| "Fast Food"
	| "Kiosk/grill"
	| "Food Truck";

export type Supply =
	| "General Menu"
	| "Lunch"
	| "After Work"
	| "Dinner"
	| "Breakfast/Brunch";

export type SelectCity = City | "City";

export type SelectCategory = Category | "Category";

export type SelectSupply = Supply | "Supply";
