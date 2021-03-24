const PI = Math.PI

export default class Utils{

    static deg2rad(deg) {
        return deg / 180 * PI;
    }

    static rad2deg(rad) {
        return rad * 180 / PI;
    }

    static sinDeg(deg) {
        return Math.sin(this.deg2rad(deg));
    }

    static cosDeg(deg) {
        return Math.cos(this.deg2rad(deg));
    }

    static asinDeg(x) {
        return this.rad2deg(Math.asin(x));
    }

    /**
     * Convert day, year to javascript date
     * @param {int} year    last 2 digits of year
     * @param {float} days  passed days this year
     * @returns javascript date object
     */
    static epochDate(year, days) {
        let yr = (year < 57) ? year + 2000 : year + 1900;
        let date = new Date(yr, 0, 1);
        date.setTime(date.getTime() + days * 86400000); // support for fractional days
        return date;
    }

    /**
     * Calculate coordinates of vertical position of the sun
     * @param {Date} date
     * @returns {lat: Float, lon: Float}
     */
    static getSolarPosition(date) {
        // calculate declination of the sun
        let first = new Date(date.getFullYear(), 0, 1); // jan 1st
        let n = ((date - first) / 1000 / 60 / 60 / 24); // days since jan 1st (not rounded)
        // inclination of orbital plane = -23.44
        // eccentricity of earths orbit = 0.0167
        let declination = this.asinDeg(
            this.sinDeg(-23.44) *
            this.cosDeg(
                360 / 365.24 * (n + 10) +
                360 / PI * 0.0167 *
                this.sinDeg(
                    360 / 365.24 * (n - 2)
                )
            )
        );
        let t = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + date.getUTCMilliseconds() / 3600000;
        let lon = declination;
        let lat = 180 - 15 * t;
        // ENHANCEMENTOS: Use other coordinate system with distance from earth included
        return {lat, lon};
    }
}