PerfectFont.UsedFont = function (id, fontName, fontDetails) {
    this.init(id, fontName, fontDetails);
}
PerfectFont.UsedFont.prototype.init = function (id, fontName, fontDetails) {
    this.id = id;
    this.domElements = [];
    this.fontDetails = fontDetails;
    this.fontName = fontName;
    this.oldFontName = fontName;
}
PerfectFont.UsedFont.prototype.getId = function () {
    return this.id;
}
PerfectFont.UsedFont.prototype.setId = function (id) {
    this.id = id;
}
PerfectFont.UsedFont.prototype.getDomElements = function () {
    return this.domElements;
}
PerfectFont.UsedFont.prototype.addDomElement = function (domElement) {
    this.domElements.push(domElement);
}
PerfectFont.UsedFont.prototype.removeDomElement = function (domElement) {
    this.domElements.splice(this.domElements.indexOf(domElement), 1);
}
PerfectFont.UsedFont.prototype.getFontName = function () {
    return this.fontName;
}
PerfectFont.UsedFont.prototype.getOldFontName = function () {
    return this.oldFontName;
}
PerfectFont.UsedFont.prototype.updateFontName = function (fontName) {
    this.fontName = fontName;
    for (var i = 0; i < this.domElements.length; i++) {
        this.domElements[i].style["font-family"] = fontName;
    }
}
PerfectFont.UsedFont.prototype.getFontDetails = function (fontDetail) {
    if (fontDetail) {
        return this.fontDetails[fontDetail];
    }
    return this.fontDetails;
}
PerfectFont.UsedFont.prototype.setFontDetails = function (fontDetails) {
    this.fontDetails = fontDetails;
}
PerfectFont.UsedFont.prototype.updateFontDetails = function (fontDetail, value) {
    this.fontDetails[fontDetail] = value;
    for (var i = 0; i < this.domElements.length; i++) {
        this.domElements[i].style[fontDetail] = value;
    }
}