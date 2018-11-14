Objective-C And Swift Dependencies Visualizer
==========================  
[![Build Status](https://travis-ci.org/PaulTaykalo/objc-dependency-visualizer.svg)](https://travis-ci.org/PaulTaykalo/objc-dependency-visualizer)  

This is the tool, that can use .o(object) files to generate dependency graph.  
All visualisations was done by [d3js](http://d3js.org/) library, which is just awesome!  
This tool visualizes structs and classes in your iOS project, and shows which ones are dependent on which ones in form of a graph. Images can show how big your project is, how many classes it have, and how they linked to each other. Generally speaking, the more divided your classes the better. 

![Demo](demo.gif)

### Easiest way - For those who don't like to read docs
This will clone project, and run it on the latest modified project
```
git clone https://github.com/PaulTaykalo/objc-dependency-visualizer.git ;
cd objc-dependency-visualizer ;
./generate-objc-dependencies-to-json.rb -w > origin.js ;
open index.html
```

### If there is too much cluster and you can't see anything, try this
```
git clone https://github.com/PaulTaykalo/objc-dependency-visualizer.git ;
cd objc-dependency-visualizer ;
./generate-objc-dependencies-to-json.rb -w -s "" --ignore_leafes --ignore_models > origin.js ;
open index.html
```

### More specific examples
Examples are [here](https://github.com/PaulTaykalo/objc-dependency-visualizer/wiki/Usage-examples)

### Tell the world about the awesomeness of your project structure
Share image to the Twitter with [#objcdependencyvisualizer](https://twitter.com/search/realtime?q=%23objcdependencyvisualizer) hashtag


### Hard way - or "I want to read what I'm doing!"

Here's [detailed description](https://github.com/PaulTaykalo/objc-dependency-visualizer/wiki) of what's going on under the hood
