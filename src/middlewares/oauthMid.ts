import { Request, Response, NextFunction } from "express";

export function authorizationCode(req: Request, res: Response, next: NextFunction) {
    const { state, redirect_uri, email, password } = req?.body;
    if(!state || !redirect_uri || !email || !password){
        return res.status(400).send();
    }else{
        next();
    }
}

export function accessTokenExchange(req: Request, res: Response, next: NextFunction){
    const { code, client_id, client_secret } = req?.body;

    if(!code || !client_id || !client_secret || !req.headers.session){
        return res.status(400).send();
    }else if(
        client_id != String(process.env.CLIENT_ID) 
        || client_secret != String(process.env.CLIENT_SECRET)
    ){
        return res.status(401).send();
    }else{
        next();
    }
}

export function getUserInfo(req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization;
    if(!token || !token.includes('Bearer ')) return next({ status: 401 });
    else next();
}

export function isAuthorized(req: Request, res: Response, next: NextFunction) {    
    if (req.cookies.authorized) next();
    else {
        var params = req.query;
        params.backUrl = req.path;
        res.redirect('/login?' + params);
    }
};