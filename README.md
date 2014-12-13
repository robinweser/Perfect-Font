
# perfectfont #
**Current Version**: 1.1.0 *(Dezember 13 2014)*   
**Author(s)**: Robin Frischmann   
**License**: Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)

**perfectfont** is an **easy-to-use, realtime fast forward in-browser** overlayer window that helps you to find the best fonts / typography for your webpage.

![preview](http://i59.tinypic.com/2mfhzdv.png)

## Abilities ##
* lists all fonts used on a webpage
* realtime testing of different fonts and font details e.g. size, weight, word-spacing, letter-spacing, color
* draggable window with dock, maximize and transparency functionality
    
## Browser Support ##
* Chrome (tested with latest version)
* Safari
* Firefox
     
## [Change Log](https://github.com/rofrischmann/perfectfont/blob/development/Changelog.md) ##
    
## Coming soon ##
* export the outcome as a CSS-file (with old fonts in comments above)
* google font support 
* test page on github
* form to add custom fonts (drag & drop as well)
* style, decoration, transform testing (bold, italic, uppercase, lowercase, underline, ...)
* support for Internet Explorer

## How to use ##
Download the latest version [Here](https://github.com/rofrischmann/perfectfont/releases).   
I recommend using Chrome because it got a nice color picker to go with. 
```html
<script type="text/javascript" src="perfectfont.min.js"></script>
<link type="text/css" href="perfectfont.min.css" rel="stylesheet">
``` 
   
```javascript
var fontWindow = new PerfectFont(config);      //Don't need to pass a config
fontWindow.show()
```

### Configuration ###
```javascript
config = {    
    draggable: true,
    maximized: false,
    docked: false,
    transparent: false
}
```

### Adding new fonts ###
```javascript
fontWindow.addAvailableFont("Arial");
fontWindow.addAvailableFont("Lato");
fontWindow.addAvailableFont("Helvetica");
fontWindow.addAvailableFont("Impact");
```


## Custom Build ##
perfectfont is build with [Grunt](http://gruntjs.com/). Just clone the source and install all dependecies.   
```sh
cd path/to/perfectfont/
sudo npm install
```

Running 
```sh
grunt
```
creates both minified and concated files within inside `path/to/perfectont/bin`.   


## Contact Me ##

Feel free to contact me ([robin@rofrischmann.de](mailto:robin@rofrischmann.de)).
 
