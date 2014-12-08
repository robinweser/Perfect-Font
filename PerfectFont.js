/******************************************************************************************
#
#       Copyright 2014 Robin Frischmann
#
#       Licensed under the Apache License, Version 2.0 (the "License");
#       you may not use this file except in compliance with the License.
#       You may obtain a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#       Unless required by applicable law or agreed to in writing, software
#       distributed under the License is distributed on an "AS IS" BASIS,
#       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#       See the License for the specific language governing permissions and
#       limitations under the License.
#
#       Projectname...................: perfectfont
#
#       Developer/Date................: Robin Frischmann, 08.12.2014
#       Version/Release...............: 1.0
#
******************************************************************************************/

// -- CONFIGURATION -- //
var defaults = {
    draggable: true,
    maximized: false,
    docked: false,
    transparent: false,
    livePreview: true,
    controlButton: true
};
var currentPerfectFont;
var mouseX, mouseY, lDivX, lDivY;
var move = false;
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
    if (this.getConfig("draggable")) {
        this.header.onmousedown = function (e) {
            move = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
            lDivX = parseInt(Extend.getStyleProperty(currentPerfectFont.dom, "left"));
            lDivY = parseInt(Extend.getStyleProperty(currentPerfectFont.dom, "top"));
        }
        document.body.onmouseup = function (e) {
            move = false;
        }
        document.body.onmousemove = function (e) {
            if (move) {
                lDivX += e.clientX - mouseX;
                lDivY += e.clientY - mouseY;
                mouseX = e.clientX;
                mouseY = e.clientY;
                currentPerfectFont.updatePosition(lDivX, lDivY);
            }
        }
    }
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
PerfectFont.prototype.resizeHeight = function (newHeight) {
    this.dom.style.height = newHeight;
    var newInnerHeight = newHeight - this.header.offsetHeight;
    this.fontList.style.height = (newInnerHeight - 1);
    this.fontDetail.style.height = (newInnerHeight - 2);
    document.getElementById("perfectfont-preference-color").style.height = document.getElementById("perfectfont-preference-fontSize").offsetHeight;
}
PerfectFont.prototype.resizeWidth = function (newWidth) {
    this.dom.style.width = newWidth;
}
PerfectFont.prototype.updatePosition = function (x, y) {
    this.dom.style.left = x;
    this.dom.style.top = y;
}
PerfectFont.prototype.maximize = function () {
    var maximized = this.getConfig("maximized");
    if (maximized) {
        this.resizeWidth(400);
        this.resizeHeight(400);
        this.updatePosition(200, 200);
    } else {
        this.resizeWidth(window.innerWidth);
        this.resizeHeight(window.innerHeight);
        this.updatePosition(0, 0)
    }
    this.updateConfig("maximized", !maximized);
}
PerfectFont.prototype.dock = function (orientation) {
    var docked = this.getConfig("docked");
    if (docked) {
        this.resizeWidth(400);
        this.resizeHeight(400);
        this.updatePosition(200, 200);
    } else {
        switch (orientation) {
        case "left":
            this.dockLeft();
            break;
        case "right":
            this.dockRight();
            break;
        case "top":
            this.dockTop();
            break;
        default:
            this.dockTop();
            break;
        }
    }
    this.updateConfig("docked", !docked);
}
PerfectFont.prototype.dockLeft = function () {
    this.updatePosition(0, 0);
    this.resizeHeight(window.innerHeight);
    this.resizeWidth(400);
}
PerfectFont.prototype.dockTop = function () {
    this.updatePosition(0, 0);
    this.resizeHeight(400);
    this.resizeWidth(window.innerWidth);
}
PerfectFont.prototype.dockRight = function () {
    this.updatePosition(window.innerWidth - 400, 0);
    this.resizeHeight(window.innerHeight);
    this.resizeWidth(400);
}
PerfectFont.prototype.toggleTransparency = function () {
    var transparent = this.getConfig("transparent");
    if (transparent) {
        this.dom.style.opacity = 1.0;
    } else {
        this.dom.style.opacity = 0.5;
    }
    this.updateConfig("transparent", !transparent);
}
PerfectFont.prototype.show = function () {
    this.dom.style.display = "block";
    if (!this.fontList.style.height) {
        this.resizeHeight(this.dom.offsetHeight);
    }
}
PerfectFont.prototype.hide = function () {
    this.dom.style.display = "none";
}
PerfectFont.prototype.close = function () {
    document.body.removeChild(this.dom);
}