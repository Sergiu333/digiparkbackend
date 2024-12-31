module.exports = {
    host: 'idocumen.mysql.tools',
    user: 'idocumen_digi',
    password: '^U3T;3si3u',
    database: 'idocumen_digi',
    port: 3306,
    ssl: {
        rejectUnauthorized: false
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    },

}
