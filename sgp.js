import C from "./src/constants.js";

export default class SGP {
    constructor(tle) {
        this.tle = tle;

        /* Non-time dependant equations */
        let a1 = Math.pow(C.KE / this.tle.no, 2 / 3);
        let delta1 = 3 / 2 * C.K2 / Math.pow(a1, 2) * (
            (3 * Math.pow(Math.cos(this.tle.inclo), 2) - 1) /
            Math.pow(1 - Math.pow(this.tle.ecco, 2), 3 / 2)
        );
        this.a0 = a1 * (1 - 1 / 3 * delta1 - Math.pow(delta1, 2) - 134 / 81 * Math.pow(delta1, 3));
        let p0 = this.a0 * (1 - Math.pow(this.tle.ecco, 2));
        this.q0 = this.a0 * (1 - this.tle.ecco);
        this.l0 = this.tle.mo + this.tle.argpo + this.tle.nodeo;
        this.dnodeodt = -3 * C.K2 / Math.pow(p0, 2) * this.tle.no * Math.cos(this.tle.inclo);
        this.dargpodt = 3 / 2 * C.K2 / Math.pow(p0, 2) * this.tle.no * (
            5 * Math.pow(Math.cos(this.tle.inclo), 2) - 1
        );
    }

    calc(date) {
        let deltaT = 0;
        /* Atmospheric drag */
        let a = this.a0 * Math.pow((
            this.tle.no / (
                this.tle.no + 2 * (this.tle.ndot / 2) * deltaT + 3 * (this.tle.nddot / 6) * Math.pow(deltaT, 2)
            )
        ), 2 / 3);
        let e = (a > this.q0) ? 1 - this.q0 / a : 10e-6;
        let p = a * (1 - Math.pow(e, 2));
        let nodeoSO = this.tle.nodeo + this.dnodeodt * deltaT;
        let argpoSO = this.tle.argpo + this.dargpodt * deltaT;
        let ls = this.l0 +
            (this.tle.no + this.dargpodt + this.dnodeodt) * deltaT +
            (this.tle.ndot / 2) * Math.pow(deltaT, 2) +
            (this.tle.nddot / 6) * Math.pow(deltaT, 3);

        let axnsl = e * Math.cos(argpoSO);
        let aynsl = e * Math.sin(argpoSO) - 1 / 2 * C.J3 / (2 * C.K2) / p * Math.sin(this.tle.inclo);
        let l = ls - 1 / 2 * C.J3 / (2 * C.K2) / p * axnsl * Math.sin(this.tle.inclo) * (
            (3 + 5 * Math.cos(this.tle.inclo) / (1 + Math.cos(this.tle.inclo)))
        );

        /* Solve Kepler */
    }
}
