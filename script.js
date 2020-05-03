loadtle("./tle.txt").then(tle => {
    tle.forEach(sat => {
        sgp4(sat);
    });
});
