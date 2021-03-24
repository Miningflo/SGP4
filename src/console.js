class Console {
    constructor(id) {
        this.id = id;
        let pre = document.createElement("pre");
        pre.id = id;
        document.body.appendChild(pre);
    }

    log(...msg) {
        for(let arg of msg){
            if(typeof arg !== "object"){
                document.getElementById(this.id).innerText += arg + " ";
            }else{
                document.getElementById(this.id).innerText += JSON.stringify(arg, null, 2);
            }
        }
        document.getElementById(this.id).innerText += "\n\n";
        window.console.log(...msg);
    }
}
