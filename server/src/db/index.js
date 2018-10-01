import sql from 'mssql';

// .env file required with environment-specific values, e.g., 
//DB_SERVER="<host>"
//DB_NAME="<database>"
//DB_UID="<user>"
//DB_PWD="<password>"
//DB_INSTANCE="<instance>"
//DB_PORT="<port>"

export default (rollbar) => {
    const db = new sql.ConnectionPool({
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        user: process.env.DB_UID,
        password: process.env.DB_PWD,
        port: process.env.DB_PORT,
    });
    db.on('error', error => {
        rollbar.error(error);
        console.log(error);
        throw new Error('Database error');
    });
    return db;
};
