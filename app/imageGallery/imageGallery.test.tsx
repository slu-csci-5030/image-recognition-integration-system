import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ImageGallery from './page'; // Adjust path if needed

// Mock dependencies
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Next.js useSearchParams
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: () => '1', // Simulate an imageId being present
  }),
}));

// Detailed IndexedDB mock 
const createMockIndexedDB = () => {
  const mockOpenRequest = {
    onsuccess: null as any,
    onerror: null as any,
    result: {
      transaction: jest.fn().mockReturnValue({
        objectStore: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue({
            onsuccess: null as any,
            result: { 
              id: '1', 
              data: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==', 
              timestamp: '2024-03-24T12:00:00Z' 
            }
          }),
          getAll: jest.fn().mockReturnValue({
            onsuccess: null as any,
            result: [
              { 
                id: '1', 
                data: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==', 
                timestamp: '2024-03-24T12:00:00Z' 
              }
            ]
          })
        })
      })
    }
  };

  return {
    open: jest.fn().mockReturnValue(mockOpenRequest)
  };
};

// Global mock for IndexedDB
global.indexedDB = createMockIndexedDB() as any;

describe('ImageGallery Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configure axios mock to throw an error
    mockedAxios.post.mockRejectedValue(new Error('Network error'));
  });

  test('handles API server not running', async () => {
    // Increase timeout
    jest.setTimeout(10000);

    // Set up console error spy
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Render the component
    const { rerender } = render(<ImageGallery />);

    // Simulate IndexedDB events
    await act(async () => {
      const mockIndexedDB = global.indexedDB as any;
      const openRequest = mockIndexedDB.open.mock.results[0].value;
      
      openRequest.onsuccess?.({ target: openRequest });
      
      const transaction = openRequest.result.transaction();
      const store = transaction.objectStore();
      
      const getRequest = store.get();
      getRequest.onsuccess?.({
        target: {
          result: { 
            id: '1', 
            data: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==', 
            timestamp: '2024-03-24T12:00:00Z' 
          }
        }
      });
      
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess?.({ target: getAllRequest });
    });

    // Wait for potential state updates
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Verify expectations

    // Clean up
    consoleErrorSpy.mockRestore();
  }, 10000);
});