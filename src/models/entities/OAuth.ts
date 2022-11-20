import * as jsonwebtoken from 'jsonwebtoken';

export default class OAuth {    

    public generateAndPersistCode(sessionId: string, email: string): string{        
        const code = jsonwebtoken.sign(
            { sessionId, email }, 
            String(process.env.SECRET_ASSIGNATURE),
            { expiresIn: 2*60 }
        );
        
        return code;
    }

    public accessTokenExchange(code: string, session: string): { 
        access_token: string, 
        expires_in: number
    }{
        try{
            const expiresIn = 5*60;

            const decoded = jsonwebtoken.verify(code, String(process.env.SECRET_CODE_ASSIGNATURE));
            if(decoded.sessionId != session) throw({ message: 'Invalid session' })

            delete decoded.exp;
            const accessToken = jsonwebtoken.sign(
                decoded,
                String(process.env.SECRET_ASSIGNATURE) + String(process.env.CLIENT_ID),
                { expiresIn }
            );

            return { access_token: accessToken, expires_in: expiresIn }
        }catch(error){
            throw({
                status: 401,
                message: error.message
            });
        }
    }
}