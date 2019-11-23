import { Router } from 'express';

// Controllers
import AuthController from './app/controllers/authController';
import UserController from './app/controllers/userController';
import AuthorizationController from './app/controllers/authorizationController';
import DeviceController from './app/controllers/deviceController';

// Middlewares
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/register', UserController.store);
routes.post('/session', AuthController.store);

routes.use(AuthMiddleware);

routes.get('/users', UserController.index);

// Authorization routes
routes.get('/authorization', AuthorizationController.index);
routes.get('/authorization/devices', AuthorizationController.show);
routes.post('/authorization', AuthorizationController.store);
routes.delete(
  '/authorization/:authorizationId',
  AuthorizationController.delete
);

// Devices routes
routes.get('/devices', DeviceController.index);
routes.post('/devices', DeviceController.store);
routes.get('/devices/:deviceId', DeviceController.show);
routes.post('/devices/:deviceId', DeviceController.publish);
routes.put('/devices/:deviceId', DeviceController.update);
routes.delete('/devices/:deviceId', DeviceController.delete);
export default routes;
