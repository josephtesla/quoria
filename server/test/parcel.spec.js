import { use, expect, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/index'
import { Parcel, User } from '../models/models'
import payload from '../helpers/payload'

use(chaiHttp)

const API_V1 = '/api/v1';
let token = null, userId = null, parcelId = null;

const parcelPayload = {
  weight: "350",
  weightmetric: "Kg",
  from: "Address 1",
  to: 'Address 2'
}

describe("Parcel routes token init", () => {
  beforeEach((done) => {
    User.deleteMany({}).then(() => {
      done()
    })
  })

  it("Log in user and get token before running tests", (done) => {
    request(server)
      .post(`${API_V1}/auth/signup`)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(201)
        token = res.body.data[0].token;
        userId = res.body.data[0].user._id;
        done();
      })
  })
})

describe("Begin Create Parcel Routes Test", () => {
  beforeEach((done) => {
    Parcel.deleteMany({}).then(() => {
      done()
    })
  })

  it('Creates a new parcel delivery order', (done) => {
    request(server)
      .post(`${API_V1}/parcels/${userId}`)
      .set('x-access-token', token)
      .send(parcelPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('id').not.eql(null);
        expect(res.body.data[0]).to.have.property('message').equal("Order successfully created")
        done();
      })
  })

  describe("Parcel Operations Tests", () => {
    beforeEach((done) => {
      Parcel.deleteMany({}).then(() => {
        const { weight, weightmetric, from, to } = parcelPayload
        new Parcel({
          weight, weightmetric, from, to,
          placedBy: userId,
          sentOn: new Date().toISOString(),
          status: "placed",
          currentLocation: new Date().toISOString(),
          deliveredOn: null
        }).save().then((p) => {
          parcelId = p.id
          done();
        })
      })
    })

    it("Fetches all parcel delivery orders, returns 200 and orders", (done) => {
      request(server)
        .get(`${API_V1}/parcels`)
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          done()
        })
    })

    it("Fetches a single parcel delivery order, returns 200 and order details", (done) => {
      request(server)
        .get(`${API_V1}/parcels/${parcelId}`)
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data.length).to.equal(1);
          done()
        })
    })

    it("Fetches all parcel delivery orders by a user, returns 200 and orders", (done) => {
      request(server)
        .get(`${API_V1}/users/${userId}/parcels`)
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data.length).to.equal(1);
          done()
        })
    })


    it("Cancels a parcel delivery order, returning 200 and parcel details", (done) => {
      const { weight, weightmetric, from, to } = parcelPayload
      new Parcel({
        weight, weightmetric, from, to,
        placedBy: userId,
        sentOn: new Date().toISOString(),
        status: "placed",
        currentLocation: new Date().toISOString(),
        deliveredOn: null
      }).save().then((p) => {
        request(server)
          .patch(`${API_V1}/parcels/${p.id}/cancel`)
          .set('x-access-token', token)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data[0]).to.have.property('id').not.eql(null);
            expect(res.body.data[0]).to.have.property('message').equal("Order successfully canceled")
            done();
          })
      })
    })

    it("Changes a parcel delivery order (created by the correct user) destination, returning 200 and updated parcel details", (done) => {
      request(server)
        .patch(`${API_V1}/parcels/${parcelId}/${userId}/destination`)
        .set('x-access-token', token)
        .send({newDestination: "NEW DESTINATION"})
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data[0]).to.have.property('id').equal(parcelId);
          expect(res.body.data[0]).to.have.property('to').equal("NEW DESTINATION");
          expect(res.body.data[0].message).to.equal("Parcel destination updated!");
          done();
        })
    })

    it("Ensures that only the user that created the parcel can change destination, returning 403", (done) => {
      //create a new user
      User.create({firstname:"Albert", username:"Einstein", password:"password"})
      .then((user) => {
        request(server)
        .patch(`${API_V1}/parcels/${parcelId}/${user.id}/destination`)
        .set('x-access-token', token)
        .send({newDestination: "NEW DESTINATION"})
        .end((err, res) => {
          expect(res.body).to.have.status(403);
          expect(res.body).to.have.property('error').eql('this user cannot change the destination of the parcel');
          done();
        })
      })
    })

    it("Prevents the creator (user) from changing the destination of an already delivered order, returns 409", (done) => {
      Parcel.findByIdAndUpdate(parcelId, { $set: {status: "delivered"}})
      .then(() => {
        request(server)
        .patch(`${API_V1}/parcels/${parcelId}/${userId}/destination`)
        .set('x-access-token', token)
        .send({newDestination: "NEW DESTINATION"})
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property('error').eql('Cannot change the destination, already delivered')
          done();
        })
      })

    })

  })
})

