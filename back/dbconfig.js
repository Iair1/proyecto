const config = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 5432),
    ssl: (() => {
        if (typeof process.env.DB_SSL !== "undefined") {
            return ["true", "1", "yes"].includes(process.env.DB_SSL.toLowerCase());
        }
        return !["localhost", "127.0.0.1"].includes(process.env.DB_HOST);
    })() ? { rejectUnauthorized: false } : false,
}


export default config;