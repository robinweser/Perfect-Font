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
    this.preference.classList.add("perfectfont-preference");
    this.preferenceValue.classList.add("perfectfont-preferenceValue");
    this.fontDetail.appendChild(this.preference);
    this.fontDetail.appendChild(this.preferenceValue);
    this.dom.appendChild(this.header);
    this.dom.appendChild(this.fontList);
    this.dom.appendChild(this.fontDetail);

    this.header.innerHTML = 'Choose Font';
    document.body.appendChild(this.dom);
    this.initPreferenceView();
}
PerfectFont.prototype.initPreferenceView = function () {
    var preferences = ["Size", "Weight", 'Spacing <span class="perfectfont">(Letter)</span>', 'Spacing <span class="perfectfont">(Word)</span>', "Color"];
    for (var i = 0; i < preferences.length; ++i) {
        var tempListItem = document.createElement("li");
        tempListItem.innerHTML = preferences[i];
        tempListItem.classList.add("perfectfont");
        this.preference.appendChild(tempListItem);
    };

    var types = ["number", "number", "number", "number", "color"];
    var ids = ["fontSize", "fontWeight", "letterSpacing", "wordSpacing", "color"];
    for (var i = 0; i < types.length; ++i) {
        var tempInputItem = document.createElement("input");
        tempInputItem.classList.add("perfectfont");
        tempInputItem.id = "perfectfont-preference-" + ids[i];
        tempInputItem.type = types[i];
        tempInputItem.onchange = function () {
            currentPerfectFont.updateUsedFontDetails(this)
        };
        if (types[i] == "number") {
            if (i == 1) {
                tempInputItem.min = "100";
                tempInputItem.max = "900";
                tempInputItem.step = "100";
            } else {
                tempInputItem.min = "0"
            }
        }
        this.preferenceValue.appendChild(tempInputItem);
    }
    this.availableFonts = document.createElement("select");
    this.availableFonts.classList.add("perfectfont-availableFonts");
    this.availableFonts.size = "5";
    this.availableFonts.onchange = function () {
        currentPerfectFont.updateUsedFont(this)
    };
    this.fontDetail.appendChild(this.availableFonts);

    this.initFonts();
}
PerfectFont.prototype.initFonts = function () {
    this.initUsedFonts();
    for (var i = 0; i < this.usedFonts.length; ++i) {
        this.addFontToFontList(this.usedFonts[i]);
    }
    this.fontList.childNodes[0].click();
}
PerfectFont.prototype.initUsedFonts = function () {
    this.usedFonts = [];
    var alreadyCheckedFontStrings = [];
    var alreadyCheckedFontStringsUsedFonts = [];
    var allTextElements = Extend.getElementsWithInnerText();
    var allTextElementsLength = allTextElements.length;
    for (var i = 0; i < allTextElementsLength; ++i) {
        var tempItem = allTextElements[i];
        if (tempItem.className.indexOf("perfectfont") != -1) {
            break;
        }
        var tempFontString = Extend.getStyleProperty(tempItem, "font-family");
        var alreadyCheckedFontStringsIndex = alreadyCheckedFontStrings.indexOf(tempFontString);
        if (alreadyCheckedFontStringsIndex != -1) {
            this.usedFonts[alreadyCheckedFontStringsIndex].addDomElement(tempItem);
        } else {
            alreadyCheckedFontStrings.push(tempFontString);
            var tempSplitFontString = tempFontString.split(",");
            for (var j in tempSplitFontString) {
                if (this.isAvailableLocalFont(tempSplitFontString[j])) {
                    tempFontString = tempSplitFontString[j].replace(/'/g, "");
                    break;
                }
            }
            alreadyCheckedFontStringsUsedFonts.push(tempFontString);
            var tempFontDetails = {
                fontWeight: (Extend.getStyleProperty(tempItem, "font-weight") == "normal" ? 400 : Extend.getStyleProperty(tempItem, "font-weight")),
                fontSize: Extend.getStyleProperty(tempItem, "font-size"),
                letterSpacing: (Extend.getStyleProperty(tempItem, "font-weight") == "normal" ? 0 : Extend.getStyleProperty(tempItem, "font-weight")),
                wordSpacing: Extend.getStyleProperty(tempItem, "word-spacing"),
                color: Extend.getStyleProperty(tempItem, "color"),
                fontStyle: Extend.getStyleProperty(tempItem, "font-style"),
                fontVariant: Extend.getStyleProperty(tempItem, "font-variant")
            }
            var tempUsedFont = new PerfectFont.UsedFont((alreadyCheckedFontStringsUsedFonts.length - 1), tempFontString, tempFontDetails);
            this.usedFonts.push(tempUsedFont);
            this.usedFonts[(alreadyCheckedFontStringsUsedFonts.length - 1)].addDomElement(tempItem);
        }
    }
}
PerfectFont.prototype.isAvailableLocalFont = function (fontName) {
    return checkfont(fontName);
}
PerfectFont.prototype.getUsedFonts = function () {
    return this.usedFonts;
}
PerfectFont.prototype.loadGoogleWebFonts = function () {
    this.availableFonts.innerHTML = '<option  class="perfectfont">Lato</option><option  class="perfectfont">Arial</option><option class="perfectfont">Impact</option><option class="perfectfont">Neucha</option><option class="perfectfont">UnverschaemtSans</option>'
}
PerfectFont.prototype.addAvailableFont = function (font) {
    this.availableFonts.innerHTML += '<option  class="perfectfont" style="font-family:' + font + '">' + font + '</option>';
}
PerfectFont.prototype.addFontToFontList = function (usedFont) {
    var tempListItem = document.createElement("li");
    tempListItem.id = "perfectfont-fontlist-" + usedFont.id;
    tempListItem.innerHTML = '<p style="font-family:' + usedFont.fontName + '">' + usedFont.fontName + '</p><span class="perfectfont">' + usedFont.oldFontName + ' - ' + usedFont.fontDetails.fontSize + '</span>'
    tempListItem.classList.add("perfectfont");
    tempListItem.onclick = function () {
        currentPerfectFont.showUsedFontPreferences(this, usedFont)
    };
    this.fontList.appendChild(tempListItem);
    this.fontList.childNodes[0].click();
}
PerfectFont.prototype.getSelectedUsedFont = function () {
    var usedFont;
    var activeFontId = document.getElementsByClassName("perfectfont-active")[0].id.replace("perfectfont-fontlist-", "");
    for (var i = 0; i < this.usedFonts.length; ++i) {
        if (this.usedFonts[i].id == activeFontId) {
            usedFont = this.usedFonts[i];
            break;
        }
    }
    return usedFont;
}
PerfectFont.prototype.updateUsedFont = function (clickedElement) {
    var selectedUsedFont = this.getSelectedUsedFont();
    selectedUsedFont.updateFontName(clickedElement.value);
    debugger;
    document.getElementsByClassName("perfectfont-active")[0].childNodes[0].innerHTML = clickedElement.value;
    document.getElementsByClassName("perfectfont-active")[0].childNodes[0].style.fontFamily = clickedElement.value;
}
PerfectFont.prototype.updateUsedFontDetails = function (clickedElement) {
    var selectedUsedFont = this.getSelectedUsedFont();
    selectedUsedFont.updateFontDetails(clickedElement.id.replace("perfectfont-preference-", ""), clickedElement.value);
}
PerfectFont.prototype.showUsedFontPreferences = function (clickedElement, usedFont) {
    if (document.getElementsByClassName("perfectfont-active").length > 0) {
        document.getElementsByClassName("perfectfont-active")[0].classList.remove("perfectfont-active");
    }
    clickedElement.classList.add("perfectfont-active");
    var preId = "perfectfont-preference-";
    if (usedFont.fontDetails.fontWeight == "normal") {
        usedFont.fontDetails.fontWeight = 400;
    }
    document.getElementById(preId + "fontSize").value = parseFloat(usedFont.fontDetails.fontSize);
    document.getElementById(preId + "fontWeight").value = usedFont.fontDetails.fontWeight;
    document.getElementById(preId + "letterSpacing").value = parseFloat(usedFont.fontDetails.letterSpacing);
    document.getElementById(preId + "wordSpacing").value = parseFloat(usedFont.fontDetails.wordSpacing);
    document.getElementById(preId + "color").value = usedFont.fontDetails.color;
}
PerfectFont.prototype.setConfig = function (config) {
    this.config = config;
}
PerfectFont.prototype.getConfig = function (preference) {
    if (preference) {
        return this.config[preference];
    }
    return this.config;
}
PerfectFont.prototype.updateConfig = function (preference, value) {
    this.config[preference] = value;
}
PerfectFont.prototype.updateHeight = function (newHeight) {
    this.dom.style.height = newHeight;
    var newInnerHeight = newHeight - this.header.offsetHeight;
    this.fontList.style.height = (newInnerHeight - 1);
    this.fontDetail.style.height = (newInnerHeight - 2);
    document.getElementById("perfectfont-preference-color").style.height = document.getElementById("perfectfont-preference-fontSize").offsetHeight;
}
PerfectFont.prototype.updateWidth = function (newWidth) {
    this.dom.style.width = newWidth;
}
PerfectFont.prototype.updatePosition = function (x, y) {
    this.dom.style.left = x;
    this.dom.style.top = y;
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