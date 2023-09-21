import express from 'express';
import { changePassword, forgetPassword, login } from '../../middleware/admin/admin';


const router = express.Router();

router.post('/admin-login',login)
// router.post('/admin/change-password',changePassword)
// router.post('/admin/forget-password',forgetPassword)

export default router