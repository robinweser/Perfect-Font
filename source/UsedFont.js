var UsedFont = function (id, fontName, fontDetails) {
    this.init = function (id, fontName, fontDetails) {
        this.id = id;
        this.domElements = [];
        this.fontDetails = fontDetails;
        this.fontName = fontName;
        this.originFontName = fontName;
    };

    this.addDomElement = function (domElement) {
        this.domElements.push(domElement);
    };
    this.removeDomElement = function (domElement) {
        this.domElements.splice(this.domElements.indexOf(domElement), 1);
    };
    this.updateFontName = function (fontName) {
        this.fontName = fontName;
        for (var i = 0; i < this.domElements.length; ++i) {
            this.domElements[i].style.setProperty("font-family", this.fontName);
        };
    };
    this.updateFontDetails = function (fontDetail, value) {
        this.fontDetails[fontDetail] = value;
        for (var i = 0; i < this.domElements.length; ++i) {
            if (fontDetail == "fontSize" || fontDetail == "letterSpacing" || fontDetail == "wordSpacing" || fontDetail == "lineHeight") {
                value += "px";
            };
            this.domElements[i].style[fontDetail] = value;
        };
    }
}