import express from 'express';
// import { changePassword, forgetPassword, login } from '../../middleware/admin/admin';
import { loginRoute } from '../../middleware/user/user';

const router = express.Router();

router.post('/admin/admin-login',loginRoute)
// router.post('/admin/change-password',changePassword)
// router.post('/admin/forget-password',forgetPassword)

export default router