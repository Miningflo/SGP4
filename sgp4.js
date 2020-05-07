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
class Constants {
    static ke = 8681663.653; // TODO: find out why it's this value
    static k2 = 5.413080E-4; // value given by NO. 3
    static s = 1.01222928; // TODO: correct?
    static xkmper = 6378.135; // value given by NO. 3
    static ae = 6378; // TODO: are we sure?
    static qoms2t = 1.88027916E-9; // value given by NO. 3
    static j3 = -.253881E-5; // value given by NO. 3
    static a30 = -this.j3 * Math.pow(this.ae, 3); // value given by NO. 3

    static torad(x) {
        return x / 180 * Math.PI;
    }

    static todeg(x) {
        return x * 180 / Math.PI;
    }

    /**
     * Julian date of epoch
     * @param year
     * @param days
     * @returns {number}
     */
    static jdep(year, days) {
        let yr = (year < 57) ? year + 2000 : year + 1900;
        let date = new Date(yr, 0, 1);
        date.setDate(date.getDate() + days);
        return Math.floor((date.getTime() / 1000 / 60 / 60 / 24) + 2440587.5);
    }

    static getSolarPosition(date) {
        let first = new Date(date.getFullYear(), 0, 1);
        let d = Math.round(((date - first) / 1000 / 60 / 60 / 24));
        let m = -3.6 + 360 / 365.24 * d;
        let v = m + 1.9 * Math.sin(this.torad(m));
        let lambda = v + 102.9;
        let delta = -1 * (22.8 * Math.sin(this.torad(lambda)) + 0.6 * Math.pow(Math.sin(this.torad(lambda)), 3));

        let t = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + date.getUTCMilliseconds() / 3600000;
        let bsun = delta;
        let lsun = 180 - 15 * t;
        // TODO: Use other coordinate system with distance from earth included
        return [lsun, bsun];
    }

    static getLonLat(coords) {
        // TODO: convert pos from SGP4 to lon/lat
        return [10, 10];

    }

    static isLit(coords, date) {
        // TODO: calculate if sat at location is lit at date
        let sunloc = this.getSolarPosition(date);
        return true;
    }

    static parse(number) {
        return parseFloat(number.substr(0, 6) + "e" + number.substr(-2));
    }
}


/**
 * This class contains the decoded data from a single TLE
 */
