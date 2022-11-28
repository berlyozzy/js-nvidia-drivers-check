import { get_driver_link, get_driver_details, parse_os } from "../libs/utils.mjs";
import Lists from '../libs/device-ids.mjs'

const main = async () => {

    // query gpu and os list from GitHub
    // const pfids = await get_gpus()
    // const osids = await get_os()

    // get gpu and os from generate list
    const {
        gpu : pfids,
        os : osids
    } = Lists;

    const gpu = "NVIDIA GeForce RTX 2080 SUPER".replace("NVIDIA", "").trim()
    const os_version = "Windows 10 Enterprise 64-bit (10.0, Build 18363) (18362.19h1_release.190318-1202)"
    const os_details = parse_os(os_version)
    const osid = osids.find(e => e.name == `${os_details.os_name} ${os_details.os_bit}`).id

    // Look for pfid, if not found - default to GTX 980

    const pfid = Object.keys(pfids.desktop).includes(gpu) ? pfids.desktop[gpu] :
    Object.keys(pfids.notebook).includes(gpu) ? pfids.notebook[gpu] : "755"

    const driver_url = await get_driver_link({pfid, osid})
    const driver_details = await get_driver_details(driver_url.id)
    
    console.log({
        osid,
        os : os_details.os_full,
        gpu,
        ...driver_details,
        driver_url,
    })
}

// const main = async () => {

//     const {
//         gpu : pfids,
//         os : osids
//     } = Lists;

//     const gpu = "NVIDIA GeForce RTX 2080 SUPER".replace("NVIDIA", "").trim()
//     const os_version = "Windows 10 Enterprise 64-bit (10.0, Build 18363) (18362.19h1_release.190318-1202)"
//     const os_details = parse_os(os_version)
//     const osid = osids.find(e => e.name == `${os_details.os_name} ${os_details.os_bit}`).id
//     const installed_driver_version = "26.21.0014.4166 (English)".trim().match(/[\d.]+/)[0].slice(-6).replace(".","");
//     let installed_driver_date = "06.12.2019 0:00:00, 961960 bytes".trim().match(/\d{2}(\.|\/)\d{2}(\.|\/)\d{4}/g)[0].split(/[./]/);
//     installed_driver_date = Date.parse(`${installed_driver_date[1]}.${installed_driver_date[0]}.${installed_driver_date[2]}`)

//     const pfid = Object.keys(pfids.desktop).includes(gpu) ? pfids.desktop[gpu] :
//     Object.keys(pfids.notebook).includes(gpu) ? pfids.notebook[gpu] : "755"

//     const driver_url = await get_driver_link({pfid, osid})
//     const driver_details = await get_driver_details(driver_url.id)

//     const is_up_to_date = Number(installed_driver_version) >= Number(driver_details.version.replace(".",""));
//     const days_difference = Math.floor( ( Date.parse(driver_details.release_date) - installed_driver_date ) / 86400000 )


//     console.log({
//         osid,
//         os : os_details.os_full,
//         gpu,
//         ...driver_details,
//         comparison : {
//             installed_driver_version : installed_driver_version.slice(0,3) + "." + installed_driver_version.slice(3),
//             installed_driver_date,
//             days_difference : `${days_difference} Days Old`,
//             is_up_to_date
//         },
//         driver_url,
//     })
// }

main()