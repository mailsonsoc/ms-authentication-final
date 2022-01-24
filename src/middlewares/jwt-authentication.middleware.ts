import JWT from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import {ForbiddenError} from '../errors/forbidden.error';
import userRepository from '../repositories/user.repository';


const jwtAuthenticationMiddleware = async (req:Request, res:Response, next: NextFunction): Promise<void> => {
    try {
        const authorizationHeader = req.headers['authorization'];

        if(!authorizationHeader){
            throw new ForbiddenError({ log: 'Credenciais not found' });
        }

        const [authenticationType, token] = authorizationHeader.split(' ');

        if(authenticationType !== 'Bearer' || !token){
            throw new ForbiddenError({ log: 'Invalid authorization type' });
        }

        try {
            const tokenPayload = JWT.verify(token, 'my_secret_key');

        if(typeof tokenPayload !== 'object' || !tokenPayload.sub){
            throw new ForbiddenError({ log: 'Invalid token' });
        }

        const user = await userRepository.findById(tokenPayload.sub);
            req.user = user;
            return next();

        } catch (error) {
            throw new ForbiddenError({ log: 'Invalid token' });
        }

    } catch (error) {
        next(error);
    }
}

export default jwtAuthenticationMiddleware;
