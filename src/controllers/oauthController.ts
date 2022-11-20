import { Request, Response, NextFunction } from "express";
import OAuth from "../models/entities/OAuth";
import AuthProvider from '../models/entities/AuthProvider';

async function getAuthorizationCode(req: Request, res: Response, next: NextFunction){
    try{
        const { state, redirect_uri, email, password } = req?.body;
            
        const authProviderObj = new AuthProvider();
        const { sessionId } = await authProviderObj.login(email, password);

        const oauthObj = new OAuth();
        const code = oauthObj.generateAndPersistCode(sessionId, email);

        res.set({ 'session': sessionId });
        
        res.redirect(redirect_uri + `?code=${code}&state=${state}`);
    }catch(error){
        console.error(error);
        next(error);
    }
}

async function getAcessToken(req: Request, res: Response, next: NextFunction){
    try{
        const { code } = req?.body;
        const session = String(req.headers.session);
        
        const oauthObj = new OAuth();
        const response = oauthObj.accessTokenExchange(code, session);
        return res.status(200).send(response);
    }catch(error){
        console.error(error);
        next(error);
    }
}

async function getUserInfo(req: Request, res: Response, next: NextFunction){
    try{
        const token = String(req.headers.authorization);
    
        const authProviderObj = new AuthProvider();
        const response = await authProviderObj.getUserInfo(token.replace('Bearer ', ''));
        return res.status(200).send(response);
    }catch(error){
        console.error(error);
        next(error);
    }
}

export { getAuthorizationCode, getAcessToken, getUserInfo };