class TLEData {
    constructor(lines) {
        if (lines.length === 2) {
            lines.unshift("UNKNOWN");
        }
        this.satname = lines[0].trim();
        this.satnum = parseInt(lines[1].slice(2, 7));
        this.classification = lines[1].charAt(7);
        this.epochyear = parseInt(lines[1].slice(18, 20));
        this.epochdays = parseFloat(lines[1].slice(20, 32));
        this.jdsatepoch = Constants.jdep(this.epochyear, this.epochdays);
        this.ndot = parseFloat(lines[1].slice(33, 43));
        this.nddot = Constants.parse(lines[1].slice(44, 52));
        this.bstar = Constants.parse(lines[1].slice(53, 61));
        this.elem = parseInt(lines[1].slice(64, 68));

        this.inclo = parseFloat(lines[2].slice(8, 16));
        this.nodeo = parseFloat(lines[2].slice(17, 25));
        this.ecco = parseFloat("." + lines[2].slice(26, 33));
        this.argpo = parseFloat(lines[2].slice(34, 42));
        this.mo = parseFloat(lines[2].slice(43, 51));
        this.no = parseFloat(lines[2].slice(52, 63));
        this.revs = parseInt(lines[2].slice(63, 68));

        let alpha1 = Math.pow(Constants.ke / this.no, 2 / 3);
        let delta1 = (3 / 2) * (Constants.k2 / Math.pow(alpha1, 2)) * ((3 * Math.pow(Math.cos(this.inclo), 2) - 1) / Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2));
        let alpha0 = alpha1 * (1 - 1 / 3 * delta1 - Math.pow(delta1, 2) - 134 / 81 * Math.pow(delta1, 3));
        let delta0 = (3 / 2) * (Constants.k2 / Math.pow(alpha0, 2)) * ((3 * Math.pow(Math.cos(this.inclo), 2) - 1) / Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2));
        let nd20 = this.ndot / (1 + delta0);
        let ad20 = alpha0 / (1 - delta0);
        let s = Constants.s;
        let qoms2t = Constants.qoms2t;
        this.hp = alpha1 * (1 - this.ecco) - 6371; // TODO: is this correct?
        console.log(this.hp);

        if (this.hp < 98) {
            s = 20 / Constants.xkmper + Constants.ae;
            qoms2t = Math.pow(Math.pow(qoms2t, 1 / 4) + Constants.s - s, 4);

        } else if (this.hp < 156) {
            s = ad20 * (1 - this.ecco) - s + Constants.ae;
            qoms2t = Math.pow(Math.pow(qoms2t, 1 / 4) + Constants.s - s, 4);
        }

        let teta = Math.cos(Constants.torad(this.inclo));
        let tetasq = Math.pow(teta, 2);
        let epsilon = 1 / (ad20 - s);
        let epsilonsq = Math.pow(epsilon, 2);
        let beta0 = Math.sqrt(1 - Math.pow(this.ecco, 2));
        let beta0sq = Math.pow(beta0, 2);
        let eta = ad20 * this.ecco * epsilon;
        let etasq = Math.pow(eta, 2);
        let c2 = qoms2t * Math.pow(epsilon, 4) * nd20 * Math.pow(1 - etasq, -7 / 2) *
            (
                ad20 * (1 + 3 / 2 * etasq + 4 * this.ecco * eta + this.ecco * Math.pow(eta, 3))
                + 3 / 2 * (Constants.k2 * epsilon) / (1 - etasq) *
                (-1 / 2 + 3 / 2 * tetasq) *
                (8 + 24 * etasq + 3 * Math.pow(eta, 4))
            );
        let c1 = this.bstar * c2;
        let c3 = (qoms2t * Math.pow(epsilon, 5) * Constants.a30 * nd20 * Constants.ae * Math.sin(Constants.torad(this.inclo))) /
            (Constants.k2 * this.ecco);
        let c4 =
            2 * nd20 * qoms2t * Math.pow(epsilon, 4) * ad20 * beta0sq * Math.pow(1 - etasq, -7 / 2) *
            (
                (2 * eta * (1 + this.ecco * eta) + 1 / 2 * this.ecco + 1 / 2 * Math.pow(eta, 3))
                - (2 * Constants.k2 * epsilon) / (ad20 * (1 - etasq)) *
                (
                    3 * (1 - 3 * tetasq) *
                    (1 + 3 / 2 * etasq - 2 * this.ecco * eta - 1 / 2 * this.ecco * Math.pow(eta, 3)) +
                    3 / 4 * (1 - tetasq) * (2 * etasq - this.ecco * eta - this.ecco * Math.pow(eta, 3)) *
                    Math.cos(Constants.torad(2 * this.argpo))
                )
            );
        let c5 =
            2 * qoms2t * Math.pow(epsilon, 4) * ad20 * beta0sq * Math.pow(1 - etasq, -7 / 2) *
            (1 + 11 / 4 * eta * (eta + this.ecco) + this.ecco * Math.pow(eta, 3));
        let d2 = 4 * ad20 * epsilon * Math.pow(c1, 2);
        let d3 = 4 / 3 * ad20 * epsilonsq * (17 * ad20 + s) * Math.pow(c1, 3);
        let d4 = 2 / 3 * ad20 * Math.pow(epsilon, 3) * (221 * ad20 + 31 * s) * Math.pow(c1, 4);
    }

    sgp4(t) {
        let deltat = "";
        return {pos: "", speed: ""};
    }
}

/**
 * Parse a whole TLE file
 * @param fulltle {string}
 * @returns {Array}
 */
function loadtle(fulltle){
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