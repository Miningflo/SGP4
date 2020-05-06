#### Static fields:
Variable name | Value
------------- | -----
g | 6.674 × 10<sup>-11</sup>
m | 5.9722 × 10<sup>24</sup>
ke | sqrt(g * m)
k2 | 5.413080 × 10<sup>-4</sup>
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