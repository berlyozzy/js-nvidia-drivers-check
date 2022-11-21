import { get_driver_link, get_driver_details } from "../libs/utils.mjs";
import Lists from '../libs/device-ids.mjs';
import { writeFile } from 'fs';

const test_list = [
    "GeForce 7025",
    "Quadro FX 1500",
    "GeForce4 Ti 4600",
    "GeForce GTX 470",
    "GeForce GTX 980",
    "GeForce RTX 2070",
    "GeForce 9600M GS",
    "GeForce GTX 280M",
    "GeForce 310M",
    "GeForce GT 750M"
]

const {
    gpu : pfids,
    os : osids
} = Lists;

const main = async () => {

    for(const gpu of test_list){

        const pfid = Object.keys(pfids.desktop).includes(gpu) ? pfids.desktop[gpu] :
        Object.keys(pfids.notebook).includes(gpu) ? pfids.notebook[gpu] : "755"

        const drivers = {}

        for(const {name, id} of osids){

            const driver_url = await get_driver_link({pfid, osid : id})

            if(driver_url.id !== undefined){

                if(!Object.keys(drivers).includes(name)){
                    drivers[name] = new Set([driver_url.id])
                }else{
                    drivers[name].add(driver_url.id)
                }

            }

        }

        for(const windows in drivers){
            
            const links = []

            for( const driver of drivers[windows] ){

                const driver_details = await get_driver_details(driver)

                links.push({
                    ...driver_details
                })
    
            }

            drivers[windows] = links

        }

        writeFile(`files/${gpu.replaceAll(" ", "+")}.json`, JSON.stringify(drivers), (error) => {
            if(error !== null){
                console.log(error)
            }else{
                console.log(`Completed: files/${gpu.replaceAll(" ", "+")}.json ✅`)
            }
        })

    }

}

main()