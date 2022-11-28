const get_driver_link = async ({pfid="782", osid="57", exception="No certified downloads were found for this configuration."}) => {
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

const get_driver_details = async (id) => {

    const response = await fetch(`https://cors-anywhere.herokuapp.com/http://www.nvidia.com/Download/driverResults.aspx/${id}`);
    const html = await response.text();
    const driver_version_reg = /(?<=<title id="pageTitle">.+)\d{1,3}\.\d{1,3}(?=.+<\/title>)/g
    const release_date_reg = /(?<=<meta name="description".+)\d{4}\.\d{1,2}\.\d{1,2}(?="\s?>)/g

    return {
        version : html.match(driver_version_reg)[0],
        release_date : html.match(release_date_reg)[0],
    }
}

export { get_driver_link, get_driver_details };