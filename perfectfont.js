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
    maximized: false,
    docked: false,
    transparent: true,
    livePreview: true,
    controlButton: true
};
// -- CONFIGURATION -- //
var currentPerfectFont;


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
    currentPerfectFont = this;
    this.ControlButton = new PerfectFont.ControlButton(this);
    this.setConfig(config);
    this.initWindow();
}

PerfectFont.prototype.initWindow = function () {
    //DOM-Element
    this.dom = document.createElement("div");
    this.header = document.createElement("div");
    this.fontList = document.createElement("ul");
    this.fontDetail = document.createElement("div");
    this.preference = document.createElement("div");
    this.preferenceValue = document.createElement("div");
    this.dom.classList.add("perfectfont-container");
    this.header.classList.add("perfectfont-header");
    this.fontList.classList.add("perfectfont-fontlist");
    this.fontDetail.classList.add("perfectfont-fontdetail");
    this.dom.appendChild(this.header);
    this.dom.appendChild(this.fontList);
    this.dom.appendChild(this.fontDetail);

    this.header.innerHTML = 'Choose Font';
    document.body.appendChild(this.dom);
}
PerfectFont.prototype.show = function () {
    this.dom.style.display = "block";
    if (!this.fontList.style.height) {
        this.updateHeight(this.dom.offsetHeight);
    }
}
PerfectFont.prototype.hide = function () {
    this.dom.style.display = "none";
}
PerfectFont.prototype.close = function () {
    document.body.removeChild(this.dom);
}