require('dotenv').config();

type TConfig = {
    port: number;
}

const config = {
    port: parseInt(process.env.PORT as string)
}

export default config;