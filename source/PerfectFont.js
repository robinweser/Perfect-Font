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

var title = "Perfect Font";
var preId = "perfectfont-";


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

var perfectfont = {
    config: undefined,
    selected: null,
    window: undefined,
    usedFonts: [],
    selectedUsedFont: null,
    selectedUsedFontId: null,

    //Initialized perfectfont with a config
    init: function (config) {
        this.config = config;

        if (!this.config) {
            this.config = this.defaults;
        }
        //perfectFontControlButton.init();
        this.initWindow();
        this.initFonts();
    },

    initWindow: function (callback) {
        this.window = document.createElement("div");
        this.window.id = preId + "window";
        document.body.appendChild(this.window);
        //header
        this.window.innerHTML += '<div id="' + preId + 'header">' + title + '</div>';

        //body
        this.window.innerHTML += '<ul id="' + preId + 'list"></ul>';
        this.window.innerHTML += '<div id="' + preId + 'detail"><div id="' + preId + 'preference"></div><div id="' + preId + 'value"></div></div>';

        this.initTools();
        this.initDetails();
    },

    initTools: function () {
        //TODO: add window tools
    },

    initDetails: function () {
        var preferenceContainer = document.getElementById(preId + "preference");
        var valueContainer = document.getElementById(preId + "value");
        var detailContainer = document.getElementById(preId + "detail");

        var preferenceNames = ["Size", "Weight", 'Spacing <span class="perfectfont">(Letter)</span>', 'Spacing <span class="perfectfont">(Word)</span>', "Color"];
        var valueTypes = ["number", "number", "number", "number", "color"];
        var valueIds = ["fontSize", "fontWeight", "letterSpacing", "wordSpacing", "color"];

        var preferenceList = "";
        var valueList = "";

        for (var i = 0; i < preferenceNames.length; ++i) {
            preferenceList += '<li class="perfectfont">' + preferenceNames[i] + '</li>';
            valueList += '<input id="' + preId + valueIds[i] + '" type="' + valueTypes[i] + '" onchange="perfectfont.updateUsedFontDetail(this)"';
            if (valueIds[i] == "fontWeight") {
                valueList += 'min="100" max="900" step="100"';
            }
            valueList += '>';
        }
        preferenceContainer.innerHTML = preferenceList;
        valueContainer.innerHTML = valueList;
        detailContainer.innerHTML += '<select id="' + preId + 'available" onchange="perfectfont.updateUsedFont(this)">';
    },


    initFonts: function () {
        var me = this;

        this.initUsedFonts();
        this.usedFonts.forEach(function (item) {
            me.addFontToFontList(item);
            me.addAvailableFont(item.fontName);
        });
        //var gwf = this.config.fonts.googleWebFonts;
        //  this.loadGoogleWebFonts(gwf.serif, gwf.sansSerif, gwf.handwriting, gwf.display, gwf.monospace);
    },

    initUsedFonts: function () {
        var alreadyCheckedFontStrings = [];
        var alreadyCheckedFontStringsUsedFonts = [];
        var allTextElements = this.getElementsWithInnerText();

        var allTextElementsLength = allTextElements.length;
        for (var i = 0; i < allTextElementsLength; ++i) {
            var tempItem = allTextElements[i];
            if (tempItem.className.indexOf("perfectfont") != -1 || tempItem.id.indexOf("perfectfont") != -1) {
                break;
            }
            var tempFontString = this.getStyleProperty(tempItem, "font-family");
            var alreadyCheckedFontStringsIndex = alreadyCheckedFontStrings.indexOf(tempFontString);
            if (alreadyCheckedFontStringsIndex != -1) {
                this.usedFonts[alreadyCheckedFontStringsIndex].addDomElement(tempItem);
            } else {
                alreadyCheckedFontStrings.push(tempFontString);
                var tempSplitFontString = tempFontString.split(",");
                for (var j in tempSplitFontString) {
                    if (this.isAvailableFont(tempSplitFontString[j])) {
                        tempFontString = tempSplitFontString[j].replace(/'/g, "");
                        break;
                    }
                }
                alreadyCheckedFontStringsUsedFonts.push(tempFontString);
                var tempFontDetails = {
                    fontWeight: (this.getStyleProperty(tempItem, "font-weight") == "normal" ? 400 : this.getStyleProperty(tempItem, "font-weight")),
                    fontSize: this.getStyleProperty(tempItem, "font-size"),
                    letterSpacing: (this.getStyleProperty(tempItem, "letter-spacing") == "normal" ? 0 : this.getStyleProperty(tempItem, "font-weight")),
                    wordSpacing: this.getStyleProperty(tempItem, "word-spacing"),
                    color: this.getStyleProperty(tempItem, "color"),
                    fontStyle: this.getStyleProperty(tempItem, "font-style"),
                    fontVariant: this.getStyleProperty(tempItem, "font-variant")
                }
                var tempUsedFont = new UsedFont();
                tempUsedFont.init((alreadyCheckedFontStringsUsedFonts.length - 1), tempFontString, tempFontDetails);
                this.usedFonts.push(tempUsedFont);
                this.usedFonts[(alreadyCheckedFontStringsUsedFonts.length - 1)].addDomElement(tempItem);
            }
        }
    },

    addAvailableFont: function (font) {
        var availableContainer = document.getElementById(preId + "available");

        var newAvailableFont = '<option  class="perfectfont" style="font-family:' + font + ' !important">' + font + '</option>';
        availableContainer.innerHTML += newAvailableFont;
        availableContainer.size += 1;
    },

    addFontToFontList: function (usedFont) {
        var fontList = document.getElementById(preId + "list");

        var newUsedFont = '<li id="' + preId + usedFont.id + '" onclick="perfectfont.showUsedFontPreferences(this)"><p class="perfectfont" style="font-family:' + usedFont.fontName + '">' + usedFont.fontName + '</p><span class="perfectfont">' + usedFont.originFontName + ' - ' + usedFont.fontDetails.fontSize + '</span></li>'
        fontList.innerHTML += newUsedFont;
        fontList.childNodes[fontList.childNodes.length - 1].click();
    },

    setSelectedUsedFont: function (clickedElement) {
        this.selectedUsedFontId = clickedElement.id.replace(preId, "");
        this.selectedUsedFont = this.usedFonts[this.selectedUsedFontId];

        if (document.getElementsByClassName(preId + "selected").length > 0) {
            document.getElementsByClassName(preId + "selected")[0].classList.remove(preId + "selected");
        }
        clickedElement.classList.add("perfectfont-selected");

    },
    showUsedFontPreferences: function (clickedElement) {
        this.setSelectedUsedFont(clickedElement);

        if (this.selectedUsedFont.fontDetails.fontWeight == "normal") {
            this.selectedUsedFont.fontDetails.fontWeight = 400;
        }
        document.getElementById(preId + "fontSize").value = parseFloat(this.selectedUsedFont.fontDetails.fontSize);
        document.getElementById(preId + "fontWeight").value = this.selectedUsedFont.fontDetails.fontWeight;
        document.getElementById(preId + "letterSpacing").value = parseFloat(this.selectedUsedFont.fontDetails.letterSpacing);
        document.getElementById(preId + "wordSpacing").value = parseFloat(this.selectedUsedFont.fontDetails.wordSpacing);
        document.getElementById(preId + "color").value = this.selectedUsedFont.fontDetails.color;
    },

    toggleTransparency: function () {
        if (this.config.transparent) {
            this.window.style.setProperty("opacity", 1.0);
        } else {
            this.window.style.setProperty("opacity", 0.4);
        }
        this.config.transparent = !this.config.transparent;
    },

    getElementsWithInnerText: function () {
        var allBodyElements = document.body.querySelectorAll("*");
        var selectedElements = [];
        var allBodyElementsLength = allBodyElements.length;
        for (var i = 0; i < allBodyElementsLength; ++i) {
            if (allBodyElements[i].innerText != "" || allBodyElements[i].innerText != undefined) {
                selectedElements.push(allBodyElements[i]);
            }
        }
        return selectedElements;
    },

    //Function to get an element style (computed also)
    getStyleProperty: function (DOMElement, property) {
        return window.getComputedStyle(DOMElement).getPropertyValue(property);
    },

    loadGoogleWebFonts: function (serif, sansSerif, handwriting, display, monospace) {
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
                this.addAvailableFont(i);
            }
        }
        if (serif) {
            includeFontByStyle("serif");
        }
        headFile.href += "&subset=latin,latin-ext,greek-ext,greek,devanagari,cyrillic,cyrillic-ext,vietnamese";
        document.head.appendChild(headFile);
    },

    getGoogleWebFonts: function () {

    },

    isAvailableFont: function (fontName) {
        return checkfont(fontName);
    },

    updateUsedFont: function (clickedElement) {
        this.selectedUsedFont.updateFontName(clickedElement.value);

        document.getElementsByClassName(preId + "selected")[0].childNodes[0].innerHTML = clickedElement.value;
        document.getElementsByClassName(preId + "selected")[0].childNodes[0].style.setProperty("font-family", clickedElement.value);
    },
    updateUsedFontDetail: function (clickedElement) {
        this.selectedUsedFont.updateFontDetails(clickedElement.id.replace(preId, ""), clickedElement.value);
    },
    show: function () {
        this.window.style.setProperty("display", "block");
    },
    close: function () {
        this.window.style.setProperty("display", "none");
    }
}