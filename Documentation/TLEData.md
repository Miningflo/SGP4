### TLEData
#### Methods of `TLEData` object:
* `TLEData.constructor(tle-string)`
  * Creates `TLEData` object with TLE string
  * TODO: Add info about constructor
* `TLEData.sgp4(t)`
  * Returns object like `{pos: a, speed: b}`
  * TODO: Add info about SGP4
#### Fields of `TLEData` object:
*Extracted Fields from TLE string*

Variable name | Meaning | Units | Example | type
------------- | ------- | :-----: | -------: | :---:
**Line 0** |
satname | Name of Satellite | - | "NOAA 15" | string
**Line 1** |
satnum | Satellite Number | - | 25338 | int
classification | Classification (U/C/S) | - | "U" | string
epochyear | Epoch Year | YY | 20 | int
epochdays | Julian Date Fraction | Days | 121.15888698 | float
ndot | Ballistic Coefficient | revs/day² | 5e-7 | float
nddot | Second Derivative of Mean Motion | revs/day³ | 0 | float
bstar | Drag Term | radii<sup>-1</sup> | 3.9359 | float
elem | Element Set Number | - | 999 | int
**Line 2** |
inclo | Inclination | degrees | 98.7214 | float
nodeo | Right Ascension of the Ascending Node | degrees | 146.4452 | float
ecco | Eccentricity | between 0 and 1 | 0.0011191 | float
argpo | Argument of Perigee | degrees | 48.3965 | float
mo | Mean Anomaly | degrees | 311.8172 | float
no | Mean Motion | orbits/day | 14.25961394 | float
revs | Revolution Number | - | 14235 | int

*Other (calculated) fields*

Variable name | Meaning | Units | Example | type
------------- | ------- | :-----: | -------: | :---:
jdsatepoch | Days since `01 JAN 4713 BC 12 UTC` | Days | 2458970 | int