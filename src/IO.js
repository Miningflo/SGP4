import TLE from "./TLE.js";

export default {readTle}

/**
 * Parse a string containing one or multiple TLE elements into an array of TLE objects
 * @param {string} fulltle Raw data string
 * @returns {[TLE]} An array of TLE objects
 */
export function readTle(fulltle) {
    fulltle = fulltle.replace(/\s*[\r\n]$/gm, "");
    let tlelines = fulltle.split("\n");

    let res = [];
    let tle = {};
    tlelines.forEach(line => {
        if(line.length > 24){
            if(line[0] === "1"){
                tle.line1 = line;
            }else{
                tle.line2 = line;
                res.push(new TLE(tle));
                tle = {};
            }
        }else{
            tle.name = line;
        }
    });

    return res;
}
