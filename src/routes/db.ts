import { Pool } from 'pg';

const connectionString = '<sua conexão com o db>';

const db = new Pool({connectionString});

export default db;
