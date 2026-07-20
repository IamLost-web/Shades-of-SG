const request = require('supertest');

const mockGetStats = jest.fn();
jest.mock('../services/statsService', () => ({ getStats: mockGetStats }));

const app = require('../server');

describe('public statistics route', () => {
    beforeEach(() => {
        mockGetStats.mockReset();
    });

    test('GET /api/stats returns current database statistics', async () => {
        mockGetStats.mockResolvedValue({
            reflectionsCount: 8,
            songsCount: 5,
            usersCount: 12,
        });

        const response = await request(app).get('/api/stats');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            reflectionsCount: 8,
            songsCount: 5,
            usersCount: 12,
        });
        expect(mockGetStats).toHaveBeenCalledTimes(1);
    });
});
