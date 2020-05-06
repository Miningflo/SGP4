Variable name | Value
------------- | -----
α<sub>1</sub> | ![equation](http://latex.codecogs.com/png.latex?%28%5Cfrac%7BConstants.ke%7D%7Bno%7D%29%5E%5Cfrac%7B2%7D%7B3%7D)
δ<sub>1</sub> | ![equation](http://latex.codecogs.com/png.latex?%5Cfrac%7B3%7D%7B2%7D%5Cfrac%7Bk_2%7D%7B%7Ba_1%7D%5E2%7D%5Cfrac%7B%283cos%5E2%28inclo%29-1%29%7D%7B%281%20-%20ecco%5E2%29%5E%7B%5Cfrac%7B3%7D%7B2%7D%7D%7D)
α<sub>0</sub> | α<sub>1</sub> * (1 - 1 / 3 * δ<sub>1</sub> - δ<sub>1</sub> ** 2 - 134 / 81 * (delta1 ** 3));
δ<sub>0</sub> | <sup>3</sup>⁄<sub>2</sub> * (Constants.k2 / Math.pow(alpha0, 2)) * ((3 * Math.pow(Math.cos(this.inclo), 2) - 1) / Math.pow(1 - Math.pow(this.ecco, 2), 3 / 2));
n"<sub>0</sub> | <sup>`ndot`</sup>⁄<sub>(1 + δ<sub>0</sub>)</sub>
α"<sub>0</sub> | <sup>α<sub>0</sub></sup>⁄<sub>(1 - δ<sub>0</sub>)</sub>