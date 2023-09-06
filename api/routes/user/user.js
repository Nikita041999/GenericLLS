import express from 'express';
const router = express.Router();
import { changePassword, loginRoute,sigupRoute,forgetPasswordMail } from '../../middleware/user/user.js';

const jwtMiddleware = (req, res, next) => {
  console.log('');
    // if (req.body.token) {
    //     let data = verifyJWT(req.body.token)
    //     console.log("email in verufy token----->",data);
    //     req.body.email = data.email;
    // }
    // next();
  }

router.post('/login',loginRoute)
router.post('/signup',sigupRoute)
router.post('/reset-password',forgetPasswordMail)
router.post('/change-password',changePassword)
// router.post('/logout',logoutRoute)

export default router;