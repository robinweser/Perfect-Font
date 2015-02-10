var title = "Perfect Font";
var preId = "perfectfont-";


var mouseX, mouseY, lDivX, lDivY;
var move = false;

var domElements = ["window", "header", "list-container", "list", "detail", "toggle-transparency", "selection", "search-container", "available-container", "available", "preference", "value"];
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
            handwriting: true,
            display: true,
            monospace: true
        }
    }
};

var perfectfont = {
    config: undefined,
    selectionUsedFonts: [],
    usedFonts: [],
    selectionAdded: 0,
    selectedUsedFont: null,
    selectedUsedFontId: null,
    dom: {},

    //Initialized perfectfont with a config
    init: function (config) {
        this.config = config;

        if (!this.config) {
            this.config = defaults;
        }
        //perfectFontControlButton.init();
        this.initWindow();
        this.initFonts();
    },

    initWindow: function (callback) {
        var window = document.createElement("div");
        window.id = preId + "window";
        document.body.appendChild(window);
        //header
        var windowTools = '<span id="perfectfont-close" onclick="perfectfont.close()"></span><span id="perfectfont-min" onclick="perfectfont.close()"></span><span id="perfectfont-max" onclick="perfectfont.maximize()"></span>';
        //var dockTools = '<span id="perfectfont-dock-right" onclick="perfectfont.dockRight()"></span><span id="perfectfont-dock-top" onclick="perfectfont.dockTop()"></span><span id="perfectfont-dock-left" onclick="perfectfont.dockLeft()"></span>';

        window.innerHTML += '<div id="' + preId + 'header">' + windowTools + title + /* dockTools */ '</div>';

        //body
        window.innerHTML += '<div id="' + preId + 'list-container"><div id="' + preId + 'toggle-transparency" onclick="perfectfont.toggleTransparency()">Transparency</div><div id="' + preId + 'selection" onmousedown="perfectfont.addSelectionToList()">Add Selection</div><div id="' + preId + 'element" onmousedown="perfectfont.addElementToList()">Add Element</div><ul id="' + preId + 'list"></ul></div>';
        var groups = "";
        fontStyles.forEach(function (item) {
            if (perfectfont.config.fonts.googleWebFonts[item.replace("-s", "S")]) {
                groups += '<span class="perfectfont active" onclick="perfectfont.filterAvailableFonts(this)">' + item + '</span>';
            }
        });
        window.innerHTML += '<div id="' + preId + 'available-container"><div>' + groups + '</div><div id="' + preId + 'search-container"><input id="' + preId + 'search" placeholder="Search ..." type="text" onkeyup="perfectfont.searchAvailableFont(this, this.value)"></div><select id="' + preId + 'available" onchange="perfectfont.updateUsedFont(this)"></div>';
        window.innerHTML += '<div id="' + preId + 'detail"></div>';

        this.initDom();
        this.initDetails();
        this.initWindowTools();
    },

    initDom: function (preference) {
        if (preference) {
            valueIds.forEach(function (item) {
                perfectfont.dom[item] = document.getElementById(preId + item);
            });
        } else {
            domElements.forEach(function (item) {
                perfectfont.dom[item] = document.getElementById(preId + item);
            });
        }
    },

    initWindowTools: function () {
        //TODO: add window tools
        if (this.config.draggable) {
            this.enableDragDrop();
        }
    },

    initDetails: function () {
        var preferenceList = "";
        var valueList = "";
        this.dom["detail"].innerHTML += '<span class="perfectfont-styletool">B</span><span class="perfectfont-styletool">I</span>';
        this.dom["detail"].innerHTML += '<span class="perfectfont-styletool">U</span><span class="perfectfont-styletool">aA</span><span class="perfectfont-styletool">u</span>';
        this.dom["detail"].innerHTML += '<span class="perfectfont-styletool">B</span><span class="perfectfont-styletool">I</span>';
        this.dom["detail"].innerHTML += '<span class="perfectfont-styletool">U</span><span class="perfectfont-styletool">aA</span><span class="perfectfont-styletool">u</span>';

        this.dom["detail"].innerHTML += '<div id="' + preId + 'preference"></div><div id="' + preId + 'value"></div>';
        for (var i = 0; i < preferenceNames.length; ++i) {
            preferenceList += '<li class="perfectfont">' + preferenceNames[i] + '</li>';
            valueList += '<input id="' + preId + valueIds[i] + '" type="' + valueTypes[i] + '" onchange="perfectfont.updateUsedFontDetail(this)"';
            if (valueIds[i] == "fontWeight") {
                valueList += 'min="100" max="900" step="100"';
            }
            valueList += '>';
        }
        this.initDom();
        this.dom["preference"].innerHTML += preferenceList;
        this.dom["value"].innerHTML += valueList;

        this.initDom(true);
    },


    initFonts: function () {
        this.initUsedFonts();
        this.usedFonts.forEach(function (item) {
            perfectfont.addFontToList(item);
        });

        var gwf = this.config.fonts.googleWebFonts;
        this.getGoogleWebFonts(gwf.serif, gwf.sansSerif, gwf.handwriting, gwf.display, gwf.monospace);
    },

    //TODO: REFACTOR
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
                var tempFontString = this.getRenderedFont(tempFontString);
                alreadyCheckedFontStringsUsedFonts.push(tempFontString);
                var tempFontDetails = this.generateFontDetails(tempItem);
                var tempUsedFont = new UsedFont();
                tempUsedFont.init((alreadyCheckedFontStringsUsedFonts.length - 1), tempFontString, tempFontDetails);
                this.usedFonts.push(tempUsedFont);
                this.usedFonts[(alreadyCheckedFontStringsUsedFonts.length - 1)].addDomElement(tempItem);
            }
        }
    },

    generateFontDetails: function (tempItem) {
        var fontDetails = {
            fontWeight: (this.getStyleProperty(tempItem, "font-weight") == "normal" ? 400 : this.getStyleProperty(tempItem, "font-weight")),
            fontSize: this.getStyleProperty(tempItem, "font-size"),
            letterSpacing: (this.getStyleProperty(tempItem, "letter-spacing") == "normal" ? 0 : this.getStyleProperty(tempItem, "font-weight")),
            wordSpacing: this.getStyleProperty(tempItem, "word-spacing"),
            lineHeight: this.getStyleProperty(tempItem, "line-height"),
            color: this.getStyleProperty(tempItem, "color"),
            fontStyle: this.getStyleProperty(tempItem, "font-style"),
            fontVariant: this.getStyleProperty(tempItem, "font-variant")
        }
        return fontDetails;
    },

    enableDragDrop: function () {
        lDivX = parseInt(perfectfont.getStyleProperty(perfectfont.dom["window"], "left"));
        lDivY = parseInt(perfectfont.getStyleProperty(perfectfont.dom["window"], "top"));

        this.dom["header"].onmousedown = function (e) {
            move = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (perfectfont.config.docked || perfectfont.config.maximized) {
                move = false;
            }
        }

        document.body.onmouseup = function (e) {
            move = false;
            perfectfont.dom["window"].style.opacity = ((perfectfont.config.transparent) ? 0.7 : 1.0);
        }

        document.body.onmousemove = function (e) {
            if (move) {
                perfectfont.dom["window"].style.opacity = "0.7";
                lDivX += e.clientX - mouseX;
                lDivY += e.clientY - mouseY;
                mouseX = e.clientX;
                mouseY = e.clientY;
                perfectfont.updatePosition(lDivX, lDivY);
            }
        }
    },

    addAvailableFont: function (font, style) {
        var newAvailableFont = '<option  class="perfectfont ' + (style ? style : '') + '" style="font-family:' + font + ' !important">' + font + '</option>';
        this.dom["available"].innerHTML += newAvailableFont;
        this.dom["available"].size += 1;
    },

    addFontToList: function (usedFont, selection) {
        var newUsedFont;
        if (selection) {
            newUsedFont = '<li id="' + preId + usedFont.id + '" onclick="perfectfont.showUsedFontPreferences(this, true)"><p class="perfectfont" style="font-family:' + usedFont.fontName + '">#' + usedFont.id + '</p><span class="perfectfont">' + usedFont.originFontName + '</span></li>'
        } else {
            newUsedFont = '<li id="' + preId + usedFont.id + '" onclick="perfectfont.showUsedFontPreferences(this)"><p class="perfectfont" style="font-family:' + usedFont.fontName + '">' + usedFont.fontName + '</p><span class="perfectfont">' + usedFont.originFontName + '</span></li>'
        }
        this.dom["list"].innerHTML += newUsedFont;
        this.dom["list"].childNodes[this.dom["list"].childNodes.length - 1].click();
        this.dom["list"].scrollTop = this.dom["list"].childNodes[this.dom["list"].childNodes.length - 1].offsetTop - this.dom["list"].offsetHeight - 14;
    },

    addSelectionToList: function () {
        var selection = window.getSelection();

        if (selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            var content = range.extractContents();
            var tempItem = document.createElement('span');

            tempItem.id = "selection" + (this.selectionUsedFonts.length);
            tempItem.appendChild(content);
            var htmlContent = tempItem.innerHTML;
            range.insertNode(tempItem);
            var tempFontDetails = this.generateFontDetails(tempItem);
            var selectionUsedFont = new UsedFont();
            var renderedFont = perfectfont.getRenderedFont(this.getStyleProperty(tempItem, "font-family"));
            selectionUsedFont.init(tempItem.id, renderedFont, tempFontDetails);
            selectionUsedFont.addDomElement(tempItem);
            this.selectionUsedFonts.push(selectionUsedFont);
            this.addFontToList(selectionUsedFont, true);
        } else {
            alert("You need to select something in order to add it to the list");
        }
    },

    setSelectedUsedFont: function (clickedElement, selection) {
        this.selectedUsedFontId = clickedElement.id.replace(preId, "");
        if (selection) {
            this.selectedUsedFont = this.selectionUsedFonts[this.selectedUsedFontId.replace("selection", "")];
        } else {
            this.selectedUsedFont = this.usedFonts[this.selectedUsedFontId];
        }

        if (document.getElementsByClassName(preId + "selected").length > 0) {
            document.getElementsByClassName(preId + "selected")[0].classList.remove(preId + "selected");
        }
        clickedElement.classList.add("perfectfont-selected");

    },
    showUsedFontPreferences: function (clickedElement, selection) {
        this.setSelectedUsedFont(clickedElement, selection);
        if (this.selectedUsedFont.fontDetails.fontWeight == "normal") {
            this.selectedUsedFont.fontDetails.fontWeight = 400;
        }

        valueIds.forEach(function (item) {
            perfectfont.dom[item].value = parseFloat(perfectfont.selectedUsedFont.fontDetails[item]);
        });
    },

    filterAvailableFonts: function (clickedElement) {
        var display;
        if (clickedElement.classList.contains("active")) {
            clickedElement.classList.remove("active");
            display = "none";
        } else {
            clickedElement.classList.add("active");
            display = "block";
        };
        var filterDomElements = this.dom["available"].getElementsByClassName(clickedElement.innerHTML);
        for (var i = 0; i < filterDomElements.length; ++i) {
            filterDomElements[i].style.setProperty("display", display);
        }
    },

    searchAvailableFont: function (elem, font) {
        debugger;
        var filterDomElements = this.dom["available"].childNodes;
        for (var i = 0; i < filterDomElements.length; ++i) {
            if (filterDomElements[i].innerHTML.toLowerCase().indexOf(font.toLowerCase()) != -1) {
                filterDomElements[i].style.setProperty("display", "block");
            } else {
                filterDomElements[i].style.setProperty("display", "none");
            }
        }
    },

    toggleTransparency: function () {
        if (this.config.transparent) {
            this.dom["window"].style.setProperty("opacity", 1.0);
        } else {
            this.dom["window"].style.setProperty("opacity", 0.4);
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
                    perfectfont.addAvailableFont(i, style);
                }
            }
            var fontOptions = [serif, sansSerif, handwriting, display, monospace];

            for (var i = 0; i < fontOptions.length; ++i) {
                if (fontOptions[i]) {
                    var headFile = document.createElement("link");
                    headFile.rel = "stylesheet";
                    headFile.type = "text/css";
                    headFile.href = "http://fonts.googleapis.com/css?family=";

                    includeFontByStyle(headFile, fontStyles[i]);

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
                    var variants = "";
                    for (var j = 0; j < temp.variants.length; ++j) {
                        if (temp.variants[j] == "italic") {
                            temp.variants[j] = "400italic";
                        }
                        variants += temp.variants[j].replace("regular", "400") + ",";
                    }
                    googleFonts[temp.category][temp.family] = variants.substr(0, variants.length - 1);
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

    getRenderedFont: function (fontString) {
        var tempSplitFontString = fontString.split(",");
        for (var j in tempSplitFontString) {
            if (this.isAvailableFont(tempSplitFontString[j])) {
                fontString = tempSplitFontString[j].replace(/'/g, "");
                break;
            }
        }
        return fontString.replace(/'/g, "");
    },

    updateUsedFont: function (clickedElement) {
        this.selectedUsedFont.updateFontName(clickedElement.value);
        debugger;
        if (document.getElementsByClassName(preId + "selected")[0].id.indexOf("selection") == -1) {
            document.getElementsByClassName(preId + "selected")[0].childNodes[0].innerHTML = clickedElement.value;
        }
        document.getElementsByClassName(preId + "selected")[0].childNodes[0].style.setProperty("font-family", clickedElement.value);
    },
    updateUsedFontDetail: function (clickedElement) {
        this.selectedUsedFont.updateFontDetails(clickedElement.id.replace(preId, ""), clickedElement.value);
    },

    resizeHeight: function (newHeight) {
        var newInnerHeight = newHeight - this.dom["header"].offsetHeight;
        var availableInnerHeight = (newInnerHeight - this.dom["available-container"].childNodes[0].offsetHeight - this.dom["search-container"].offsetHeight);
        var listInnerHeight = (newInnerHeight - (2 * this.dom["selection"].offsetHeight) - this.dom["toggle-transparency"].offsetHeight);
        this.dom["window"].style.setProperty("height", newHeight + "px");
        this.dom["list-container"].style.setProperty("height", (listInnerHeight) + "px");
        this.dom["detail"].style.setProperty("height", (newInnerHeight) + "px");
        this.dom["available-container"].style.setProperty("height", (newInnerHeight) + "px");
        this.dom["available"].style.setProperty("height", (availableInnerHeight) + "px");
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