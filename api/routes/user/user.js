import express from 'express';
const router = express.Router();
import { changePassword, loginRoute,sigupRoute,forgetPasswordMail,githubAccessToken ,githubUserData,googleAccessToken,googleUserData,linkedAccessToken,linkedAccessData,facebookAccessToken,facebookAccessData,twitterAccessToken,twitterAccessData} from '../../middleware/user/user.js';
import { login,quizDataAdd,quizList,editQuizList,deleteQuizList } from '../../middleware/admin/admin.js';


const jwtMiddleware = (req, res, next) => {
  console.log('');
    // if (req.body.token) {
    //     let data = verifyJWT(req.body.token)
    //     console.log("email in verufy token----->",data);
    //     req.body.email = data.email;
    // }
    // next();
  }
  router.get('/',() => {
    console.log("Hello there");
  })

// user routes  
router.get('/getGithubAccessToken',githubAccessToken)
router.get('/getGithubUserData',githubUserData)
router.get('/getGoogleAccessToken',googleAccessToken)
router.get('/getGoogleUserData',googleUserData)
router.get('/getLinkedInAccessToken',linkedAccessToken)
router.get('/getLinkedUserData',linkedAccessData)
router.get('/getFacebookAccessToken',facebookAccessToken)
router.get('/getFacebookUserData',facebookAccessData)
router.get('/getTwitterAccessToken',twitterAccessToken)
router.get('/getTwitterUserData',twitterAccessData)


router.post('/api/login',loginRoute)
router.post('/api/signup',sigupRoute)
router.post('/api/reset-password',forgetPasswordMail)
router.post('/api/change-password',changePassword)
// router.post('/logout',logoutRoute)


router.post('/admin/admin-login',login)
router.post('/admin/quiz-data-add',quizDataAdd)
router.get('/admin/quiz-list',quizList)
router.post('/admin/edit-quiz-list',editQuizList)
router.post('/admin/delete-question',deleteQuizList)

export default router;