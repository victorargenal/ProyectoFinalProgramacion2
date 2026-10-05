module.exports = {
    HOST: "ep-blue-fire-aevgpu1c-pooler.c-2.us-east-2.aws.neon.tech",
    USER: "neondb_owner",
    PASSWORD: "npg_RYFpbeo61AEr",
    DB: "neondb",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};