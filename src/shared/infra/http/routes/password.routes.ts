import { ResetPasswordController } from '@modules/accounts/useCases/ResetPassword/ResetPassworController';
import { SendForgotPasswordEmailController } from '@modules/accounts/useCases/SendForgotPasswordEmail/SendForgotPasswordEmailController';
import { Router } from 'express';

const passwordRoutes = Router();

const sendForgotPasswordEmailController = new SendForgotPasswordEmailController();
const resetPasswordController = new ResetPasswordController();

passwordRoutes.post('/forgot', sendForgotPasswordEmailController.handle);

passwordRoutes.post('/reset', resetPasswordController.handle);

export { passwordRoutes };
