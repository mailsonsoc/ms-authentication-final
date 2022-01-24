import express, {Request, Response} from 'express';
import jwtAuthenticationMiddleware from './middlewares/jwt-authentication.middleware';
import errorHandler from './middlewares/error-handler.middleware';
import authorizationRoute from './routes/authorization.route';
import userRoute from './routes/user.route';
import db from './db';

const app = express();
//configurações da aplicação
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configurações de rotas
app.use('/users',jwtAuthenticationMiddleware, userRoute);
app.use('/authorization', authorizationRoute);

//configuração dos handlers de Erro
app.use(errorHandler);

app.use('/', (req: Request, res: Response) => {
    res.json({ message: 'ok' });
});

//inicialização do servidor
app.listen(3000, () => {
    console.log('Aplicação executando na porta 3000!');
})

process.on('SIGTERM', () => {
    db.end(() => {
        console.log('database connection closed!')
    });
    server.close(() => {
        console.log('server on 3000 closed!');
    });
})