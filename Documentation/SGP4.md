Variable name | Value
------------- | -----
α<sub>1</sub> | ![equation](http://latex.codecogs.com/gif.latex?O_t%3D%5Ctext%20%7B%20Onset%20event%20at%20time%20bin%20%7D%20t)
δ<sub>1</sub> | <sup>3</sup>⁄<sub>2</sub> ⋅ (<sup>`Constants.k2`</sup> / <sub>α<sub>1</sub><sup>2</sup></sub>) ⋅ ((3 * Math.pow(Math.cos(this.inclo), 2) - 1) / Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2));
α<sub>0</sub> | α<sub>1</sub> * (1 - 1 / 3 * δ<sub>1</sub> - δ<sub>1</sub> ** 2 - 134 / 81 * (delta1 ** 3));
δ<sub>0</sub> | <sup>3</sup>⁄<sub>2</sub> * (Constants.k2 / Math.pow(alpha0, 2)) * ((3 * Math.pow(Math.cos(this.inclo), 2) - 1) / Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2));
n"<sub>0</sub> | <sup>`ndot`</sup>⁄<sub>(1 + δ<sub>0</sub>)</sub>
α"<sub>0</sub> | <sup>α<sub>0</sub></sup>⁄<sub>(1 - δ<sub>0</sub>)</sub>