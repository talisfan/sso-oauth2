import ExternalApi from "../base/ExternalApi";

export default class AuthProvider extends ExternalApi{    
    constructor(){
        super('');
    }

    public async login(email: string, password: string): Promise<any>{
        if(!email || !password) throw({ status: 401 });

        let res: any = await this.doRequest({
            url: String(process.env.AUTH_PROVIDER_LOGIN_ENDPOINT),
            method: 'POST',
            body: { email, password }
        }, 'AuthProvider-Auth');

        return{
            sessionId: res.data[String(process.env.AUTH_PROVIDER_RESPONSE_SESSION_COOKIES)]
        };
    }

    public async getUserInfo(accessToken: string): Promise<any>{
        if(!accessToken) throw({ status: 401 });

        let res: any = await this.doRequest({
            url: String(process.env.AUTH_PROVIDER_BASE_URL),
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }, 'AuthProvider-Auth');

        return{
            sessionId: res.data[String(process.env.AUTH_PROVIDER_PROP_RESPONSE_SESSION)]
        };
    }
}