require('dotenv').config();

type TConfig = {
    port: number;
}

const config = {
    port: parseInt(process.env.PORT as string)
}

console.log(config);