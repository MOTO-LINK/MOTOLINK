import axios from "axios";
import config from "../utils/config";

interface GeocodingResult {
	address: string;
	latitude: number;
	longitude: number;
}

class GeocodingService {
	private apiKey: string;

	constructor() {
		this.apiKey = config.google.mapsApiKey || "";
	}

	async reverseGeocode(latitude: number, longitude: number): Promise<string> {
		try {
			if (!this.apiKey) {
				// Return a basic address if no API key
				return `${latitude}, ${longitude}`;
			}

			const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
				params: {
					latlng: `${latitude},${longitude}`,
					key: this.apiKey,
					language: "ar" // Arabic for Egypt
				}
			});

			if (response.data.results && response.data.results.length > 0) {
				return response.data.results[0].formatted_address;
			}

			return `${latitude}, ${longitude}`;
		} catch (error) {
			console.error("Geocoding error:", error);
			return `${latitude}, ${longitude}`;
		}
	}

	async geocode(address: string): Promise<GeocodingResult | null> {
		try {
			if (!this.apiKey) {
				return null;
			}

			const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
				params: {
					address,
					key: this.apiKey,
					language: "ar"
				}
			});

			if (response.data.results && response.data.results.length > 0) {
				const result = response.data.results[0];
				return {
					address: result.formatted_address,
					latitude: result.geometry.location.lat,
					longitude: result.geometry.location.lng
				};
			}

			return null;
		} catch (error) {
			console.error("Geocoding error:", error);
			return null;
		}
	}

	calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const R = 6371; // Radius of the Earth in kilometers
		const dLat = this.toRad(lat2 - lat1);
		const dLon = this.toRad(lon2 - lon1);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRad(lat1)) *
				Math.cos(this.toRad(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	private toRad(value: number): number {
		return (value * Math.PI) / 180;
	}
}

export default new GeocodingService();
