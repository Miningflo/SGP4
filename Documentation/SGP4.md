Variable name | Value
------------- | -----
α<sub>1</sub> | ![equation](http://latex.codecogs.com/png.latex?%28%5Cfrac%7BConstants.ke%7D%7Bno%7D%29%5E%5Cfrac%7B2%7D%7B3%7D)
δ<sub>1</sub> | <sup>3</sup>⁄<sub>2</sub> ⋅ (<sup>`Constants.k2`</sup> / <sub>α<sub>1</sub><sup>2</sup></sub>) ⋅ ((3 * Math.pow(Math.cos(this.inclo), 2) - 1) / Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2));
α<sub>0</sub> | α<sub>1</sub> * (1 - 1 / 3 * δ<sub>1</sub> - δ<sub>1</sub> ** 2 - 134 / 81 * (delta1 ** 3));
δ<sub>0</sub> | <sup>3</sup>⁄<sub>2</sub> * (Constants.k2 / Math.pow(alpha0, 2)) * ((3 * Math.pow(Math.cos(this.inclo), 2) - 1) / Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2));
n"<sub>0</sub> | <sup>`ndot`</sup>⁄<sub>(1 + δ<sub>0</sub>)</sub>
α"<sub>0</sub> | <sup>α<sub>0</sub></sup>⁄<sub>(1 - δ<sub>0</sub>)</sub>