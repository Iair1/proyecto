const config = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: process.env.DB_HOST === 'localhost'
        ? false                            // Docker en CI sin SSL
        : { rejectUnauthorized: false }    // Neon siempre con SSL
}


export default config;