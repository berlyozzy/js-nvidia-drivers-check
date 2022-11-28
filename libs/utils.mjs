import fetch from 'node-fetch';

export const get_gpus = async () => {
    const request_url = "https://raw.githubusercontent.com/ZenitH-AT/nvidia-data/main/gpu-data.json"
    const response = await fetch(request_url);
    return await response.json();
}

export const get_os = async () => {
    const request_url = "https://raw.githubusercontent.com/ZenitH-AT/nvidia-data/main/os-data.json"
    const response = await fetch(request_url);
    return await response.json();
}

export const get_driver_link = async ({pfid="782", osid="57", exception="No certified downloads were found for this configuration."}) => {
    const response = await fetch(`https://www.nvidia.com/Download/processDriver.aspx?pfid=${pfid}&rpf=1&osid=${osid}&lid=1&dtcid=${ osid == "57" || osid == "135" ? "1" : "0"}`);
    const html = await response.text();

    if(html.includes(exception)){

        return false

    }else{
        return {
            url : html,
            id : html.match(/(?<=\/)\d+(?=\/)/g)[0]
        }
    }

}

// Beware CORS!
export const get_driver_details = async (id) => {

    const response = await fetch(`http://www.nvidia.com/Download/driverResults.aspx/${id}`);
    const html = await response.text();
    const driver_version_reg = /(?<=<title id="pageTitle">.+)\d{1,3}\.\d{1,3}(?=.+<\/title>)/g
    const release_date_reg = /(?<=<meta name="description".+)\d{4}\.\d{1,2}\.\d{1,2}(?="\s?>)/g

    return {
        version : html.match(driver_version_reg)[0],
        release_date : html.match(release_date_reg)[0],
    }
}

export const parse_os = (string) => {

    const extract = string.match(/([\p{L} 0-9-.]+) ([\(0-9., a-zA-Z\)]+) ([\(0-9.\-_a-zA-Z\)]+)/u)
    const os_name = extract[1].split(" ").slice(0, 2).join(" ").trim();
    let os_version = extract[1].trim().match(/(?![ a-z0-9]+|Vista)(?<!^)[\p{L} ]+(?![0-9])/gu)
    const os_bit = extract[1].trim().split(" ").slice(-1)[0]
    const buildID = extract[2].replace("(", "").replace(")", "").replace(", Build ", ".").match(/^[0-9.]+/)[0]
    let is_preview = false
  
    if(os_version !== null){
        is_preview = os_version[0].includes("Insider Preview")
        os_version = os_version[0].includes("Insider Preview") ? os_version[0].replace("Insider Preview","").trim() : os_version[0]
    }else{
        os_version = ""
    }

    return {
        os_name,
        os_full: extract[1].trim(),
        os_bit,
        os_version,
        buildID,
        release: extract[3].replace("(", "").replace(")", ""),
        is_preview,
    }

}