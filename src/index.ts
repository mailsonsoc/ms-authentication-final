import express from 'express';
import basicAuthenticationMiddleware from './middlewares/basic-authentication.middleware';
import errorHandler from './middlewares/error-handler.middleware';
import authorizationRoute from './routes/authorization.route';
import statusRoute from './routes/status.route';
import userRoute from './routes/user.route';

const app = express();
//configurações da aplicação
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configurações de rotas
app.use(userRoute);
app.use(statusRoute);
app.use(authorizationRoute);

//configuração dos handlers de Erro
app.use(errorHandler);

//inicialização do servidor
app.listen(3000, () => {
    console.log('Aplicação executando na porta 3000!');
})