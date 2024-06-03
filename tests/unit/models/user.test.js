const {User}   = require('../../../models/user');
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const config   = require('config');

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: false
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decodedPayload).toMatchObject(payload);
    }); 
});