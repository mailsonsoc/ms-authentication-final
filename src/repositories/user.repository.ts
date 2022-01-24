import config from 'config';
import  DatabaseError  from "../errors/database.error";
import User from "../model/user.model";
import db from "../db";

const authenticationCryptKey = config.get<string>('authentication.cryptKey');
class userRepository{

    async findAllUsers(): Promise<User[]> {
        const query = `
            SELECT uuid, username
            FROM application_user
            `;

        const {rows} = await db.query<User>(query);
        return rows || [];
    } //diz para o bd "execute essa query e depois de processar o resultado ponha dentro de 'result'."

    async findById(uuid: string): Promise<User>{
        try {
            const query = `
            SELECT uuid, username
            FROM application_user
            WHERE uuid = $1
        `;

        const values = [uuid];
        
        const {rows} = await db.query<User>(query, values);
        const [user] = rows;

        return user;
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        }

    } 

    async findByUsernameAndPassword(username:string, password:string): Promise<User | null>{
        try {
            const query = `
            SELECT uuid, username
            FROM application_user
            WHERE uuid = $1
            AND password = crypt($2, '${authenticationCryptKey}')
            `
            const values = [username, password];
            const {rows} = await db.query<User>(query, values);
            const [user] = rows;
            return user || null;
        } catch (error) {
            throw new DatabaseError('Erro na consulta por username e password', error);
        }
    }

    async create(user: User): Promise<string>{
        try {
            const script = `
                INSERT INTO application_user (
                    username, 
                    password
                ) 
                VALUES ($1, crypt($2, '${authenticationCryptKey}')) 
                RETURNING uuid
            `;

            const values = [user.username, user.password];
            const queryResult = await db.query<{ uuid: string }>(script, values);

            const [row] = queryResult.rows;
            return row.uuid;
        } catch (error) {
            throw new DatabaseError('Erro ao inserir usuário');
        }
    }

    async update(user: User): Promise<void>{
        try {
            const script = `
                UPDATE application_user
                SET
                    username = $2,
                    password = crypt($3, '${authenticationCryptKey}')
                WHERE uuid = $1            
            `;

            const values = [user.uuid, user.username, user.password];
            await db.query(script, values);
        } catch (error) {
            throw new DatabaseError('Erro ao atualizar usuário');
        }

    }

    async remove(uuid: string): Promise<void>{
        try {
            const script = `
                DELETE 
                FROM application_user 
                WHERE uuid = $1
            `;

            const values = [uuid];
            await db.query(script, values);
        } catch (error) {
            throw new DatabaseError('Erro ao deletar usuário');
        }
}
}

export default new userRepository();