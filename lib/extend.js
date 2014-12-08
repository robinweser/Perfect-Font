/* EXTEND OBJECT */
var Extend = {
    //DOM-HANDLER
    //Function to get an element style (computed also)
    getStyleProperty: function (DOMElement, property) {
        return window.getComputedStyle(DOMElement)[property];
    },


    //ELEMENT-SELECTORS
    //Selects elements by a style property
    getElementsByStyleProperty: function (property, value) {
        var allBodyElements = document.body.querySelectorAll("*");
        var selectedElements = [];
        var allBodyElementsLength = allBodyElements.length;
        for (var i = 0; i < allBodyElementsLength; ++i) {
            if (Extend.getStyleProperty(allBodyElements[i], property) == value) {
                selectedElements.push(allBodyElements[i]);
            }
        }
        return selectedElements;
    },
    //Selects elements with inner text
    getElementsWithInnerText: function () {
        var allBodyElements = document.body.querySelectorAll("*");
        var selectedElements = [];
        var allBodyElementsLength = allBodyElements.length;
        for (var i = 0; i < allBodyElementsLength; ++i) {
            if (allBodyElements[i].innerText != "") {
                selectedElements.push(allBodyElements[i]);
            }
        }
        return selectedElements;
    },


    //---VALIDATIONS
    //Validates if a value actually is a number
    isNumeric: function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
}





/* OBJECT ADDITIONS */
//NUMBER
//Validates if a value actually is a number
Number.prototype.isNumeric = function () {
    return !isNaN(parseFloat(this)) && isFinite(this);
};


//STRING
//Validates if a value actually is a number
String.prototype.isNumeric = function () {
    return !isNaN(parseFloat(this)) && isFinite(this);
};


//ARRAY
//Returns a true clone of an array
Array.prototype.clone = function () {
    return JSON.parse(JSON.stringify(this));
}


//OBJECT
//Returns a true clone of an object
Object.prototype.clone = function () {
    return JSON.parse(JSON.stringify(this));
}
//Returns an alphabethic or value-base ascending/descending sorted Object (child objects sorted if recursive)
Object.prototype.sort = function (recursive, direction, caseSensitive, sortByValue) {
    var dir = (direction ? direction : "ASC");
    var me = this;
    var tempArray = [];
    //Sorting function for value-based (sortByValue) sorting
    var sortArrayByValue = function (a, b) {
        var left = me[a];
        var right = me[b];
        if (!caseSensitive) {
            left = (typeof left == "string" ? left.toLowerCase() : left);
            right = (typeof right == "string" ? right.toLowerCase() : right);
        }
        return ((left < right) ? -1 : ((left > right) ? 1 : 0));
    }
    for (var item in this) {
        if (typeof this[item] == "object" && this[item] != null && recursive) {
            //Sorting child objects
            this[item] = this[item].sort(recursive, dir, caseSensitive, sortByValue);
        }
        if (this.hasOwnProperty(item)) {
            if (!caseSensitive) {
                item = (item['toLowerCase'] ? item.toLowerCase() : item);
            }
            tempArray.push(item);
        }
    }
    if (sortByValue) {
        tempArray.sort(sortArrayByValue);
    } else {
        tempArray.sort();
    }
    var tempObject = {};
    if (dir == "DESC") {
        tempArray.reverse();
    }
    //new Object from Array
    for (var i = 0; i < tempArray.length; i++) {
        tempObject[tempArray[i]] = this[tempArray[i]];
    }
    return tempObject;
};