import C from './constants.js';


export default class SGP4 {
    constructor(tle) {
        this.tle = tle

        /* Non-time dependant equations */
        let a1 = Math.pow(C.KE / this.tle.no, 2 / 3);
        let deltatemp = (3 / 2) * C.K2 * (
            (3 * Math.pow(Math.cos(this.tle.inclo), 2) - 1) /
            Math.pow(1 - Math.pow(this.tle.ecco, 2), 3 / 2)
        );
        let delta1 = deltatemp / Math.pow(a1, 2);
        let a0 = a1 * (1 - (1 / 3) * delta1 - Math.pow(delta1, 2) - (134 / 81) * Math.pow(delta1, 3));
        let delta0 = deltatemp / Math.pow(a0, 2);
        let nd20 = this.tle.no / (1 + delta0);
        let ad20 = a0 / (1 - delta0);

        // (semimajor_axis - (semimajor_axis * eccentricity) - 1 * earth radii) * #km per earth radii
        // eccentricty [major/d(foci)]
        let perigee = (ad20 * (1. - this.tle.ecco) - C.AE) * C.XKMPER; // perigee in km
        let sstar = C.S;
        let qoms2t = C.QOMS2T;
        if (perigee < 156) {
            if (perigee < 96) {
                sstar = 20 / C.XKMPER + C.AE // 1 earth radius + 20 km expressed in earth radii
            } else {
                sstar = ad20 * (1 - this.tle.ecco) + C.AE - sstar;
            }
            // replace s by sstar in [qoms2t = (q - s)^4]
            qoms2t = Math.pow(Math.pow(C.QOMS2T, 1/4) + C.S - sstar, 4);
        }

        /* Calculate the constants using qoms2t */
        let theta = Math.cos(this.tle.inclo); // cosine of inclination
        let epsilon = 1 / (ad20 - sstar);
        let beta0 = Math.sqrt(1 - Math.pow(this.tle.ecco, 2));
        let eta = ad20 * this.tle.ecco * epsilon;

        console.log(nd20, ad20);
    }

    calc(date) {
        console.log(date)
    }

    getLonLat(date) {
        return [20, 30]
    }
}
