#### Static fields:
*Symbol clarification, see [notes](#notes)*

Variable name | Value | Description
------------- | ----- | ---
g | 6.674 × 10<sup>-11</sup> | Newton's universal gravitational constant
m | 5.9722 × 10<sup>24</sup> | The mass of the earth
ke | sqrt(g * m) | -
k2 | 5.413080 × 10<sup>-4</sup> | ½ × J<sub>2</sub> × α<sub>E</sub><sup>2</sup> 
#### Static methods:
* `Constants.jdep(year, days)`
  * Convert a year (YY) and a day (since `01 JAN`) to a Julian Date (number of total days since `01 JAN 4713 BC 12 UTC`)
* `Constants.torad(x)`
  * Convert an angle in degrees to radians
* `Constants.todeg(x)`
  * Convert an angle in radians to degrees
* `Constants.getSolarPosition(date)`
  * Get the longitude and latitude of the sun on a given `Date()`
* `Constants.getLonLat(coords)`
  * Convert SGP4 coordinates in array `[lon, lat]`
* `Constants.isLit(coords, date)`
  * Check if a certain position is lit by the sun at a given time `true | false`
* `Constants.parse(xxxx-n)`
  * Parse the `xxxx-n`-format given in TLE to `xxxx`<sup>`-n`</sup>
#### Notes:
Symbol | Description
:---: | ---
J<sub>2</sub> | The second gravitational zonal harmonic of the Earth
α<sub>E</sub> | The equatorial radius of the Earth
#### Sources:
* [SPACETRACK REPORT NO. 3](http://celestrak.com/NORAD/documentation/spacetrk.pdf) *Retrieved 6 May 2020*