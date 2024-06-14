const {Rental} = require('../../../models/rental');
const {User}   = require('../../../models/user');
const {Movie}  = require('../../../models/movie');
const moment   = require('moment');
const request  = require('supertest');
const mongoose = require('mongoose');

let server;
let customerId;
let movieId;
let rental;
let movie;
let token;

describe('/api/returns', () => {
    // Define the happy path, and then in each test, we change
    // one parameter that clearly aligns with the name of the test.   
    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    }

    beforeEach(async () => {
        server     = require('../../../index');
        customerId = new mongoose.Types.ObjectId();
        movieId    = new mongoose.Types.ObjectId();
        token      = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            name: 'movie1',
            genre: { name: 'genre1' },
            dailyRentalRate: 2,
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'customer1',
                phone: '123456789',
                isGold: false
            },
            movie: movie
        });
        await rental.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    it('should return 401 if the client is not logged in', async () => {
        token = '';

        const res =  await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if the customerId is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if the movieId is not provided', async () => {
        movieId = '';

        const res =  await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for customer/movie', async () => {
        await Rental.deleteMany({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the return date if input is valid', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;

        expect(rentalInDb.dateReturned).toBeDefined();
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set the rentalFee if input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the number of stock of the movie', async () => {
        const res = await exec();

        const movieInDb = await Movie.findById(movieId);
        
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if input is valid', async () => {
        const res = await exec();

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['customer', 'movie', 'dateOut', 'dateReturned', 'rentalFee']));
    });
});