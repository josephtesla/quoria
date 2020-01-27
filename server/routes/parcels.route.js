import ParcelController from '../controllers/parcel.controller';

export default function parcelRouter(router) {

  router.get(`/`, ParcelController.getParcels);

  router.get(`/:parcelId`, ParcelController.getSingleParcel)

  router.patch(`/:parcelId/cancel`, ParcelController.cancelParcelOrder)

  router.post(`/:userId`, ParcelController.createParcelOrder)

  router.patch(`/:parcelId/:userId/destination`, ParcelController.changeParcelDestination)

  router.patch(`/:parcelId/:userId/status`, ParcelController.changeParcelStatus)

  router.patch(`/:parcelId/:userId/currentlocation`, ParcelController.changeParcelCurrentLocation)

  return router;
  
}