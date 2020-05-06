# SGP4
![Project Status: Unfinished](https://img.shields.io/badge/Project_Status-UNFINISHED-red.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-BLUE.svg)](https://github.com/Miningflo/SGP4/blob/master/LICENSE.md)

JS implementation of the SGP4 algorithm to calculate satellite positions

## To Do:
- [ ] Implement SGP4 :alien:
- [x] Give the ReadMe some love :heart:
- [ ] Update TLE file parser :satellite:
- [x] Added a license :page_facing_up:

## Usage:
### Include as following:
```html
<script src="https://miningflo.github.io/SGP4/sgp4.js"></script>
```
### Sample usage:
```javascript
// Load a text file into a string
loadfile("path/to/tle").then(tle => {
    // tle contains the raw text of the file
});

// get TLE objects from TLE string
let tle_objects = loadtle("tle string");

tle_objects.forEach(obj => {
    let t = new Date();
    let sgp4 = obj.sgp4(t);                     // do SGP4 calculations
    let postion = sgp4.pos;                     // get position
    let speed = sgp4.speed;                     // get speed
    let islit = Constants.isLit(postion, t);    // Check if a given point is lit at a given time
    let lonLat = Constants.getLonLat(postion);  // Convert SGP4 coordinates to Lon/Lat
});
```

## Objects:
### TLEData
* Click [here](https://github.com/Miningflo/SGP4/blob/master/Documentation/TLEData.md) for more info.
#### Methods of `TLEData` object:
* `TLEData.constructor(tle-string)`
  * Creates `TLEData` object with TLE string
* `TLEData.sgp4(t)`
  * Returns object like `{pos: a, speed: b}`
#### Fields of `TLEData` object:
*Extracted Fields from TLE string*

Variable name | Meaning | Units | Example
------------- | ------- | :-----: | -------:
**Line 0** |
satname | Name of Satellite | - | "NOAA 15"
**Line 1** |
satnum | Satellite Number | - | 25338
classification | Classification (U/C/S) | - | "U"
epochyear | Epoch Year | YY | 20
epochdays | Julian Date Fraction | Days | 121.15888698
ndot | Ballistic Coefficient | revs/day² | 5e-7
nddot | Second Derivative of Mean Motion | revs/day³ | 00000-0
bstar | Drag Term | radii<sup>-1</sup> | 39359-4
elem | Element Set Number | - | 999
**Line 2** |
inclo | Inclination | degrees | 98.7214
nodeo | Right Ascension of the Ascending Node | degrees | 146.4452
ecco | Eccentricity | between 0 and 1 | 0.0011191
argpo | Argument of Perigee | degrees | 48.3965
mo | Mean Anomaly | degrees | 311.8172
no | Mean Motion | orbits/day | 14.25961394
revs | Revolution Number | - | 14235
**Other (calculated) fields** |
jdsatepoch | Days since `01 JAN 4713 BC 12 UTC` | Days | 2458970
### Constants
#### Static fields:
* Click [here](https://github.com/Miningflo/SGP4/blob/master/Documentation/CONSTANTS.md#static-fields) for more info.
#### Static methods:
* Click [here](https://github.com/Miningflo/SGP4/blob/master/Documentation/CONSTANTS.md#static-methods) for more info.

## Functions:
* `loadfile(path)`
  * Returns a text string of file contents as promise
* `loadtle(string)`
  * Loads a text string of TLEs into an array of `TLEData` objects
## Example TLE data:
```text
NOAA 15
1 25338U 98030A   20121.15888698  .00000050  00000-0  39359-4 0  9998
2 25338  98.7214 146.4452 0011191  48.3965 311.8172 14.25961394142350
NOAA 18
1 28654U 05018A   20120.92436756  .00000079  00000-0  67528-4 0  9994
2 28654  99.0483 176.8885 0014253  12.5486 347.6038 14.12506465770159
NOAA 19
1 33591U 09005A   20121.13732955  .00000044  00000-0  49437-4 0  9995
2 33591  99.1967 125.2266 0013491 207.6282 152.4173 14.12405200578577
```
