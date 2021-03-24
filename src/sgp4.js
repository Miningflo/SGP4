import Utils from './utils.js';
import C from './constants.js';

// /* Non-time dependant equations */
// let a1 = Math.pow(C.KE / this.no, 2 / 3);
// let deltatemp = (3 / 2) * C.K2 * (
//     (3 * Math.pow(Math.cos(this.inclo), 2) - 1) /
//     Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2)
// );
// let delta1 = deltatemp / Math.pow(a1, 2);
// let a0 = a1 * (1 - (1 / 3) * delta1 - Math.pow(delta1, 2) - (134 / 81) * Math.pow(delta1, 3));
// let delta0 = deltatemp / Math.pow(a0, 2);
// let nd20 = this.no / (1 + delta0);
// let ad20 = a0 / (1 - delta0);

function getLonLat(date) {
    return [20, 30]
}

class TLEParser {
    static loadtle(fulltle) {
        fulltle = fulltle.replace(/\s*[\r\n]$/gm, "");
        let tlelines = fulltle.split("\n");
        let res = [];
        let tle = [];
        tlelines.forEach(line => {
            tle.push(line);
            if (line[0] === "2") {
                res.push(new TLEData(tle));
                tle = [];
            }
        });
        return res;
    }
}
