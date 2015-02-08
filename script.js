function resize() {
    var landing = document.getElementsByTagName("header")[0];
    var shortcut = document.getElementById("shortcut");

    if (landing.clientHeight < (document.body.clientHeight - shortcut.clientHeight)) {
        landing.style.setProperty("height", (document.body.clientHeight - shortcut.clientHeight) + "px");
    }
    resizeShortcuts();
}

window.onresize = resize;