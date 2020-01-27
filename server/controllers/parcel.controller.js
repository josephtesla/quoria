import { User, Parcel } from "../models/models";

export default class ParcelController {

  //fetch all parcel delivery orders
  static getParcels(req, res) {

    Parcel.find({})
    .sort({sentOn: -1})
    .then(
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
    const { userId } = req.params;
    const { weight, weightmetric, from, to } = req.body;
    const parcelEntry = {
      placedBy: userId,
      weight, weightmetric, from, to,
      sentOn: new Date().toISOString(),
      status: "placed",
      currentLocation: from,
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
    ).catch((error) => setImmediate(() => {
      console.log(error)
      res.status(500).json({status: 500, error: "Error creating parcel delivery order"})
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
          return res.status(409).json({ status: 409, error: 'Cannot change the destination, already delivered' })
        }

        parcel.to = newDestination;
        parcel.save().then(() => res.status(200).json({
          status: 200,
          data: [{
            id: parcel.id,
            to: newDestination,
            message: 'Parcel destination updated!'
          }]
        })).catch(() => setImmediate(() => res.status(500).json({ status: 500, error: "Error while updating parcel destination!" })));

      }
    )

  }


  static changeParcelStatus(req, res) {
    const { parcelId, userId } = req.params;
    console.log(userId)
    User.findById(userId).then(
      user => {
        if (!user.isAdmin) {
          return res.status(403)
          .json({
            status: 403,
            error: "Only admin can change parcel status!" 
          });
        }
        const { status } = req.body;
        Parcel.findById(parcelId).then(
          parcel => {
            parcel.status = status;
            parcel.deliveredOn = (status == 'delivered') ? new Date().toISOString() : null;
            parcel.save();
            return res.status(200).json({
              status: 200,
              data: [{
                id: parcel.id,
                status: parcel.status,
                message: "parcel status updated!"
              }]
            })
          }
        ).catch(() => setImmediate(() => res.status(500).json({ status: 500, error: "Error while updating parcel status!" })))
      }
    )
  }


  static changeParcelCurrentLocation(req, res) {
    const { parcelId, userId } = req.params;
    User.findById(userId).then(
      user => {
        if (!user.isAdmin) {
          return res.status(403).json({ status: 403, error: "Only admin can change parcel current location!" });
        }
        const { currlocation } = req.body;
        Parcel.findById(parcelId).then(
          parcel => {
            parcel.currentLocation = currlocation;
            parcel.save();
            return res.status(200).json({
              status: 200,
              data: [{
                id: parcel.id,
                status: parcel.currentLocation,
                message: "parcel location updated!"
              }]
            })
          }
        ).catch(() => setImmediate(() => res.status(500).json({ status: 500, error: "Error while updating parcel location!" })))
   
      }
    )
  }

}

const clearDatabase = () => {
  return Parcel.deleteMany({}).then(() => User.deleteMany({}));
}

// Parcel.findByIdAndUpdate("5E1B78E0FFBCE024281F5004", {$set: {status: 'delivered'}})
// .then(() => {
//   Parcel.findByIdAndUpdate("5E1B77E8FFBCE024281F5002", {$set: {status: 'transit'}})
//   .then(() => {
//     Parcel.findByIdAndUpdate("5E1B71C4EE36ED1DCCC8EC66", {$set: {status: 'delivered'}})
//     .then(() => {
//       console.log("updated")
//     })
//   })

// })
