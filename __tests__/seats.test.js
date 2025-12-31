const request = require('supertest');
const app = require('../app');
const fetchDummyTokenUtil = require('../utils/fetchDummyToken');

let dummyToken = fetchDummyTokenUtil.fetchDummyToken();

let adminToken = fetchDummyTokenUtil.fetchAdminToken();


describe('Seats related API testing', () => {

    describe('reserveSeat API testing', () => {

        it('Should not pass if compulsory params are not passed', (done) => {
            let payload = {
                flightId: "abcd", 
                seatNumber: 2, 
                passengerPhone: 99999
            }
            let expectedResponse = {"success": 0, "errorMessage": "Missing Parameters"}

            request(app)
                .post('/seat/reserve')
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

        it('Should not pass if wrong input is fed', (done) => {
            let payload = {
                flightId: "63f9c35288df2f5c8f4ce1d6",
                seatNumber: 2, 
                passengerPhone: "aaaa",
                passengerAge: "Arnab123",
                passengerName: "Arnab"
            }
            let expectedResponse = {"success": 0, "errorMessage": "Wrong Input"}

            request(app)
                .post('/seat/reserve')
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

        it('Should not pass if seat is already reserved', (done) => {
            let payload = {
                flightId: "63fa08eadc4b5e3576fc119c",
                seatNumber: 1,
                passengerPhone: 9167566110,
                passengerAge: 24,
                passengerName: "Arnab Mukherjee"
            }
            let expectedResponse = {"success": 0, "errorMessage": "Seat taken already"}

            request(app)
                .post('/seat/reserve')
                .send(payload)
                .set("Authorization", "Bearer " + dummyToken)
                .expect(500)
                .end((err, res) => {
                    expect(res.body).toEqual(expectedResponse)
                    if(err)
                        throw err;
                    done();
                })
        })

        // it('Should successfully reserve seats and have all correct res body keys', (done) => {
        //     let payload = {
        //         flightId: "63fa08eadc4b5e3576fc119c",
        //         seatNumber: 1, //will have to think on how to make this seat and flight dynamic, no time now tho
        //         passengerPhone: 9167566110,
        //         passengerAge: 24,
        //         passengerName: "Arnab Mukherjee"
        //     }

        //     request(app)
        //         .post('/seat/reserve')
        //         .send(payload)
        //         .set("Authorization", "Bearer " + dummyToken)
        //         .expect(200)
        //         .end((err, res) => {
        //             expect(res.body).toHaveProperty('success')
        //             expect(res.body).toHaveProperty('message')
        //             expect(res.body).toHaveProperty('seat')
        //             expect(res.body.success).toEqual(1)
        //             expect(res.body.seat && typeof res.body.seat === 'object').toBe(true)
        //             expect(res.body.message).toEqual("Seat is successfully booked")
        //             if(err)
        //                 throw err;
        //             done();
        //         })
        // })

    })

    describe('resetSeats API testing', () => {

        it('Should not pass if flightId is not passed', (done) => {
            let payload = {
                passengerPhone: 99999
            }
            let expectedResponse = {"success": 0, "errorMessage": "Please pass flightId"}

            request(app)
                .post('/seat/reset')
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

        it('Should not pass if anybody except admin is trying to access api', (done) => {
            let payload = {
                flightId: "dummy"
            }
            //dummyToken is not of admin
            let expectedResponse = {"success": 0, "errorMessage": "You Are not authorised to reset seats"}

            request(app)
                .post('/seat/reset')
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

        it('Should successfully reset seats if admin is trying to reset and have all correct res body keys', (done) => {
            let payload = {
                flightId: "63fa08eadc4b5e3576fc119c",
            }

            request(app)
                .post('/seat/reset')
                .send(payload)
                .set("Authorization", "Bearer " + adminToken)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toHaveProperty('success')
                    expect(res.body).toHaveProperty('message')
                    expect(res.body).toHaveProperty('updatedSeats')
                    expect(res.body.success).toEqual(1)
                    expect(res.body.updatedSeats && typeof res.body.updatedSeats === 'object').toBe(true)
                    expect(res.body.message).toEqual("Reset Successful")
                    if(err)
                        throw err;
                    done();
                })
        })
    })

})