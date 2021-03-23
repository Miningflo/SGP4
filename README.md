# SGP4
![Project Status: Unfinished](https://img.shields.io/badge/Project_Status-UNFINISHED-orange.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-BLUE.svg)](LICENSE.md)

JS implementation of the SGP4 algorithm to calculate satellite positions

[Read more](../../wiki/SGP4) about our implementation of SGP4

## To Do:
- [ ] Implement SGP4 :alien:
- [ ] Give the ReadMe some love :heart:
- [x] Update TLE file parser :satellite:
- [x] Added a license :page_facing_up:
- [ ] Implement helper functions :wrench:
- [ ] Verify correctness of SGP4 :ok_hand:

## Usage:
### Include as following:
```html
<script src="https://miningflo.github.io/SGP4/sgp4.js"></script>
```
### Sample usage:
```javascript
// get TLE objects from TLE string
let tle_objects = TLEParser.loadtle("tle-string");

tle_objects.forEach(obj => {
    let t = new Date();
    let sgp4 = obj.sgp4(t);                     // do SGP4 calculations

    /* WIP */
    // let postion = sgp4.pos;                     // get position
    // let speed = sgp4.speed;                     // get speed
    // let islit = C.isLit(postion, t);    // Check if a given point is lit at a given time
    // let lonLat = C.getLonLat(postion);  // Convert SGP4 coordinates to Lon/Lat
});
```

## Objects:
### [TLEData](../../wiki/TLEData)
#### [Fields](../../wiki/TLEData#fields-of-tledata-object) of `TLEData` object
#### [Methods](../../wiki/TLEData#methods-of-tledata-object) of `TLEData` object:
* `TLEData.constructor(tle-line-array)`
  * Creates `TLEData` object with TLE array
* `TLEData.sgp4(date)`
  * Returns object like `{pos: {x: a, y: b, z: c}}, velocity: {x: d, y: e, z: f}}`
* `TLEData.getLonLat(date)`
  * Return `[longtitude, latitude]` array from `sgp4` at `date`
### [Constants](../../wiki/Constants)
#### [Static fields](../../wiki/Constants#static-fields) of `Constants` object
#### [Static methods](../../wiki/Constants#static-methods) of `Constants` object

## Functions:
* [`TLEParser.loadtle(string)`](../../wiki/loadtle)
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
**[More examples](../../wiki/loadtle#tle-examples-all-valid)**
