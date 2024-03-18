import { login, refreshToken } from "../auth/auth.service";

export const registerRoutes = (server:any) => {
    server.post('/auth/login', login);
    server.post('/auth/refreshtoken', refreshToken);
}