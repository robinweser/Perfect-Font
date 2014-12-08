/*
JFont Checker
Version 1.1
Author: Derek Leung
2010.8.23
Use this API to check font if it is installed in client's machine.
This API only uses CSS and JavaScript to determine if the font is installed.
100% work.

You can use this in:
Yes: Firefox, Chrome, Internet Explorer (6 & above), all popular browsers
No: browsers without JavaScript or/and CSS.

Syntax:
checkfont(string:font name);

Installation:
Place this file to where you want to be and place this script between <head>;
<SCRIPT language=JavaScript charset="utf-8" src="font-checker.js"></SCRIPT>

Usage:
This function will return either Boolean true or false.
If there's an error, it'll return string "ERROR".

Example:
<button onclick="alert(checkfont('Arial'));">Click</button>
if the Arial font is installed, then it'll reutrn "true".

Updates:
 - Now OK in IE!
 - Delete the temporary elements (span) after testing.
*/
var fontchecker_a;
var fontchecker_b;

function create_span() {
    fontchecker_a = document.createElement('span');
    (document.body).appendChild(fontchecker_a);
    fontchecker_a.style.fontFamily = "Arial,monospace";
    fontchecker_a.style.margin = "0px";
    fontchecker_a.style.padding = "0px";
    fontchecker_a.style.fontSize = "32px";
    fontchecker_a.style.position = "absolute";
    fontchecker_a.style.top = "-999px";
    fontchecker_a.style.left = "-999px";
    fontchecker_a.innerHTML = "Font Checker SPAN-A";
    fontchecker_b = document.createElement('span');
    (document.body).appendChild(fontchecker_b);
    fontchecker_b.style.fontFamily = "Arial,monospace";
    fontchecker_b.style.margin = "0px";
    fontchecker_b.style.padding = "0px";
    fontchecker_b.style.fontSize = "32px";
    fontchecker_b.style.position = "absolute";
    fontchecker_b.style.top = "-999px";
    fontchecker_b.style.left = "-999px";
    fontchecker_b.innerHTML = "Font Checker SPAN-B";
}

function checkfont(font) {
    create_span();
    var txt = "ERROR",
        reg = /[\,\.\/\;\'\[\]\`\<\>\\\?\:\"\{\}\|\~\!\@\#\$\%\^\&\*\(\)\-\=\_\+ ]/g;
    font = font.replace(reg, "");
    fontchecker_a.style.fontFamily = font + ",monospace";
    fontchecker_b.style.fontFamily = "monospace";
    fontchecker_a.innerHTML = "random_words_#_!@#$^&*()_+mdvejreu_RANDOM_WORDS";
    fontchecker_b.innerHTML = fontchecker_a.innerHTML;
    if (parseInt(fontchecker_a.offsetWidth, 10) == parseInt(fontchecker_b.offsetWidth, 10) && Number(fontchecker_a.offsetHeight) == Number(fontchecker_b.offsetHeight)) {
        fontchecker_a.style.fontFamily = font + ",Arial";
        fontchecker_b.style.fontFamily = "Arial";
        if (Number(fontchecker_a.offsetWidth) == Number(fontchecker_b.offsetWidth) && Number(fontchecker_a.offsetHeight) == Number(fontchecker_b.offsetHeight)) {
            txt = false;
        } else {
            txt = true;
        }
    } else {
        txt = true;
    }
    //DELETE TESTING ELEMENTS
    fontchecker_a.innerHTML = "";
    fontchecker_a.outerHTML = "";
    fontchecker_b.innerHTML = "";
    fontchecker_b.outerHTML = "";

    return txt
}