import * as oauthControllers from '../controllers/oauthController';
import { Router } from 'express';
const router = Router();

router.post('/login', oauthControllers.getAuthorizationCode);

router.post('/accessTokenExchenge', oauthControllers.getAcessToken);

router.get('/getUserInfo', oauthControllers.getUserInfo);

export default router;