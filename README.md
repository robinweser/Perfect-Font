
# Perfect Font #

**Perfect Font** is an **easy-to-use, realtime fast forward in-browser** overlayer window that helps you to find the best fonts / typography for your webpage.

## Usage ##
Get your latest version from [Here](https://github.com/rofrischmann/perfectfont/releases).   
I recommend using Chrome since it supports all input types. Safari/Firefox work too but may not support every feature.   
Then add it within your ``<head></head>``
```html
<script src="perfectfont.min.js"></script>
```   
   
Now open your developer tools and execute this within your console
```javascript
perfectfont.show()
```  
You may add new Fonts by just executing `addAvailableFont` e.g. `perfectfont.addAvailableFont("Arial")`.    
But please take in mind that you need to have the specified font installed.    
    

## Abilities ##
* Easy to **use/install**
* **Initializes** all fonts used within a scope &amp; **lists** them for individual editing
* **Realtime testing** font **details** as easy as with your prefered word processor
* **650+** fonts thanks to **google web fonts**
* **Import local** fonts
* Ability to test only **selected** text
* direkt **CSS snippet**
* **Filter** & **Search** with direct output
* **Dock**, **Maximize**, **Minimize** &amp; **Transparency** Mode
* Dragable Window mode
  
## Browser Support ##
For detailed information on browser issues visit [Browser Issues](https://github.com/rofrischmann/perfectfont/blob/development/BrowserIssues.md);
* Chrome (tested with latest version)
* Safari
* Firefox
     
## Change Log ##
#### Last Changes (1.1.0) ####
* menu buttons to minimize, maximize, close, dock left/top/right and toggle transparency
* added firefox support
     
Visit [Change Log](https://github.com/rofrischmann/perfectfont/blob/development/Changelog.md) for whole change history.   
 
## Coming soon ##
* export the outcome as a CSS-file (with old fonts in comments above)
* google font support 
* test page on github
* form to add custom fonts (drag & drop as well)
* style, decoration, transform testing (bold, italic, uppercase, lowercase, underline, ...)
* support for Internet Explorer


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


## License
Perfect Font is licensed under the MIT license. (http://opensource.org/licenses/MIT)

## Contributing
If you've got something useful just create a pull request or let me know and I'll add it.   
Created by [Robin Frischmann](http://rofrischmann.de).
 
