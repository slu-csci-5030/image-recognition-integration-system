import { POST } from './route';
import axios from 'axios';
import { NextRequest } from 'next/server';

// Fully mock NextResponse only — no requireActual
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      json: () => data,
      status: init?.status ?? 200,
    }),
  },
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Image Search API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return similar images when provided with a valid image', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        similar_images: [
          'http://example.com/image1.jpg',
          'http://example.com/image2.jpg',
        ],
      },
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValueOnce({
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      similar_images: [
        'http://example.com/image1.jpg',
        'http://example.com/image2.jpg',
      ],
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('api.shniter.com:5000/search'),
      { image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==' }
    );
  });
});
    
    
    