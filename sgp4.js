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
    // static ke = .743669161E-1;
    static k2 = 5.413080E-4; // value given by NO. 3
    static k2sq = Math.pow(5.413080E-4, 2); // value given by NO. 3
    static xkmper = 6378.135; // value given by NO. 3
    static ae = 1; // TODO: are we sure?
    static s = this.ae + 78 / this.xkmper;
    static qoms2t = 1.88027916E-9; // value given by NO. 3
    static j3 = -.253881E-5; // value given by NO. 3
    static a30 = -this.j3 * Math.pow(this.ae, 3); // value given by NO. 3
    static k4 = .62098875E-6;

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

    static epochdate(year, days) {
        let yr = (year < 57) ? year + 2000 : year + 1900;
        let date = new Date(yr, 0, 1);
        date.setDate(date.getDate() + days);
        return date;
    }

    static getSolarPosition(date) {
        let first = new Date(date.getFullYear(), 0, 1);
        let d = Math.round(((date - first) / 1000 / 60 / 60 / 24));
        let m = -3.6 + 360 / 365.24 * d;
        let v = m + 1.9 * this.sin(m);
        let lambda = v + 102.9;
        let delta = -1 * (22.8 * this.sin(lambda) + 0.6 * Math.pow(this.sin(lambda), 3));

        let t = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + date.getUTCMilliseconds() / 3600000;
        let bsun = delta;
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
        this.epochdate = Constants.epochdate(this.epochyear, this.epochdays);
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

        /* Original motion and semimajor axis */
        let a1 = Math.pow(
            Constants.ke / this.no,
            2 / 3
        );
        let delta1 = (3 / 2) *
            (Constants.k2 / Math.pow(a1, 2)) *
            (
                (3 * Math.pow(Constants.cos(this.inclo), 2) - 1) /
                Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2)
            );
        let a0 = a1 *
            (1 -
                1 / 3 * delta1 -
                Math.pow(delta1, 2) -
                134 / 81 * Math.pow(delta1, 3)
            );
        let delta0 = (3 / 2) *
            (Constants.k2 / Math.pow(a0, 2)) *
            (
                (3 * Math.pow(Constants.cos(this.inclo), 2) - 1) /
                Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2)
            );
        this.nd20 = this.no / (1 + delta0);
        this.ad20 = a0 / (1 - delta0); // Verified: correct

        this.ad20sq = Math.pow(this.ad20, 2);
        this.ad20sq4 = Math.pow(this.ad20, 4);
        let s4 = Constants.s;
        this.qoms2t = Constants.qoms2t;

        this.hp = a1 * (1 - this.ecco) - 6371.0088; // Verified: correct

        /* Handle low perigee */
        if (this.hp < 98) {
            s4 = 20 / Constants.xkmper + Constants.ae;
            this.qoms2t = Math.pow(Math.pow(this.qoms2t, 1 / 4) + Constants.s - s4, 4);

        } else if (this.hp < 156) {
            s4 = this.ad20 * (1 - this.ecco) - s4 + Constants.ae;
            this.qoms2t = Math.pow(Math.pow(this.qoms2t, 1 / 4) + Constants.s - s4, 4);
        }

        /* Calculate constants */
        this.teta = Constants.cos(this.inclo);
        let epsilon = 1 / (this.ad20 - s4);
        this.beta0 = Math.sqrt(1 - Math.pow(this.ecco, 2));
        this.eta = this.ad20 * this.ecco * epsilon;

        this.tetasq = Math.pow(this.teta, 2);
        this.tetasq4 = Math.pow(this.teta, 4);
        let epsilonsq = Math.pow(epsilon, 2);
        this.epsilonsq4 = Math.pow(epsilon, 4);
        this.beta0sq = Math.pow(this.beta0, 2);
        this.beta0sq4 = Math.pow(this.beta0, 4);
        this.beta0sq8 = Math.pow(this.beta0, 8);
        let etasq = Math.pow(this.eta, 2);
        let etasq3 = Math.pow(this.eta, 3);

        let c2 = this.qoms2t * this.epsilonsq4 * this.nd20 * Math.pow(1 - etasq, -7 / 2) *
            (
                this.ad20 * (1 + 3 / 2 * etasq + 4 * this.ecco * this.eta + this.ecco * etasq3)
                + 3 / 2 * (Constants.k2 * epsilon) / (1 - etasq) *
                (-1 / 2 + 3 / 2 * this.tetasq) *
                (8 + 24 * etasq + 3 * Math.pow(this.eta, 4))
            );
        this.c1 = this.bstar * c2;
        this.c3 = (this.qoms2t * Math.pow(epsilon, 5) * Constants.a30 * this.nd20 * Constants.ae * Constants.sin(this.inclo)) /
            (Constants.k2 * this.ecco);
        this.c4 =
            2 * this.nd20 * this.qoms2t * this.epsilonsq4 * this.ad20 * this.beta0sq * Math.pow(1 - etasq, -7 / 2) *
            (
                (2 * this.eta * (1 + this.ecco * this.eta) + 1 / 2 * this.ecco + 1 / 2 * etasq3)
                - (2 * Constants.k2 * epsilon) / (this.ad20 * (1 - etasq)) *
                (
                    3 * (1 - 3 * this.tetasq) *
                    (1 + 3 / 2 * etasq - 2 * this.ecco * this.eta - 1 / 2 * this.ecco * etasq3) +
                    3 / 4 * (1 - this.tetasq) * (2 * etasq - this.ecco * this.eta - this.ecco * etasq3) *
                    Constants.cos(2 * this.argpo)
                )
            );
        this.c5 =
            2 * this.qoms2t * this.epsilonsq4 * this.ad20 * this.beta0sq * Math.pow(1 - etasq, -7 / 2) *
            (1 + 11 / 4 * this.eta * (this.eta + this.ecco) + this.ecco * etasq3);
        this.d2 = 4 * this.ad20 * epsilon * Math.pow(this.c1, 2);
        this.d3 = 4 / 3 * this.ad20 * epsilonsq * (17 * this.ad20 + s4) * Math.pow(this.c1, 3);
        this.d4 = 2 / 3 * this.ad20 * Math.pow(epsilon, 3) * (221 * this.ad20 + 31 * s4) * Math.pow(this.c1, 4);
    }

    sgp4(t) {
        /* Secular effects of atmospheric drag */
        let deltat = (t.getTime() - this.epochdate.getTime()) / (1000 * 60); // assume deltat is in minutes
        deltat = 0;
        let mdf = this.mo +
            (1 +
                (3 * Constants.k2 * (-1 + 3 * this.tetasq)) / (2 * this.ad20sq * Math.pow(this.beta0, 3)) +
                (
                    3 * Constants.k2sq * (13 - 78 * this.tetasq + 137 * this.tetasq4)
                ) / (
                    16 * this.ad20sq4 * Math.pow(this.beta0, 7)
                )
            ) * this.nd20 * deltat;
        let wdf = this.argpo +
            (
                -(3 * Constants.k2 * (1 - 5 * this.tetasq)) / (2 * this.ad20sq * this.beta0sq4) +
                (3 * Constants.k2sq * (7 - 114 * this.tetasq + 395 * this.tetasq4)) / (16 * this.ad20sq4 * this.beta0sq8) +
                (5 * Constants.k4 * (3 - 36 * this.tetasq + 49 * this.tetasq4)) / (4 * this.ad20sq4 * this.beta0sq8)
            ) * this.nd20 * deltat;
        let odf = this.nodeo +
            (
                -(3 * Constants.k2 * this.teta) / (this.ad20sq * this.beta0sq4) +
                (
                    3 * Constants.k2sq * (4 * this.teta - 19 * Math.pow(this.teta, 3))
                ) / (
                    2 * this.ad20sq4 * this.beta0sq8
                ) +
                (5 * Constants.k4 * this.teta * (3 - 7 * this.tetasq)) / (2 * this.ad20sq4 * this.beta0sq8)
            ) * this.nd20 * deltat;
        let deltaw = this.bstar * this.c3 * Constants.cos(this.argpo) * deltat;
        let deltam = -2 / 3 * this.qoms2t * this.bstar * this.epsilonsq4 * (Constants.ae) / (this.ecco * this.eta) *
            (
                Math.pow(1 + this.eta * Constants.cos(mdf), 3) -
                Math.pow(1 + this.eta * Constants.cos(this.mo), 3)
            );
        let mp = mdf;
        let w = wdf;
        let o = odf - 21 / 2 * (this.nd20 * Constants.k2 * this.teta) / (this.ad20sq * this.beta0sq) * this.c1 * Math.pow(deltat, 2);
        let e = this.ecco - this.bstar * this.c4 * deltat;
        let a, l;

        /* Modify equations for low perigee */
        if (this.hp < 220) {
            a = this.ad20 * Math.pow(1 - this.c1 * deltat, 2);
            l = mp + w + o + this.nd20 * (3 / 2 * this.c1 * Math.pow(deltat, 2));
        } else {
            mp = mdf + deltaw + deltam;
            w = wdf - deltaw - deltam;
            e = e - this.bstar * this.c5 * (Constants.sin(mp) - Constants.sin(this.mo));
            a = this.ad20 * Math.pow(
                1 -
                this.c1 * deltat -
                this.d2 * Math.pow(deltat, 2) -
                this.d3 * Math.pow(deltat, 3) -
                this.d4 * Math.pow(deltat, 4),
                2);
            l = mp + w + o + this.nd20 * (
                3 / 2 * this.c1 * Math.pow(deltat, 2) +
                (this.d2 + 2 * Math.pow(this.c1, 2)) * Math.pow(deltat, 3) +
                1 / 4 * (3 * this.d3 + 12 * this.c1 * this.d2 + 10 * Math.pow(this.c1, 3)) * Math.pow(deltat, 4) +
                1 / 5 * (3 * this.d4 +
                    12 * this.c1 * this.d3 +
                    6 * Math.pow(this.d2, 2) +
                    30 * Math.pow(this.c1, 2) * this.d2 +
                    15 * Math.pow(this.c1, 4)
                ) * Math.pow(deltat, 5)
            );
        }
        let beta = Math.sqrt(1 - Math.pow(e, 2));
        let n = Constants.ke / Math.pow(a, 3 / 2);

        /* Long-period periodic terms */
        let axn = e * Constants.cos(w);
        let ll = (Constants.a30 * Constants.sin(this.inclo)) / (8 * Constants.k2 * a * Math.pow(beta, 2)) *
            (axn) *
            ((3 + 5 * this.teta) / (1 + this.teta));
        let aynl = (Constants.a30 * Constants.sin(this.inclo)) / (4 * Constants.k2 * a * Math.pow(beta, 2));
        let lt = l + ll;
        let ayn = e * Constants.sin(w) + aynl;

        /* Solve kepler */
        let capu = Constants.torad(lt - o) % (2 * Math.PI);
        let ew = capu;
        let sinepw, cosepw, t3, t4, t5, t6;
        while (true) {
            sinepw = Math.sin(ew);
            cosepw = Math.cos(ew);
            t3 = axn * sinepw;
            t4 = ayn * cosepw;
            t5 = axn * cosepw;
            t6 = ayn * sinepw;
            let epw = (capu - t4 + t3 - ew) / (1 - t5 - t6) + ew;
            if (Math.abs(epw - ew) < 1e-6) {
                break;
            }
            ew = epw;
        }

        /* Calculate preliminary quantities for short-period periodics */
        let ecose = axn * cosepw + ayn * sinepw;
        let esine = axn * sinepw - ayn * cosepw;
        let el = Math.sqrt(Math.pow(axn, 2) + Math.pow(ayn, 2));
        let pl = a * (1 - Math.pow(el, 2));
        let r = a * (1 - ecose);
        let rdot = Constants.ke * Math.sqrt(a) / r * esine; // ABSOLUTELY WRONG
        let rf = Constants.ke * Math.sqrt(pl) / r; // ABSOLUTELY WRONG
        let cosu = (a / r) * (Math.cos((ew)) - axn + (ayn * esine) / (1 + Math.sqrt(1 - Math.pow(el, 2))));
        let sinu = (a / r) * (Math.sin((ew)) - ayn - (axn * esine) / (1 + Math.sqrt(1 - Math.pow(el, 2))));
        let u = Math.atan(sinu / cosu);
        let deltar = (Constants.k2 / (2 * pl)) * (1 - this.tetasq) * Math.cos((2 * u));
        let deltau = -(Constants.k2 / (4 * Math.pow(pl, 2))) * (7 * this.tetasq - 1) * Math.sin((2 * u));
        let deltao = (3 * Constants.k2 * this.teta) / (2 * Math.pow(pl, 2)) * Math.sin((2 * u));
        let deltai = (3 * Constants.k2 * this.teta) / (2 * Math.pow(pl, 2)) *
            Constants.sin(this.inclo) * Math.cos((2 * u));
        let deltardot = -((Constants.k2 * n) / pl) * (1 - this.tetasq) * Math.sin((2 * u));
        let deltarf = ((Constants.k2 * n) / pl) *
            ((1 - this.tetasq) * Math.cos((2 * u)) - 3 / 2 * (1 - 3 * this.tetasq));

        /* short-period periodics are added */
        let rk = r * (1 - 3 / 2 * Constants.k2 * Math.sqrt(1 - Math.pow(el, 2)) / Math.pow(pl, 2) * (3 * this.tetasq - 1)) + deltar;
        let uk = u + deltau;
        let ok = o + deltao;
        let ik = this.inclo + deltai;
        let rdotk = rdot + deltardot;
        let rfk = rf + deltarf;

        /* Calculate unit orientation vectors */
        let mx = -Constants.sin(ok) * Constants.cos(ik);
        let my = Constants.cos(ok) * Constants.cos(ik);
        let mz = Constants.sin(ik);
        let nx = Constants.cos(ok);
        let ny = Constants.sin(ok);
        let nz = 0;

        let ux = mx * Math.sin(uk) + nx * Math.cos(uk);
        let uy = my * Math.sin(uk) + ny * Math.cos(uk);
        let uz = mz * Math.sin(uk) + nz * Math.cos(uk);
        let vx = mx * Math.cos(uk) - nx * Math.sin(uk);
        let vy = my * Math.cos(uk) - ny * Math.sin(uk);
        let vz = mz * Math.cos(uk) - nz * Math.sin(uk);

        /* Calculate position and velocity */
        let x = rk * ux;
        let y = rk * uy;
        let z = rk * uz;
        let xdot = rdotk * ux + rfk * vx;
        let ydot = rdotk * uy + rfk * vy;
        let zdot = rdotk * uz + rfk * vz;

        return {pos: {x: x, y: y, z: z}, velocity: {x: xdot, y: ydot, z: zdot}};
    }

    getLonLat(date) {
        let jd_year = 2415020.5 + (this.epochyear - 1900) * 365 + Math.floor((this.epochyear - 1900 - 1) / 4);
        let jd = jd_year + this.epochdays - 1.0;

        let ut = (jd + 0.5) % 1.0;
        let t = (jd - ut - 2451545.0) / 36525.0;
        let omega = 1.0 + 8640184.812866 / 3155760000.0;
        let gmst0 = 24110.548412 + t * (8640184.812866 + t * (0.093104 - t * 6.2E-6));
        let theta_GMST = ((gmst0 + 86400.0 * omega * ut) % 86400.0) * 2 * Math.PI / 86400.0;

        let pos = this.sgp4(date).pos;
        let lon = (Math.atan(pos.y / pos.x) - theta_GMST) % (2 * Math.PI);
        let latitude = Math.atan(pos.z / Math.sqrt(pos.x * pos.x + pos.y * pos.y));
        let latitudeOld = latitude;
        let a = 6378.137;
        let e = 0.081819190842622;

        do {
            latitudeOld = latitude;
            let c = a * Math.pow(e, 2) * Math.sin(latitudeOld) / Math.sqrt(1.0 - e * e * Math.sin(latitudeOld) * Math.sin(latitudeOld));
            latitude = Math.atan((pos.z + c) / Math.sqrt(pos.x * pos.x + pos.y * pos.y))
        } while (Math.abs(latitude - latitudeOld) < 1.0e-10);

        return [Constants.todeg(lon), Constants.todeg(latitude)];

    }
}

/**
 * Parse a whole TLE file
 * @param fulltle {string}
 * @returns {Array}
 */
function loadtle(fulltle) {
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