import { VehicleType } from "../utils/types";
import config from "../utils/config";

interface FareBreakdown {
	baseFare: number;
	distanceCharge: number;
	timeCharge: number;
	platformFee: number;
	taxAmount: number;
	total: number;
	currency: string;
}

interface FareRates {
	baseFare: number;
	perKm: number;
	perMinute: number;
	minimumFare: number;
	platformFeePercent: number;
}

class FareCalculationService {
	private rates: Record<VehicleType, FareRates> = {
		[VehicleType.MOTORCYCLE]: {
			baseFare: 10,
			perKm: 5,
			perMinute: 1,
			minimumFare: 15,
			platformFeePercent: 0.15
		},
		[VehicleType.RICKSHAW]: {
			baseFare: 15,
			perKm: 7,
			perMinute: 1.5,
			minimumFare: 20,
			platformFeePercent: 0.15
		},
		[VehicleType.SCOOTER]: {
			baseFare: 12,
			perKm: 6,
			perMinute: 1.2,
			minimumFare: 18,
			platformFeePercent: 0.15
		}
	};

	private taxRate = 0.14; // 14% VAT

	calculateFare(
		vehicleType: VehicleType,
		distance: number, // in kilometers
		estimatedTime: number, // in minutes
		serviceType: "delivery" | "transportation" = "transportation"
	): FareBreakdown {
		const rates = this.rates[vehicleType];

		// Calculate base components
		let baseFare = rates.baseFare;
		let distanceCharge = distance * rates.perKm;
		let timeCharge = estimatedTime * rates.perMinute;

		// Apply surge pricing if needed (implement later)
		const surgeMultiplier = this.getSurgeMultiplier();
		distanceCharge *= surgeMultiplier;
		timeCharge *= surgeMultiplier;

		// Calculate subtotal
		let subtotal = baseFare + distanceCharge + timeCharge;

		// Apply minimum fare
		if (subtotal < rates.minimumFare) {
			subtotal = rates.minimumFare;
		}

		if (serviceType === "delivery") {
			subtotal *= 1.1; // 10% surcharge for delivery
		}

		// Calculate fees
		const platformFee = subtotal * rates.platformFeePercent;
		const taxableAmount = subtotal + platformFee;
		const taxAmount = taxableAmount * this.taxRate;

		const total = subtotal + platformFee + taxAmount;

		return {
			baseFare: Math.round(baseFare * 100) / 100,
			distanceCharge: Math.round(distanceCharge * 100) / 100,
			timeCharge: Math.round(timeCharge * 100) / 100,
			platformFee: Math.round(platformFee * 100) / 100,
			taxAmount: Math.round(taxAmount * 100) / 100,
			total: Math.round(total * 100) / 100,
			currency: config.app.defaultCurrency
		};
	}

	calculateCancellationFee(vehicleType: VehicleType, minutesAfterAcceptance: number): number {
		const rates = this.rates[vehicleType];

		if (minutesAfterAcceptance < 2) {
			return 0; // No fee within 2 minutes
		}

		if (minutesAfterAcceptance < 5) {
			return rates.minimumFare * 0.25; // 25% of minimum fare
		}

		return rates.minimumFare * 0.5; // 50% of minimum fare
	}

	private getSurgeMultiplier(): number {
		// Implement surge pricing based on demand
		// For now, return normal pricing
		return 1.0;
	}

	estimateTime(distance: number): number {
		// Estimate time based on average speed
		const averageSpeedKmh = 25; 
		return Math.ceil((distance / averageSpeedKmh) * 60);
	}
}

export default new FareCalculationService();
