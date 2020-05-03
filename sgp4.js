function sgp4(sat) {
    console.log(sat);
}

/**
 * This class cointains the decoded data from a single TLE
 */
class SingleTle {
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
}

/**
 * Load TLE data from path
 * @param path
 * @returns {Promise<Array | SingleTle>}
 */
function loadtle(path){
    return fetch(path).then(res => res.text()).then(fulltle => {
        fulltle = fulltle.split("\n");
        let tles = [];
        while (fulltle.length) {
            tles.push(new SingleTle(fulltle.splice(0, 3).join("\n")));
        }
        return tles;
    });
}