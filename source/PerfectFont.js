var title = "Perfect Font";
var preId = "perfectfont-";


var mouseX, mouseY, lDivX, lDivY;
var move = false;

var domElements = ["window", "header", "list", "detail", "available-container", "available", "preference", "value"];
var preferenceNames = ["Size", "Weight", 'Spacing <span class="perfectfont">(Letter)</span>', 'Spacing <span class="perfectfont">(Word)</span>', 'Height <span class="perfectfont">(Line)</span>', "Color"];
var valueTypes = ["number", "number", "number", "number", "number", "color"];
var valueIds = ["fontSize", "fontWeight", "letterSpacing", "wordSpacing", "lineHeight", "color"];
var fontStyles = ["serif", "sans-serif", "handwriting", "display", "monospace"];

var defaults = {
    draggable: true,
    maximized: false,
    docked: false,
    transparent: false,
    controlButton: false,
    fonts: {
        googleWebFonts: {
            serif: true,
            sansSerif: true,
            handwriting: false,
            display: false,
            monospace: false
        }
    }
};

var perfectfont = {
    config: undefined,
    selected: null,
    usedFonts: [],
    selectedUsedFont: null,
    selectedUsedFontId: null,
    dom: {},

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
        var windowTools = '<span id="perfectfont-close" onclick="perfectfont.close()"></span><span id="perfectfont-min" onclick="perfectfont.close()"></span><span id="perfectfont-max" onclick="perfectfont.maximize()"></span>';
        var dockTools = '<span id="perfectfont-dock-right" onclick="perfectfont.dockRight()"></span><span id="perfectfont-dock-top" onclick="perfectfont.dockTop()"></span><span id="perfectfont-dock-left" onclick="perfectfont.dockLeft()"></span>';
        window.innerHTML += '<div id="' + preId + 'header">' + windowTools + title + dockTools + '</div>';

        //body
        this.window.innerHTML += '<ul id="' + preId + 'list"></ul>';
        this.window.innerHTML += '<select id="' + preId + 'available" onchange="perfectfont.updateUsedFont(this)">';
        this.window.innerHTML += '<div id="' + preId + 'detail"><div id="' + preId + 'preference"></div><div id="' + preId + 'value"></div></div>';

                this.initDom();
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

        var preferenceNames = ["Size", "Weight", 'Spacing <span class="perfectfont">(Letter)</span>', 'Spacing <span class="perfectfont">(Word)</span>', "Line Height", "Color"];
        var valueTypes = ["number", "number", "number", "number", "number", "color"];
        var valueIds = ["fontSize", "fontWeight", "letterSpacing", "wordSpacing", "lineHeight", "color"];

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
        detailContainer.innerHTML += '<span class="perfectfont-styletool">B</span><span class="perfectfont-styletool">I</span>';
        detailContainer.innerHTML += '<span class="perfectfont-styletool">U</span><span class="perfectfont-styletool">aA</span><span class="perfectfont-styletool">u</span>'
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
                    lineHeight: this.getStyleProperty(tempItem, "line-height"),
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
        document.getElementById(preId + "lineHeight").value = parseFloat(this.selectedUsedFont.fontDetails.lineHeight);
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

    getGoogleWebFonts: function (serif, sansSerif, handwriting, display, monospace) {
        this.loadGoogleWebFonts(function callback(response) {
            var styles = ["serif", "sans-serif", "handwriting", "display", "monospace"];
            var options = [serif, sansSerif, handwriting, display, monospace];

            var includeFontByStyle = function (headFile, style) {
                var first = true;
                for (var i in response[style]) {
                    if (!first) {
                        headFile.href += "|";
                    }
                    first = false;
                    headFile.href += i.replace(/ /g, "+");
                    if (response[style][i] != "") {
                        headFile.href += ":" + response[style][i];
                    }
                    perfectfont.addAvailableFont(i);
                }
            }

            for (var i = 0; i < options.length; ++i) {
                if (options[i]) {
                    var headFile = document.createElement("link");
                    headFile.rel = "stylesheet";
                    headFile.type = "text/css";
                    headFile.href = "http://fonts.googleapis.com/css?family=";

                    includeFontByStyle(headFile, styles[i]);

                    headFile.href += "&subset=latin,latin-ext,greek-ext,greek,devanagari,cyrillic,cyrillic-ext,vietnamese";
                    document.head.appendChild(headFile);
                }
            }
        });
    },

    loadGoogleWebFonts: function (callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var googleWebFontsJSON = JSON.parse(request.responseText);
                var googleFonts = {
                    "serif": {},
                    "sans-serif": {},
                    "display": {},
                    "handwriting": {},
                    "monospace": {}
                };
                for (var i = 0; i < googleWebFontsJSON.items.length; ++i) {
                    var temp = googleWebFontsJSON.items[i];
                    var variants = temp.variants[0];
                    for (var j = 1; j < temp.variants.length; ++j) {
                        variants += temp.variants[j];
                    }
                    googleFonts[temp.category][temp.family] = variants;
                }
                callback(googleFonts);
            }
        }
        request.open("GET", "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAu2_VZaGnLwopNWh8AWwDX3_aYUacza-Q", true);
        request.send();
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
        resizeHeight: function (newHeight) {
        var newInnerHeight = newHeight - this.dom["header"].offsetHeight;

        this.dom["window"].style.setProperty("height", newHeight + "px");
        this.dom["list"].style.setProperty("height", (newInnerHeight - 2) + "px");
        this.dom["detail"].style.setProperty("height", (newInnerHeight - 2) + "px");
        this.dom["available-container"].style.setProperty("height", (newInnerHeight - 2) + "px");
        this.dom["available"].style.setProperty("height", (newInnerHeight - this.dom["available-container"].childNodes[0].offsetHeight - 2) + "px");
        var fontSizeOffsetHeight = this.dom["fontSize"].offsetHeight;

        this.dom["color"].style.setProperty("height", fontSizeOffsetHeight + "px");
    },

    resizeWidth: function (newWidth) {
        this.dom["window"].style.setProperty("width", newWidth + "px");
    },

    updatePosition: function (x, y) {
        this.dom["window"].style.setProperty("left", x + "px");
        this.dom["window"].style.setProperty("top", y + "px");
    },

    maximize: function () {
        if (this.config.maximized) {
            this.resizeWidth(600);
            this.resizeHeight(400);
            this.updatePosition(lDivX, lDivY);
        } else {
            this.resizeWidth(window.innerWidth);
            this.resizeHeight(window.innerHeight + 1);
            this.updatePosition(0, 0)
        }
        this.config.maximized = !this.config.maximized;
    },

    dock: function (position) {
        var newDocked = false;
        if (this.config.docked == position) {
            this.resizeWidth(600);
            this.resizeHeight(400);
            this.updatePosition(lDivX, lDivY);
            newDocked = false;
        } else {
            newDocked = position;
            switch (position) {
            case "left":
                this.updatePosition(0, 0);
                this.resizeHeight(window.innerHeight);
                this.resizeWidth(600);
                break;
            case "right":
                this.updatePosition(window.innerWidth - 600, 0);
                this.resizeHeight(window.innerHeight);
                this.resizeWidth(600);
                break;
            case "top":
                this.updatePosition(0, 0);
                this.resizeHeight(400);
                this.resizeWidth(window.innerWidth);
                break;
            default:
                this.dock("right");
                break;
            }
        }
        this.config.docked = newDocked;
    },

    dockLeft: function () {
        this.dock("left");
    },

    dockTop: function () {
        this.dock("top");
    },

    dockRight: function () {
        this.dock("right");
    },

    show: function () {
        this.dom["window"].style.setProperty("display", "block");
        if (!this.dom["list"].style.height) {
            this.resizeHeight(this.dom["window"].offsetHeight);
        }
    },

    close: function () {
        this.dom["window"].style.setProperty("display", "none");
    }
}