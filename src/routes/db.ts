import { Pool } from 'pg';

const connectionString = 'postgres://atxfcweo:dgy0zuFMAvUcA9MJxBxhnQz745WCfCYL@kesavan.db.elephantsql.com/atxfcweo';

const db = new Pool({connectionString});

export default db;