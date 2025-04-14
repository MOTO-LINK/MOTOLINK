import supertest from "supertest";
import app from "../server";
import dotenv from "dotenv";

dotenv.config();

const request = supertest(app);

describe("Server Endpoints", () => {
	it("should check health endpoint", async () => {
		const response = await request.get("/health");
		expect(response.status).toBe(200);
		expect(response.body.status).toBe("success");
		expect(response.body.message).toBe("Server is healthy");
	});

	it("should handle undefined routes", async () => {
		const response = await request.get("/undefined-route");
		expect(response.status).toBe(404);
		expect(response.body.status).toBe("error");
		expect(response.body.message).toBe("Route not found");
	});
});
