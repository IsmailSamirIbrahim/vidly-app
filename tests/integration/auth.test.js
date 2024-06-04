const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User}  = require('../../models/user');

let server;

describe('auth middleware', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});
    });

    let token;

    const exec = async () => {
        return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: 'genre1'});
    };

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if the token is not provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if the token is invalid', async () => {
        token = new Array(4).join('a');

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if the token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});