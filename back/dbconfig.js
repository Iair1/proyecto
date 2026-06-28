const config = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: process.env.DB_HOST === 'localhost' 
        ? false                              // sin SSL en CI/local
        : { rejectUnauthorized: false }      // con SSL en producción
}


export default config;