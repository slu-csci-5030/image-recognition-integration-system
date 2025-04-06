import { NextRequest } from "next/server";
import axios from "axios";
import { POST } from "./route";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a basic mock for NextResponse.json
jest.mock("next/server", () => {
  const original = jest.requireActual("next/server");
  return {
    ...original,
    NextResponse: {
      json: (data: unknown, init?: { status?: number }) => ({
        json: () => data,
        status: init?.status ?? 200,
      }),
    },
  };
});

describe("Image Search API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return similar images when provided with a valid image", async () => {
    // Mock the API response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        similar_images: [
          "http://example.com/image1.jpg",
          "http://example.com/image2.jpg",
        ],
      },
    });

    // Create a fake request object matching NextRequest
    const mockRequest = {
      json: jest.fn().mockResolvedValueOnce({
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
      }),
    } as unknown as NextRequest;

    // Call the route
    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      similar_images: [
        "http://example.com/image1.jpg",
        "http://example.com/image2.jpg",
      ],
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("api.shniter.com:5000/search"),
      {
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
      }
    );
  });
});
