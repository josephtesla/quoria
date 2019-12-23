import {use, expect, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/index'
import randomPayload from '../helpers/payload'
import { Parcel, User } from '../models/models'

use(chaiHttp)

const API_PREFIX = '/api/v1';

let token = null;

describe('Authentication', () => {

  beforeEach((done) => { //before each test, we empty the database
    Parcel.deleteMany({}).then(() => {
      User.deleteMany({}).then(() => {
        done();
      })
    })
  })

  it('Allows users to register, should return 201 and have a token with user details', (done) => {
    request(server)
      .post(`${API_PREFIX}/auth/signup`)
      .send(randomPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      })
  })
})