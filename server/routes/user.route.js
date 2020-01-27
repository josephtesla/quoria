import UserController from '../controllers/user.controller';

export default function userRouter(router) {

  router.get(`/:userId/parcels`, UserController.getParcelsByUser);

  router.get(`/:userId/isAdmin`, UserController.checkIfAdmin);

  return router;
}