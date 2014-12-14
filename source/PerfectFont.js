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
******************************************************************************************/

// -- CONFIGURATION -- //
var defaults = {
    draggable: true,
    maximized: false,
    docked: false,
    transparent: false,
    controlButton: true,
    fonts: {
        googleWebFonts: {
            serif: true,
            sansSerif: false,
            handwriting: false,
            display: false,
            monospace: false
        }
    }
};
// -- CONFIGURATION -- //

var currentPerfectFont;
var mouseX, mouseY, lDivX, lDivY;
var move = false;
var PerfectFont = function (config) {
    //TODO: config dynamisch ersetzen
    if (!config) {
        config = defaults;
    }
    this.init(config);
}

// *** INFO & CREDITS *** //
PerfectFont.prototype.info = {
    name: "perfectfont",
    version: "1.0",
    build: "08.12.2014",
    author: "Robin Frischmann"
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
            if (currentPerfectFont.getConfig("docked") || currentPerfectFont.getConfig("maximized")) {
                lDivX = parseInt(Extend.getStyleProperty(currentPerfectFont.dom, "left"));
                lDivY = parseInt(Extend.getStyleProperty(currentPerfectFont.dom, "top"));
            }
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
    this.header.innerHTML = "Choose Font ";
    document.body.appendChild(this.dom);
    this.initWindowSettings();
    this.initPreferenceView();
}
PerfectFont.prototype.initWindowSettings = function () {
    lDivX = parseInt(Extend.getStyleProperty(currentPerfectFont.dom, "left"));
    lDivY = parseInt(Extend.getStyleProperty(currentPerfectFont.dom, "top"));

    var closeButton = document.createElement("i");
    var minimizeButton = document.createElement("i");
    var maximizeButton = document.createElement("i");
    var toggleTransparencyButton = document.createElement("i");
    var dockLeftButton = document.createElement("i");
    var dockRightButton = document.createElement("i");
    var dockTopButton = document.createElement("i");

    closeButton.className = "perfectfont fa fa-plus-circle";
    minimizeButton.className = "perfectfont fa fa-minus-circle";
    maximizeButton.className = "perfectfont fa fa-plus-circle";
    toggleTransparencyButton.className = "perfectfont fa fa-eye";
    dockLeftButton.className = "perfectfont fa fa-arrow-circle-left";
    dockTopButton.className = "perfectfont fa fa-arrow-circle-up";
    dockRightButton.className = "perfectfont fa fa-arrow-circle-right";

    var vendors = ["-webkit-", "-moz-", "-ms-", "-khtml", "-o"];
    vendors.forEach(function (item) {
        closeButton.style.setProperty(item + "-transform", "rotate(45deg)")
    })
    closeButton.style.setProperty("float", "left");
    minimizeButton.style.setProperty("float", "left");
    maximizeButton.style.setProperty("float", "left");
    dockLeftButton.style.setProperty("float", "right");
    dockTopButton.style.setProperty("float", "right");
    dockRightButton.style.setProperty("float", "right");

    dockLeftButton.addEventListener("click", function () {
        currentPerfectFont.dock("left");
    });
    dockTopButton.addEventListener("click", function () {
        currentPerfectFont.dock("top");
    })
    dockRightButton.addEventListener("click", function () {
        currentPerfectFont.dock("right");
    })
    toggleTransparencyButton.addEventListener("click", function () {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
        } else {
            this.classList.add("active");
        }
        currentPerfectFont.toggleTransparency();
    })
    closeButton.addEventListener("click", function () {
        currentPerfectFont.close();
    })
    minimizeButton.addEventListener("click", function () {
        currentPerfectFont.minimize();
    })
    maximizeButton.addEventListener("click", function () {
        currentPerfectFont.maximize();
    })
    this.header.appendChild(closeButton);
    this.header.appendChild(minimizeButton);
    this.header.appendChild(maximizeButton);
    this.header.appendChild(toggleTransparencyButton);
    this.header.appendChild(dockRightButton);
    this.header.appendChild(dockTopButton);
    this.header.appendChild(dockLeftButton);
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
        tempInputItem.addEventListener("change", function () {
            currentPerfectFont.updateUsedFontDetails(this)
        })
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
    this.availableFonts.onchange = function () {
        currentPerfectFont.updateUsedFont(this)
    };
    this.fontDetail.appendChild(this.availableFonts);

    this.initFonts();
}
PerfectFont.prototype.initFonts = function () {
    var gwf = this.getConfig("fonts").googleWebFonts;
    this.loadGoogleWebFonts(gwf.serif, gwf.sansSerif, gwf.handwriting, gwf.display, gwf.monospace);
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
                letterSpacing: (Extend.getStyleProperty(tempItem, "letter-spacing") == "normal" ? 0 : Extend.getStyleProperty(tempItem, "font-weight")),
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
PerfectFont.prototype.loadGoogleWebFonts = function (serif, sansSerif, handwriting, display, monospace) {
    var headFile = document.createElement("link");
    headFile.rel = "stylesheet";
    headFile.type = "text/css";
    headFile.href = "http://fonts.googleapis.com/css?family=";
    var includeFontByStyle = function (style) {
        var first = true;
        for (var i in googlefonts[style]) {
            if (!first) {
                headFile.href += "|";
            }
            first = false;
            headFile.href += i.replace(/ /g, "+");
            if (googlefonts[style][i] != "") {
                headFile.href += ":" + googlefonts[style][i];
            }
            currentPerfectFont.addAvailableFont(i);
        }
    }
    if (serif) {
        includeFontByStyle("serif");
    }
    headFile.href += "&subset=latin,latin-ext,greek-ext,greek,devanagari,cyrillic,cyrillic-ext,vietnamese";
    document.head.appendChild(headFile);
}
PerfectFont.prototype.addAvailableFont = function (font) {
    this.availableFonts.innerHTML += '<option  class="perfectfont" style="font-family:' + font + ' !important">' + font + '</option>';
    this.availableFonts.size = (parseInt(this.availableFonts.size) + 1);
}
PerfectFont.prototype.addFontToFontList = function (usedFont) {
    var tempListItem = document.createElement("li");
    tempListItem.id = "perfectfont-fontlist-" + usedFont.id;
    tempListItem.innerHTML = '<p style="font-family:' + usedFont.fontName + '">' + usedFont.fontName + '</p><span class="perfectfont">' + usedFont.oldFontName + ' - ' + usedFont.fontDetails.fontSize + '</span>'
    tempListItem.classList.add("perfectfont");
    tempListItem.addEventListener("click", function () {
        currentPerfectFont.showUsedFontPreferences(this, usedFont)
    })
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
    document.getElementsByClassName("perfectfont-active")[0].childNodes[0].style.setProperty("font-family", clickedElement.value);
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
    this.dom.classList.add("transition-400");
    this.dom.style.setProperty("height", newHeight + "px");
    var newInnerHeight = newHeight - this.header.offsetHeight;
    this.fontList.style.setProperty("height", (newInnerHeight - 1) + "px");
    this.fontDetail.style.setProperty("height", (newInnerHeight - 2) + "px");
    this.availableFonts.style.setProperty("height", (newInnerHeight - (5 * document.getElementById("perfectfont-preference-fontSize").offsetHeight) - 2) + "px");
    document.getElementById("perfectfont-preference-color").style.setProperty("height", document.getElementById("perfectfont-preference-fontSize").offsetHeight + "px");
    setTimeout('currentPerfectFont.dom.classList.remove("transition-400")', 400);
}
PerfectFont.prototype.resizeWidth = function (newWidth) {
    this.dom.classList.add("transition-400");
    this.dom.style.setProperty("width", newWidth + "px");
    setTimeout('currentPerfectFont.dom.classList.remove("transition-400")', 400);
}
PerfectFont.prototype.updatePosition = function (x, y) {
    this.dom.style.setProperty("left", x + "px");
    this.dom.style.setProperty("top", y + "px");
}
PerfectFont.prototype.maximize = function () {
    var maximized = this.getConfig("maximized");
    if (maximized) {
        this.resizeWidth(400);
        this.resizeHeight(400);
        this.updatePosition(lDivX, lDivY);
    } else {
        this.resizeWidth(window.innerWidth);
        this.resizeHeight(window.innerHeight);
        this.updatePosition(0, 0)
    }
    this.updateConfig("maximized", !maximized);
}
PerfectFont.prototype.dock = function (orientation) {
    var docked = this.getConfig("docked");
    var newDocked = false;
    if (docked == orientation) {
        this.resizeWidth(400);
        this.resizeHeight(400);
        this.updatePosition(lDivX, lDivY);
        newDocked = false;
    } else {
        newDocked = orientation;
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
    this.updateConfig("docked", newDocked);
}
PerfectFont.prototype.dockLeft = function () {
    this.updatePosition(0, 0);
    this.resizeHeight(window.innerHeight - 1);
    this.resizeWidth(400);
}
PerfectFont.prototype.dockTop = function () {
    this.updatePosition(0, 0);
    this.resizeHeight(400);
    this.resizeWidth(window.innerWidth - 1);
}
PerfectFont.prototype.dockRight = function () {
    this.updatePosition(window.innerWidth - 400, 0);
    this.resizeHeight(window.innerHeight - 1);
    this.resizeWidth(400);
}
PerfectFont.prototype.toggleTransparency = function () {
    var transparent = this.getConfig("transparent");
    if (transparent) {
        this.dom.style.setProperty("opacity", 1.0);
    } else {
        this.dom.style.setProperty("opacity", 0.4);
    }
    this.updateConfig("transparent", !transparent);
}
PerfectFont.prototype.show = function () {
    this.dom.style.setProperty("display", "block");
    if (!this.fontList.style.height) {
        this.resizeHeight(this.dom.offsetHeight);
    }
}
PerfectFont.prototype.hide = function () {
    this.dom.style.setProperty("display", "none");
}
PerfectFont.prototype.close = function () {
    this.dom.style.setProperty("display", "none");
}