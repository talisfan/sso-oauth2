import { Request, Response, NextFunction } from "express";
import express from 'express';
import oauthRoutes from './routes/oauthRoutes';
const app = express();

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, GET');
        return res.status(200).send();
    }
    
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/oauth', oauthRoutes);

app.use(function (error: any, req: Request, res: Response) {
    if (!error.status) {
        error.status = 500;
    }
    console.error(JSON.stringify(error));

    res.status(error.status);
    delete error.status;
    return res.send(error.body || error.message || error);
});

app.use(function (req: Request, res: Response, next: NextFunction) {
    return res.status(404).send();
});

const port = Number(process.env.WEB_PORT) || 3000;
app.listen(port);

console.log(`Servidor rodando na porta ${port}! | Ambiente: ${process.env.NODE_ENV || 'PROD'}`);