import AuthController from '../controllers/auth.controller';

export default function authRouter(router) {
  
  router.post(`/signup`, AuthController.register);

  router.post(`/login`, AuthController.login);

  return router;

}

