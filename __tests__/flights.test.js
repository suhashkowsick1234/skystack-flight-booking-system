const request = require('supertest');
const app = require('../app');
const fetchDummyTokenUtil = require('../utils/fetchDummyToken');

let dummyToken = fetchDummyTokenUtil.fetchDummyToken();

describe('Flights related API testing', () => {

    describe('scheduleFlight API testing', () => {

        it('Should not create more than 300 seats', (done) => {
            let payload = {
                "airlines": "Arnab Air",
                "numOfSeats": 350
            }
            let expectedResponse = {
                "success": 0, 
                "errorMessage": "Wrong number of seats"
            }

            request(app)
                .post('/flight/scheduleFlight')
                .send(payload)
                .set("Authorization", "Bearer " + dummyToken)
                .expect(400)
                .end((err, res) => {
                    expect(res.body).toEqual(expectedResponse)
                    if(err)
                        throw err;
                    done();
                })
        })

        it('Should successfully create seats and have all correct res body keys', (done) => {
            let payload = {
                "airlines": "Arnab Air",
                "numOfSeats": 1
            }

            request(app)
                .post('/flight/scheduleFlight')
                .send(payload)
                .set("Authorization", "Bearer " + dummyToken)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toHaveProperty('success')
                    expect(res.body).toHaveProperty('flight')
                    expect(res.body).toHaveProperty('seats')
                    expect(res.body.success).toEqual(1)
                    expect(res.body.flight && typeof res.body.flight === 'object').toBe(true)
                    expect(Array.isArray(res.body.seats)).toBe(true)
                    expect(res.body.seats.length).toBeGreaterThan(0)
                    if(err)
                        throw err;
                    done();
                })
        })

    })

})