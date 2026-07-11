const request = require('supertest');
const app = require('../server');
const { createToken } = require('../services/authService');

test('GET /api/health returns service health', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
        status: 'ok',
        service: 'shades-of-sg-api',
    });
});

test('production token creation requires a configured signing secret', () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousAuthSecret = process.env.AUTH_TOKEN_SECRET;
    const previousJwtSecret = process.env.JWT_SECRET;

    process.env.NODE_ENV = 'production';
    delete process.env.AUTH_TOKEN_SECRET;
    delete process.env.JWT_SECRET;

    try {
        expect(() => createToken({ email: 'user@example.com', id: 'user-id', role: 'REGISTERED' }))
            .toThrow('AUTH_TOKEN_SECRET or JWT_SECRET is required in production.');
    } finally {
        if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
        else process.env.NODE_ENV = previousNodeEnv;
        if (previousAuthSecret === undefined) delete process.env.AUTH_TOKEN_SECRET;
        else process.env.AUTH_TOKEN_SECRET = previousAuthSecret;
        if (previousJwtSecret === undefined) delete process.env.JWT_SECRET;
        else process.env.JWT_SECRET = previousJwtSecret;
    }
});
