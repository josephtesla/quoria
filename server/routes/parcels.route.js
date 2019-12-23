import { User, Parcel } from "../models/models";

export default class parcelRouter {

  //fetch all parcel delivery orders
  static getParcels(req, res) {

    Parcel.find({}).then(
      (data) => {
        res.status(200).json({ status: 200, data: data })
      }
    ).catch((error) => setImmediate(() => {
      res.status(500).json({ status: 500, error: "Error occoured while fetching all parcel delivery orders" })
    }))
  }

  //GET single parcel delivery order
  static getSingleParcel(req, res) {
    const { parcelId } = req.params;
    Parcel.findById(parcelId).then(
      (data) => res.status(200).json({ status: 200, data: [data] })
    ).catch((error) => setImmediate(() => {
      res.status(500).json({ status: 500, error: "Error occoured while fetching parcel delivery order" })
    }))
  }


  //Fetch all parcel delivery order by a specific user.
  static getParcelsByUser(req, res) {
    const { userId } = req.params;
    Parcel.find({ placedBy: userId }).then(
      (data) => res.status(200).json({ status: 200, data: data })
    ).catch((e) => setImmediate(() => {
      res.status(500).json({ status: 500, error: "Error occoured while fetching parcel delivery orders by user" })
    }))
  }

  //Cancel a specific parcel delivery order.
  static cancelParcelOrder(req, res) {
    const { parcelId } = req.params;
    Parcel.findByIdAndDelete(parcelId).then(
      (data) => res.status(200).json({
        status: 200,
        data: [{
          id: parcelId,
          message: "Order successfully canceled"
        }]
      })
    ).catch((e) => setImmediate(() => {
      res.status(500).json({ status: 500, error: "Error occoured while cancelling parcel delivery order" })
    }))
  }

  static createParcelOrder(req, res) {
    const userId = req.params;
    const { weight, weightmetric, from, to } = req.body;
    const parcelEntry = {
      placedBy: userId,
      weight, weightmetric, from, to,
      sentOn: new Date().toISOString(),
      status: "placed",
      currentLocation: new Date().toISOString(),
      deliveredOn: null
    }

    Parcel.create(parcelEntry).then(
      (data) => res.status(201).json({
        status: 201,
        data: [{
          id: data.id,
          message: "Order successfully created"
        }]
      })
    ).catch(() => setImmediate(() => {
      res.status(500).json("Error creating parcel delivery order")
    }))
  }


  static changeParcelDestination(req, res) {
    const { parcelId, userId } = req.params;
    const { newDestination } = req.body;
    Parcel.findById(parcelId).then(
      (parcel) => {
        //Only the user who created the parcel should be able to change the destination
        if (parcel.placedBy != userId) {
          return res.status(403).json({ status: 403, error: "this user cannot change the destination of the parcel" })
        }

        if (parcel.status == 'delivered') {
          return res.status(409).json({ status: 409, error: 'Cannot changed the destination, already delivered' })
        }

        parcel.to = newDestination;
        parcel.save().then(() => res.status(200).json({
          status: 200,
          data: [{
            id: parcel.id,
            to: newDestination,
            message: 'Parcel destination updated!'
          }]
        }));

      }
    )

  }


  static changeParcelStatus(req, res) {
    const { parcelId, userId } = req.param;
    User.findById(userId).then(
      user => {
        if (!user.isAdmin) {
          return res.status(403).json({ status: 403, error: "Only admin can change parcel status!" });
        }
        const { status } = req.body;
        Parcel.findByIdAndUpdate(parcelId, { $set: { status: status } })
          .then((parcel) => res.status(200).json({
            status: 200,
            data: [{
              id: parcel.id,
              status: parcel.status,
              message: "parcel status updated!"
            }]
          })).catch(() => setImmediate(() => res.status(500).json({ status: 500, error: "Error while updating parcel status!" })))
      }
    )
  }


  static changeParcelCurrentLocation(req, res) {
    const { parcelId, userId } = req.param;
    User.findById(userId).then(
      user => {
        if (!user.isAdmin) {
          return res.status(403).json({ status: 403, error: "Only admin can change parcel current location!" });
        }
        const { currlocation } = req.body;
        Parcel.findByIdAndUpdate(parcelId, { $set: { currentLocation: currlocation } })
          .then((parcel) => res.status(200).json({
            status: 200,
            data: [{
              id: parcel.id,
              status: parcel.currentLocation,
              message: "parcel current Location updated!"
            }]
          })).catch(() => setImmediate(() => res.status(500).json({ status: 500, error: "Error while updating parcel location!" })))
      }
    )
  }



}
