import { AuthenticateUserController } from '@modules/accounts/useCases/AuthenticateUser/AuthenticateUserController';
import { RefreshTokenController } from '@modules/accounts/useCases/RefreshToken/RefreshTokenController';
import { Router } from 'express';

const authenticationRoutes = Router();
const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

authenticationRoutes.post('/sessions', authenticateUserController.handle);
authenticationRoutes.post('/refresh-token', refreshTokenController.handle);

export { authenticationRoutes };
