/**
 * Created by paultaykalo on 10/30/16.
 */
function createEditorManager() {
    $(document).ready(function () {
        editorManager.init()
    });

    let editorManager = {
        editor: null,
        changedByUser: true,

        init() {
            // Add sidr with editor to the page
            $("body").append(`
<div id='sidr'>
<pre id='editor'>
` + editorManager.editorString(window.ignoredClasses, window.colorRegexes) + `
</pre>
</div>`);
            // Initialize ace editor
            editor = ace.edit("editor");
            editorManager.editor = editor
            editor.setTheme("ace/theme/twilight");
            editor.getSession().setMode("ace/mode/javascript");
            editor.$blockScrolling = Infinity;

            // User changed text
            editor.getSession().on('change', function (e) {
                try {
                    if (editorManager.changedByUser) { 
                        text = editor.getSession().getValue()
                        eval(editor.getSession().getValue())
                        changedText()
                    }
                } catch (err) {
                    console.log(err)
                }
            });


            $('#save-preferences').sidr(
                {
                    displace: false,
                    onOpen: function () {
                        editor.resize()
                    }
                }
            );
            $("#chart").css("overflow", "hidden");
        },

        editorString(ignoredClasses, colorRegexes) {
            let str = `// This is editor that listens to every change.
// Data here is saved between sessions.
// Delete or add lines below to update the graph.

// Those are ignored classes:
userSelectedIgnoredClasses = [`
 
            for (var i = 0; i < ignoredClasses.length; i++) {
                str += '\n\"' + ignoredClasses[i] + '\"'
                if (i +1 < ignoredClasses.length) {
                    str += ','
                }
            }
            str += `
]

// Color regexes
// Remove all for default coloring
userSelectedColorRegexes = [`
            for (var i = 0; i < colorRegexes.length; i++) {
                str += '\n\"' + colorRegexes[i] + '\"'
                if (i +1 < colorRegexes.length) {
                    str += ','
                }
            }
            str += `
]
`
            return str
        },

        updateText(ignoredClasses, colorRegexes) {
            editorManager.changedByUser = false
            editorManager.editor.setValue(editorManager.editorString(ignoredClasses, colorRegexes));
            editorManager.changedByUser = true
        }
    }

    return {
        changeEditorClasses(ignoredClasses) {
            editorManager.updateText(ignoredClasses, window.colorRegexes)
        }
    }
}

function createObervableSettings() {
    let settings = {
        stuff: 123
    }
    let subscriptions = []
    
    return {
        subscribe(listener) {
            subscriptions.push(listener)
        },
        setSettings(newSettings) {
            settings = newSettings
            subscriptions.forEach(subscription => {
                if (typeof subscription === 'function') {
                    subscription(newSettings)
                }
            })
        }
    }
}