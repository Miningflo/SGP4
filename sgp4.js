/**
 * This is the class for constants
 */
class Constants {
    static g = 6.674 * Math.pow(10, -11);
    static m = 5.9722 * Math.pow(10, 24);
    static ke = Math.sqrt(this.g * this.m);
    static k2 = 5.413080 * Math.pow(10, -4);
}


/**
 * This class cointains the decoded data from a single TLE
 */
class SingleTle {
    // TODO: rename class
    constructor(tle) {
        let lines = tle.split("\n");
        this.satname = lines[0].trim();
        this.satnum = lines[1].slice(2, 7);
        this.classification = lines[1].charAt(7);
        this.year = lines[1].slice(18, 20);
        this.day = lines[1].slice(20, 32);
        this.ballistic = lines[1].slice(33, 43);
        this.d2ballistic = lines[1].slice(44, 52);
        this.drag = lines[1].slice(53, 61);
        this.elem = lines[1].slice(64, 68);

        this.incl = lines[2].slice(8, 16);
        this.raan = lines[2].slice(17, 25);
        this.eccent = lines[2].slice(26, 33);
        this.perigee = lines[2].slice(34, 42);
        this.anomaly = lines[2].slice(43, 51);
        this.motion = lines[2].slice(52, 63);
        this.revs = lines[2].slice(63, 68);
    }

    getLonLatatT(t){
        let pos = this.sgp4(t).pos;
        // TODO: convert pos from SGP4 to lon/lat
        return [0, 0];

    }

    sgp4(deltaT){
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
    while (tlelines.length) {
        tles.push(new SingleTle(tlelines.splice(0, 3).join("\n")));
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