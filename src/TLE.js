import Utils from './utils.js';
import C from './constants.js';

// example TLE:
// ISS (ZARYA)
// 1 25544U 98067A   21082.92793648  .00002082  00000-0  46048-4 0  9999
// 2 25544  51.6455  44.4186 0003325 141.5646 249.4454 15.48937893275389

/**
 *
 * @param {string} string
 * @returns {number}
 */
function parseTlePower(string) {
    // APPLY LEADING DECIMAL
    // from: [+|-| ]   X X X X X   [+|-] X
    // to:   [+|-]   . X X X X X e [+|-] X
    return parseFloat(string[0] + "." + string.substr(1, 5) + "e" + string.substr(-2));
}

function calcChecksum(line) {
    // sum of all digits on a line ('-' counts as 1) modulo 10
    return line
        .slice(0, -1)
        .replace(/-/g, '1')
        .replace(/[^1-9]/g, '')
        .split('')
        .reduce((a, n) => a + Number(n), 0) % 10;
}

/**
 * Convert a number into the TLE small number notation
 * @param {number} n
 * @returns {string}
 */
function formatExp(n){
    return (n * 10)
        .toExponential(4)
        .replace("e", "")
        .replace(".", "")
        .padStart(8, " ");
}

export default class TLE {
    constructor({name, line1, line2}) {

        // name of satelite
        this.satname = name;
        // number of satelite
        this.satnum = parseInt(line1.slice(2, 7));
        // [C (classified) ,U (unclassified), S (secret🤐)]
        this.classification = line1.charAt(7);
        // year of launch (YY)
        this.idy = parseInt(line1.slice(9, 11));
        // Launch number
        this.idn = parseInt(line1.slice(11, 14));
        // Piece of launch
        this.idp = line1.slice(14, 17);
        // last 2 digits TLE epoch year (reference moment)
        this.epochyear = parseInt(line1.slice(18, 20));
        // epoch day of year + fractional portion of day
        this.epochdays = parseFloat(line1.slice(20, 32));
        // date object of epoch
        this.epochdate = Utils.epochDate(this.epochyear, this.epochdays);
        // first derivative of mean motion (revs/day²) => acceleration (aka ballistic coefficient)
        this.ndot = parseFloat(line1.slice(33, 43));
        // second derivative of mean motion (revs/day³) => change in acceleration
        this.nddot = parseTlePower(line1.slice(44, 52));
        // drag term / radiation pressure coefficient (1/rad)
        this.bstar = parseTlePower(line1.slice(53, 61));
        // Ephemeris type
        this.eph = parseInt(line1[62]);
        // TLE element number
        this.elem = parseInt(line1.slice(64, 68));

        // calculate and check checksum for line 1
        const checksum1 = parseInt(line1[68]);
        console.assert(
            checksum1 === calcChecksum(line1),
            `invalid TLE data on line 1 (name: ${this.satname}, number: ${this.satnum})`
        );

        // check if satnums of TLE lines are the same
        console.assert(
            parseInt(line2.slice(2, 7)) === this.satnum,
            "TLE lines are not from the same satellite"
        );
        // angle of inclination (degrees)
        this.inclo = parseFloat(line2.slice(8, 16));
        // right ascension of the ascending node (degrees)
        // angle between orbital plane and reference point
        this.nodeo = parseFloat(line2.slice(17, 25));
        // eccentricity of orbit
        // APPLY LEADING DECIMAL
        // distance between focal points / length of major axis
        this.ecco = parseFloat("." + line2.slice(26, 33));
        // argument of perigee (degrees)
        // angle between ascending node and perigee (closest point to earth)
        this.argpo = parseFloat(line2.slice(34, 42));
        // mean anomaly (degrees)
        // angle between true anomaly (current position on orbit) and perigee
        this.mo = parseFloat(line2.slice(43, 51));
        // mean motion (revolutions/day)
        // mean number of revolutions per day completed
        this.no = parseFloat(line2.slice(52, 63));
        // total number of revolutions at epoch
        this.revs = parseInt(line2.slice(63, 68));

        // calculate and check checksum for line 2
        const checksum2 = parseInt(line2[68]);
        console.assert(
            checksum2 === calcChecksum(line2),
            `invalid TLE data on line 2 (name: ${this.satname}, number: ${this.satnum})`
        );


        // convert degrees to radians
        this.nodeo = Utils.deg2rad(this.nodeo);
        this.argpo = Utils.deg2rad(this.argpo);
        this.mo = Utils.deg2rad(this.mo);
        this.inclo = Utils.deg2rad(this.inclo);

        // convert revolutions/day to radians/minute
        this.no = this.no * 2 * Math.PI / C.XMNPDA;                     // # rev per min in rad
        this.ndot = this.ndot * 2 * Math.PI / Math.pow(C.XMNPDA, 2);    // # rev / min² in rad
        this.nddot = this.nddot * 2 * Math.PI / Math.pow(C.XMNPDA, 3);  // # rev / min³ in rad
    }

    _formatLine1(){
        let {
            satnum, classification, idy, idn, idp, epochyear, epochdays, ndot, nddot, bstar, eph, elem
        } = this;

        idn = idn.toString().padStart(3, "0");
        epochdays = epochdays.toFixed(8).padStart(12, "0");
        ndot = (ndot / 2 / Math.PI * Math.pow(C.XMNPDA, 2))
            .toFixed(8)
            .replace("0", "").padStart(10, " ");
        nddot = formatExp(nddot / 2 / Math.PI * Math.pow(C.XMNPDA, 3));
        bstar = formatExp(bstar);
        elem = elem.toString().padStart(4, " ");

        return `1 ${satnum}${classification} ${idy}${idn}${idp} ${epochyear}${epochdays} ${ndot} ${nddot} ${bstar} ${eph} ${elem}`;
    }

    get checksum1(){
        return calcChecksum(this._formatLine1() + "*");
    }

    _formatLine2(){
        let {
            satnum, inclo, nodeo, ecco, argpo, mo, no, revs
        } = this;

        inclo = Utils.rad2deg(inclo).toFixed(4).padStart(8, " ");
        nodeo = Utils.rad2deg(nodeo).toFixed(4).padStart(8, " ");
        ecco = ecco.toFixed(7).substring(2);
        argpo = Utils.rad2deg(argpo).toFixed(4).padStart(8, " ");
        mo = Utils.rad2deg(mo).toFixed(4).padStart(8, " ");
        no = (no / 2 / Math.PI * C.XMNPDA).toFixed(8).padStart(11, " ")
        revs = revs.toString().padStart(5, " ");

        return `2 ${satnum} ${inclo} ${nodeo} ${ecco} ${argpo} ${mo} ${no}${revs}`
    }

    get checksum2(){
        return calcChecksum(this._formatLine2() + "*");
    }

    toString() {
        return this.satname + "\n" +
            this._formatLine1() + this.checksum1 + "\n" +
            this._formatLine2() + this.checksum2 + "\n";
    }
}
