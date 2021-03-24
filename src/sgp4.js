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

        console.log(nd20, ad20);
    }

    calc(date) {
        console.log(date)
    }

    getLonLat(date) {
        return [20, 30]
    }
}
