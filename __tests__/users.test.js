const request = require('supertest');
const app = require('../app');

describe('Users related API testing', () => {

    describe('Register API testing', () => {

        it('Should not create a user with an existing email', (done) => {
            let payload = {
                "email": "arnabmu1999@gmail.com",
                "password": "xyz",
                "name": "Arnab Mukherjee"
            }
            let expectedResponse = {
                "success": 0,
                "errorMessage": "User Already Exists. Please Login"
            }
            request(app)
                .post('/register')
                .send(payload)
                .expect(500)
                .end((err, res) => {
                    expect(res.body).toEqual(expectedResponse)
                    if(err)
                        throw err;
                    done();
                })
        })

    })

    describe('Login API testing', () => {

        it('Should give valid token', (done) => {
            let payload = {
                "email": "arnabmu1999@gmail.com",
                "password": "abcd"
            }
        
            request(app)
                .post('/login')
                .send(payload)
                .expect(200)
                .end((err, res) => {
                    let success = res.body.success;
                    let authToken = res.body.authToken;

                    expect(success).toEqual(1);
                    if(err)
                        throw err;
                    done();
                })
        })

        it('Should fail if user is not in db', (done) => {
            let payload = {
                "email": "donotaddthisemail@gmail.com",
                "password": "abcd"
            }
            let expectedResponse = {
                "success": 0,
                "errorMessage": "Invalid credentials"
            }
            request(app)
                .post('/login')
                .send(payload)
                .expect(500)
                .end((err, res) => {
                    let success = res.body.success;                    
                    expect(success).toEqual(0);
                    expect(res.body).toEqual(expectedResponse)
                    if(err)
                        throw err;
                    done();
                })
        })

    })

})