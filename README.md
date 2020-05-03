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

// get LON/LAT position of TLE object at time T
// T is a js Date object
tle_objects.forEach(obj => {
   obj.getLonLatatT(t);
});
```
