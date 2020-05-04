loadfile("./tle.txt").then(fulltle => {
    console.log(fulltle);
    let tle = loadtle(fulltle);
    console.log(tle);
});
