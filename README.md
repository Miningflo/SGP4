# SGP4
JS implementation of the SGP4 algorithm to calculate satellite positions

## Usage:
```javascript
// Load a text file into a string
loadfile("path/to/tle").then(tle => {
    // tle contains the raw text of the file
});

// get TLE objects from TLE string
let tle_objects = loadtle("tle string");

// get Position and speed of TLE object at time T
// T is a js Date object
tle_objects.forEach(obj => {
    let t = new Date();
    let sgp4 = obj.sgp4(t);
    let postion = sgp4.pos;
    let speed = sgp4.speed;
});

// get LON/LAT position of TLE object at time T
// T is a js Date object
tle_objects.forEach(obj => {
    let t = new Date();
    let position = obj.getLonLatatT(t);
});
```

## Objects:
### TLEData
#### Methods of `TLEData` object:
* `TLEData.constructor(tle-string)`
  * Variable name | Meaning
    ------------- | -----
    **Line 0** | --
    this.satname | Name of Satellite
    **Line 1** | --
    this.satnum | Satellite Number
    this.classification | Classification (U/C/S)
    this.epochyear | Epoch Year
    this.epochdays | Julian Date Fraction
    this.jdsatepoch | Days since `01 JAN 4713 BC 12 UTC` 
    this.ndot | Ballistic Coefficient
    this.nddot | Second Derivative of Mean Motion
    this.bstar | Drag Term
    this.elem | Element Set Number
    **Line 2** |--
    this.inclo | Inclination
    this.nodeo | Right Ascension of the Ascending Node
    this.ecco | Eccentricity
    this.argpo | Argument of Perigee
    this.mo | Mean Anomaly
    this.no | Mean Motion
    this.revs | Revolution Number
* `TLEData.sgp4(t)`
  * Returns object like `{pos: a, speed: b}`
* `TLEData.getLonLatatT(t)`
  * Returns array `[lon, lat]`
### Constants
#### Static fields:
Variable name | Value
------------- | -----
g | 6.674 * Math.pow(10, -11);
m | 5.9722 * Math.pow(10, 24);
ke | Math.sqrt(this.g * this.m);
k2 | 5.413080 * Math.pow(10, -4);
