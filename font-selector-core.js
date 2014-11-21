var usedFonts = [];

function checkFont(font) {

}

function getUsedFonts() {

}

function getElementsByFont(font) {

}

function setFont(DOMELement, font, size) {
    if (DOMElement.className.indexOf("perfectfont") == -1) {
        DOMElement.style.fontFamily = font;
        if (size) {
            DOMElement.style.fontSize = size + "px";
        }
    }
}