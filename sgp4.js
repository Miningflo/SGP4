// MIT License
//
// Copyright (c) 2020 Flore De Bosscher
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


/**
 * This is the class for constants
 */
class C {
    static ke = .743669161E-1; // (rad/min)^(3/2)
    static xmnpda = 1440.0; // minutes per day
    static k2 = 5.413080E-4;

    static torad(x) {
        return x / 180 * Math.PI;
    }

    static todeg(x) {
        return x * 180 / Math.PI;
    }

    static sin(x) {
        return Math.sin(this.torad(x));
    }

    static cos(x) {
        return Math.cos(this.torad(x));
    }

    static asin(x) {
        return this.todeg(Math.asin(x));
    }

    static epochdate(year, days) {
        let yr = (year < 57) ? year + 2000 : year + 1900;
        let date = new Date(yr, 0, 1);
        date.setTime(date.getTime() + days * 86400000); // support for fractional days
        return date;
    }

    static getSolarPosition(date) {
        // calculate declination of the sun
        let first = new Date(date.getFullYear(), 0, 1); // jan 1st
        let n = ((date - first) / 1000 / 60 / 60 / 24); // days since jan 1st (not rounded)
        let declination = C.asin(
            C.sin(-23.44) *
            C.cos(
                360 / 365.24 * (n + 10) +
                360 / Math.PI * 0.0167 *
                C.sin(
                    360 / 365.24 * (n - 2)
                )
            )
        );

        let t = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + date.getUTCMilliseconds() / 3600000;
        let bsun = declination;
        let lsun = 180 - 15 * t;
        // TODO: Use other coordinate system with distance from earth included
        return [lsun, bsun];
    }

    static isLit(date) {
        // TODO: calculate if sat at location is lit at date
        let sunloc = this.getSolarPosition(date);
        return true;
    }

    static parse(number) {
        // decimal point assumed
        // TODO: verify correctness
        return parseFloat(number.charAt(0) + "." + number.substr(1, 5) + "e" + number.substr(-2));
    }
}


/**
 * This class contains the decoded data from a single TLE
 */
class TLEData {
    constructor(lines) {
        /* Decode TLE */
        if (lines.length === 2) {
            lines.unshift("UNKNOWN");
        }
        this.satname = lines[0].trim();
        this.satnum = parseInt(lines[1].slice(2, 7));
        this.classification = lines[1].charAt(7);
        this.epochyear = parseInt(lines[1].slice(18, 20));
        this.epochdays = parseFloat(lines[1].slice(20, 32));
        this.epochdate = C.epochdate(this.epochyear, this.epochdays);
        this.ndot = parseFloat(lines[1].slice(33, 43)); // revs/day² => change in rev/day = accel
        this.nddot = C.parse(lines[1].slice(44, 52)); // revs/day³ => change in accel
        this.bstar = C.parse(lines[1].slice(53, 61)); // 1/rad
        this.elem = parseInt(lines[1].slice(64, 68));

        this.inclo = parseFloat(lines[2].slice(8, 16)); // deg
        this.nodeo = parseFloat(lines[2].slice(17, 25)); // deg
        this.ecco = parseFloat("." + lines[2].slice(26, 33));
        this.argpo = parseFloat(lines[2].slice(34, 42)); // deg
        this.mo = parseFloat(lines[2].slice(43, 51)); // deg
        this.no = parseFloat(lines[2].slice(52, 63)); // orbits/day
        this.revs = parseInt(lines[2].slice(63, 68));

        /* Convert input */
        this.nodeo = C.torad(this.nodeo);
        this.argpo = C.torad(this.argpo);
        this.mo = C.torad(this.mo);
        this.inclo = C.torad(this.inclo);
        this.no = this.no * 2 * Math.PI / C.xmnpda; // # rev per min in rad
        this.ndot = this.ndot * 2 * Math.PI / Math.pow(C.xmnpda, 2); // # rev / min² in rad
        this.nddot = this.nddot * 2 * Math.PI / Math.pow(C.xmnpda, 3); // # rev / min³ in rad


        /* Non-time dependant equations */
        let a1 = Math.pow(C.ke / this.no, 2 / 3);
        let deltatemp = (3 / 2) * C.k2 * (
            (3 * Math.pow(Math.cos(this.inclo), 2) - 1) /
            Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2)
        );
        let delta1 = deltatemp / Math.pow(a1, 2);
        let a0 = a1 * (1 - (1 / 3) * delta1 - Math.pow(delta1, 2) - (134 / 81) * Math.pow(delta1, 3));
        let delta0 = deltatemp / Math.pow(a0, 2);
        let nd20 = this.no / (1 + delta0);
        let ad20 = a0 / (1 - delta0);

        console.log(nd20, ad20);
    }

    sgp4(t) {

    }

    getLonLat(date) {
        return [20, 30]
    }
}

/**
 * Parse a whole TLE file
 * @param fulltle {string}
 * @returns {Array}
 */

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
