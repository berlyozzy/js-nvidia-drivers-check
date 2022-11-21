import fs from 'fs';
import { get_gpus, get_os } from './utils.mjs';


const main = async () => {

    const template = `const lists = {
        gpu : ${JSON.stringify(await get_gpus())},
        os : ${JSON.stringify(await get_os())}
}

export default lists
    `

    fs.writeFileSync('./libs/device-ids.mjs', template, { encoding : "utf-8" })
}

main();