const request  = require('supertest');
const {User}   = require('../../models/user');
const {Genre}  = require('../../models/genre');
const mongoose = require('mongoose');

let server = {};

describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});
    });

    describe('Get /', () => {
        beforeEach(async () => {
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'},
                {name: 'genre3'}
            ]);
        });

        it('should return all genres', async () => {
            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre3')).toBeTruthy();
        });
    });

    describe('Get /:id', () => {
        // Define the happy path, and then in each test, we change
        // one parameter that clearly aligns with the name of the test.
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
                .get(`/api/genres/${id}`);
        };

        beforeEach(async () => {
            genre = new Genre({ name: 'genre1' });
            await genre.save();

            id = genre._id;
        });

        it('should return 404 if invalid id is passed', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if genre with the given id was not found', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return a genre if valid id is passed', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });

    describe('POST /', () => {
        // Define the happy path, and then in each test, we change
        // one parameter that clearly aligns with the name of the test.
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name});
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if the client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 3 characters', async () => {
            name = new Array(3).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            const res = await exec();

            const genre = await Genre.find({name: 'genre1'});

            expect(res.status).toBe(200);
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id', () => {
        // Define the happy path, and then in each test, we change
        // one parameter that clearly aligns with the name of the test.
        let genre;
        let token;
        let id;
        let newName;
        
        const exec = async () => {
            return await request(server)
                .put(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send({name: newName});
        };

        beforeEach(async () => {
            genre = new Genre({name: 'genre1'});
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            newName = 'updatedName'
        });

        it('should return 401 if the client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if invalid id is passed', async () => {
            id = '1';

            const res = await exec();
            
            expect(res.status).toBe(404);
        });

        it('should return 400 if the genre name is less than 3 characters', async () => {
            newName = new Array(3).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if the genre name is more than 50 characters', async () => {
            newName = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if genre with the given id was not found', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should update the genre if input is valid', async () => {
            await exec();

            const updatedGenre = await Genre.findById(genre._id);

            expect(updatedGenre.name).toBe(newName);
        });

        it('should return the updated genre if it is valid', async () => {
            const res = await exec();
            
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', newName);
        });
    });

    describe('DELETE /:id', () => {
        // Define the happy path, and then in each test, we change
        // one parameter that clearly aligns with the name of the test.
        let genre;
        let token;
        let id;
        
        const exec = async () => {
            return await request(server)
                .delete(`/api/genres/${id}`)
                .set('x-auth-token', token);
        };

        beforeEach(async () => {
            genre = new Genre({name: 'genre1'});
            await genre.save();

            token = new User({isAdmin: true}).generateAuthToken();
            id = genre._id;
        });

        it('should return 401 if the client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if the client is not an admin', async () => {
            token = new User({isAdmin: false}).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if invalid id is passed', async () => {
            id = '1';

            const res = await exec();
            
            expect(res.status).toBe(404);
        });

        it('should return 404 if genre with the given id was not found', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the genre if input is valid', async () => {
            await exec();

            const deletedGenre = await Genre.findById(genre._id);

            expect(deletedGenre).toBeNull();
        });

        it('should return the deleted genre if it is valid', async () => {
            const res = await exec();
            
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });
});