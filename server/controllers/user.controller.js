import { Parcel, User } from "../models/models";

export default class UserController {
  //Fetch all parcel delivery order by a specific user.
  static getParcelsByUser(req, res) {
    const { userId } = req.params;
    Parcel.find({ placedBy: userId })
    .sort({sentOn: -1})
    .then(
      (data) => res.status(200).json({ status: 200, data: data })
    ).catch((e) => setImmediate(() => {
      res.status(500).json({ status: 500, error: "Error occoured while fetching parcel delivery orders by user" })
    }))
  }

  static checkIfAdmin(req, res) {
    const { userId } = req.params;
    User.findById(userId).then((user) => (
      res.status(200).json({
        status: 200,
        is_admin: user.isAdmin
      })
    )).catch((e) => setImmediate(() => {
      res.status(500).json({ status: 500, error: "Error while checking if admin" })
    }))
  }

}