import { use, expect, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/index'
import randomPayload from '../helpers/payload'
import { Parcel, User } from '../models/models'

use(chaiHttp)

process.env.NODE_ENV = 'test'

const API_V1 = '/api/v1';
let token = null

describe('Authentication', () => {
  beforeEach((done) => {
    Parcel.deleteMany({}).then(() => {
      User.deleteMany({}).then(() => {
        done();
      })
    })
  })

  it('Allows users to register, should return 201 and have a token with user details', (done) => {
    request(server)
      .post(`${API_V1}/auth/signup`)
      .send(randomPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(Object.keys(res.body)).to.have.contains('status');
        expect(Object.keys(res.body)).to.have.contains('data');
        expect((res.body.data)).to.be.an('array')
        expect(Object.keys(res.body.data[0])).to.have.contains('token');
        expect(Object.keys(res.body.data[0])).to.have.contains('user');
        expect(res.body.data[0].token).to.not.equal(null);
        expect(res.body.data[0].user).to.not.equal(null);
        expect(res.body.data[0].user.username).equals(randomPayload.username);
        expect(Object.keys(res.body.data[0].user).length).to.equal(9)
        token = res.body.data[0].token
        done();
      })
  })


  it('Prevents an existing user from registering, returning conflict 409 error', (done) => {
    new User(randomPayload).save(() => {
      request(server)
        .post(`${API_V1}/auth/signup`)
        .send(randomPayload)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property('error').equal(`You've already registered, kindly login`);
          done();
        })
    })
  })

  it("Users should be able to access other endpoints after generating token, should not return 403", (done) => {
    request(server)
      .get(`${API_V1}/parcels`)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res).to.not.have.status(403);
        done();
      })
  })

  it('Should allow users to login with correct details and return 200 with user details and token', (done) => {
    request(server)
      .post(`${API_V1}/auth/signup`)
      .send(randomPayload)
      .end((err, resp) => {
        request(server)
          .post(`${API_V1}/auth/login`)
          .send(randomPayload)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(Object.keys(res.body)).to.have.contains('status');
            expect(Object.keys(res.body)).to.have.contains('data');
            expect((res.body.data)).to.be.an('array')
            expect(Object.keys(res.body.data[0])).to.have.contains('token');
            expect(Object.keys(res.body.data[0])).to.have.contains('user');
            expect(res.body.data[0].token).to.not.equal(null);
            expect(res.body.data[0].user).to.not.equal(null);
            expect(res.body.data[0].user.username).equals(randomPayload.username);
            expect(Object.keys(res.body.data[0].user).length).to.equal(9)
            token = res.body.data[0].token
            done();
          })
      })
  })

  it("Prevents user from logging in with a username that doesn't exist, returns 404 code", (done) => {
    randomPayload.username = "A_404_USERNAME"
    request(server)
      .post(`${API_V1}/auth/login`)
      .send(randomPayload)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("error").equal("Username doesn't exist!")
        done();
      })
  })

  it("Prevents user from logging in with an incorrect password, returns 404 code", (done) => {
    randomPayload.username = "josephtesla"
    request(server)
      .post(`${API_V1}/auth/signup`)
      .send(randomPayload)
      .end((err, resp) => {
        randomPayload.password = 'A_404_PASSWORD'
        request(server)
        .post(`${API_V1}/auth/login`)
        .send(randomPayload)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error").equal("Username or password incorrect")
          done();
        })
      })
  })
})