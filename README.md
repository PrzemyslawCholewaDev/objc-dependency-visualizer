Objective-C And Swift Dependencies Visualizer
==========================  
[![Build Status](https://travis-ci.org/PaulTaykalo/objc-dependency-visualizer.svg)](https://travis-ci.org/PaulTaykalo/objc-dependency-visualizer)  

This is the tool, that can use Derived Data files to generate dependency graph. It visualizes structs and classes in your iOS project, and shows which ones are dependent on which ones in form of a graph. Images can show how big your project is, how many classes it have, and how they linked to each other. Generally speaking, the more divided your classes the better. 
All visualisations was done by [d3js](http://d3js.org/) library, which is just awesome!  
![Demo](demo.gif)

### Easiest way - For those who don't like to read docs
This will clone project, and run it on the latest modified project
```
git clone git@github.com:PrzemyslawCholewaDev/swift-dependency-visualizer.git ;
cd objc-dependency-visualizer ;
./generate-objc-dependencies-to-json.rb -w > origin.js ;
open index.html
```

### If there is too much cluster and you can't see anything, try this
With big projects you might find there are just too much stuff. You can remove each node individually within the app, but you can also try the following:
```
git clone git@github.com:PrzemyslawCholewaDev/swift-dependency-visualizer.git ;
cd objc-dependency-visualizer ;
./generate-objc-dependencies-to-json.rb -w -s "" --ignore_leafes --ignore_models > origin.js ;
open index.html
```

### More specific examples
Examples are [here](https://github.com/PaulTaykalo/objc-dependency-visualizer/wiki/Usage-examples)

### Tell the world about the awesomeness of your project structure
Share image to the Twitter with [#objcdependencyvisualizer](https://twitter.com/search/realtime?q=%23objcdependencyvisualizer) hashtag


### Somewhat almost full documentation:"

## Getting dependencies

```
./generate-objc-dependencies-to-json.rb has follwing flags:

-p"<Project name>", Gets a project with a specific name

-t"<Target name>, Gets a project with a specific target

-e"<Prefix>", Ignores classes with specific prefix

-w, The project is written in swift

-i, Include cocoapods classes in visualization

--ignore-leafes, Ignore nodes that dont have any children

--ignore-models, Ignore nodes that have only one capital letters
```

## Visualizing

Open index.html in Google Chrome, it will work faster. There are following features:
- Right of a bat, if some nodes aren't connected to any other, it means it can be safely deleted.
- You can adjust layout with sliders and show nodes names
- When you click on a node, it will focus on it.
- Using arrows you can see all dependency cycles in a project
- When you have a node selected, you can delete it by clicking button in bottom-right corner
- All deleted nodes are stored in browser. You can edit them by clicking "Edit properties" button. Everything you type there will be automatically compiled and applied.
- You can change coloring of the nodes by providing your own regexes in the "Edit properties" website
