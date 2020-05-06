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
    static g = 6.674 * Math.pow(10, -11);
    static m = 5.9722 * Math.pow(10, 24);
    static ke = Math.sqrt(this.g * this.m);
    static k2 = 5.413080 * Math.pow(10, -4);

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
}


/**
 * This class contains the decoded data from a single TLE
 */
class TLEData {
    constructor(tle) {
        let lines = tle.split("\n");
        this.satname = lines[0].trim();
        this.satnum = parseInt(lines[1].slice(2, 7));
        this.classification = lines[1].charAt(7);
        this.epochyear = parseInt(lines[1].slice(18, 20));
        this.epochdays = parseFloat(lines[1].slice(20, 32));
        this.jdsatepoch = Constants.jdep(this.epochyear, this.epochdays);
        this.ndot = parseFloat(lines[1].slice(33, 43));
        this.nddot = lines[1].slice(44, 52);
        this.bstar = lines[1].slice(53, 61);
        this.elem = parseInt(lines[1].slice(64, 68));

        this.inclo = parseFloat(lines[2].slice(8, 16));
        this.nodeo = parseFloat(lines[2].slice(17, 25));
        this.ecco = parseFloat("." + lines[2].slice(26, 33));
        this.argpo = parseFloat(lines[2].slice(34, 42));
        this.mo = parseFloat(lines[2].slice(43, 51));
        this.no = parseFloat(lines[2].slice(52, 63));
        this.revs = parseInt(lines[2].slice(63, 68));

        // TODO: move time-independent calculations here
        let alpha1 = Math.pow(Constants.ke / this.no, 2 / 3);
        let delta1 = (3 / 2) * (Constants.k2 / Math.pow(alpha1, 2)) * ((3 * Math.pow(Math.cos(this.inclo), 2) - 1) / Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2));
        let alpha0 = alpha1 * (1 - 1 / 3 * delta1 - delta1 ** 2 - 134 / 81 * (delta1 ** 3));
        let delta0 = (3 / 2) * (Constants.k2 / Math.pow(alpha0, 2)) * ((3 * Math.pow(Math.cos(this.inclo), 2) - 1) / Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2));
        let nd20 = this.ndot / (1 + delta0);
        let ad20 = alpha0 / (1 - delta0);
    }

    sgp4(t) {
        console.log(this);
        return {pos: "", speed: ""};
    }
}

/**
 * Parse a whole TLE file
 * @param fulltle {string}
 * @returns {Array}
 */
function loadtle(fulltle){
    let tlelines = fulltle.split("\n");
    let tles = [];
    // TODO: Update parser to work with 2 line TLE
    while (tlelines.length) {
        tles.push(new TLEData(tlelines.splice(0, 3).join("\n")));
    }
    return tles;
}

/**
 * Load file as text
 * @param path
 * @returns {Promise<string>}
 */
function loadfile(path){
    return fetch(path).then(res => res.text());
}