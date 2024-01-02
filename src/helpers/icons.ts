import CafeIcon from "../assets/images/cafe.png"
import PubIcon from "../assets/images/pub.png"
import RestaurantIcon from "../assets/images/restaurant.png"
import FastFoodIcon from "../assets/images/fastfood.png"
import KioskGrillIcon from "../assets/images/kiosk.png"
import FoodTruckIcon from "../assets/images/foodtruck.png"

export const getIconForCategory = (category: string) => {
	switch (category) {
		case "Café":
			return CafeIcon
		case "Pub":
			return PubIcon
		case "Restaurant":
			return RestaurantIcon
		case "Fast Food":
			return FastFoodIcon
		case "Kiosk/grill":
			return KioskGrillIcon
		case "Food Truck":
			return FoodTruckIcon
		default:
			return null
	}
}
