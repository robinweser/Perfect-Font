/*===========================================================================

   calculateMe.js is kind of an extension to the JavaScript build-in Math-Library.
   Check https://bitbucket.org/Grindelwald/calculateme.js for more information

   Current Version: 0.0.1
                    September 15 2014

   Author(s): Robin Frischmann
   License: MIT License
            http://opensource.org/licenses/mit-license.php

   If you modify this code please add your name and what was modified to this
   header, as well as the date modified.

 ===========================================================================*/


// -- CONFIGURATION -- //
var defaults = {
    draggable: true,
    window: true,
    transparent: true,
    livePreview: true,
    controlButton: true
};
// -- CONFIGURATION -- //




var PerfectFont = function (config) {
    //TODO: config dynamisch ersetzen
    if (!config) {
        config = defaults;
    }
    this.init(config);
}

// *** INFO & CREDITS *** //
PerfectFont.prototype.info = {
    name: "perfectfont.js",
    version: "1.0.0",
    build: "11.11.2014",
    author: "Robin Frischmann",
    copyright: "Copyright " + String.fromCharCode(169) + " 2014 Robin Frischmann - MIT licenese",
    //TODO: REPO, DESCRIPTION, LICENSE
    repository: "https://bitbucket.org/rofrischmann",
    description: "calculateMe.js is a small but powerful set of extensions for the build-in JavaScript Math-Library.",
    license: "MIT license (http://opensource.org/licenses/mit-license.php)"
}

PerfectFont.prototype.init = function (config) {
    this.ControlButton = new PerfectFont.ControlButton(this);
    this.setConfig(config);

    //DOM-Element
    this.dom = document.createElement("div");
    this.header = document.createElement("div");
    this.fontList = document.createElement("ul");
    this.fontDetail = document.createElement("div");
    this.dom.classList.add("perfectfont-container");
    this.header.classList.add("perfectfont-header");
    this.fontList.classList.add("perfectfont-fontlist");
    this.fontDetail.classList.add("perfectfont-fontdetail");
    this.dom.appendChild(this.header);
    this.dom.appendChild(this.fontList);
    this.dom.appendChild(this.fontDetail);

    //TODO: Ampelsystem
    this.header.innerHTML = "Choose Font";
    document.body.appendChild(this.dom);
}

PerfectFont.prototype.setConfig = function (config) {
    this.config = config;
}
PerfectFont.prototype.getConfig = function () {
    return this.config;
}

PerfectFont.prototype.show = function () {
    this.dom.style.display = "block";
    if (!this.fontList.style.height) {
        var newHeight = this.fontList.offsetHeight - this.header.offsetHeight;
        this.fontList.style.height = newHeight;
        this.fontDetail.style.height = newHeight;
    }
}
PerfectFont.prototype.maximize = function () {

}
PerfectFont.prototype.minimize = function () {

}
PerfectFont.prototype.hide = function () {
    this.dom.style.display = "none";
}
PerfectFont.prototype.close = function () {
    document.body.removeChild(this.dom);
}
PerfectFont.prototype.getUsedFonts = function () {

}
PerfectFont.prototype.setNewFont = function (oldFont, newFont) {

}
PerfectFont.prototype.getFontDetail = function (usedFont) {

}
PerfectFont.prototype.getFontSize = function (usedFont) {

}
PerfectFont.prototype.setFontSize = function (usedFont, newFontSize) {

}

window.onload = init;

var d;
var mousex;
var mousey;
var move = false;
var ldivx = 200;
var ldivy = 200;

function init() {
    var p = new PerfectFont();
    p.show();
    d = p.dom;
    d.onmousedown = mousedown;
    d.onmouseup = mouseup;
    d.onmousemove = mousemove;
    d.style.left = ldivx + 'px';
    d.style.top = ldivy + 'px';
    d.style.display = 'block';
}

function mousedown(e) {
    move = true;
    mousex = e.clientX;
    mousey = e.clientY;
}

function mouseup(e) {
    move = false;
}

function mousemove(e) {
    if (move) {
        ldivx = ldivx + e.clientX - mousex;
        ldivy = ldivy + e.clientY - mousey;
        mousex = e.clientX;
        mousey = e.clientY;
        d.style.left = ldivx + 'px';
        d.style.top = ldivy + 'px';
    }
}


PerfectFont.UsedFont = function (id, fontDetails, domElements) {
    this.init(id, fontDetail, domElements);
}
PerfectFont.UsedFont.prototype.init = function (id, fontDetails, domElements) {
    this.id = id;
    this.domElements = domElements;
    this.fontDetails = fontDetails;
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
PerfectFont.UsedFont.prototype.setDomElements = function (domElements) {
    this.domElements = domElements;
}
PerfectFont.UsedFont.prototype.getFontDetails = function () {
    return this.fontDetails;
}
PerfectFont.UsedFont.prototype.setFontDetails = function (fontDetails) {
    this.fontDetails = fontDetails;
}
PerfectFont.UsedFont.prototype.update = function (fontDetails, id, domElements) {
    this.setId(id);
    this.setFontDetails(fontDetails);
    this.setDomElements(domElements);
}


PerfectFont.ControlButton = function (perfectFont) {
    this.init(perfectFont);
}
PerfectFont.ControlButton.prototype.init = function (perfectFont) {}
PerfectFont.ControlButton.prototype.show = function () {}
PerfectFont.ControlButton.prototype.h
ide = function () {}