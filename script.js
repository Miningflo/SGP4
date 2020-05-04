loadfile("./tle.txt").then(fulltle => {
    let tle = loadtle(fulltle);
    console.log(tle);
});
