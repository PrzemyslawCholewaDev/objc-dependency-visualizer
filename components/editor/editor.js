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
` + editorManager.editorString(window.ignoredClasses) + `
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

        editorString(ignoredClasses) {
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

// Color regexes:
// Magical
// ^NS
// ^UI
`
            return str
        },

        updateText(ignoredClasses) {
            editorManager.changedByUser = false
            editorManager.editor.setValue(editorManager.editorString(ignoredClasses));
            editorManager.changedByUser = true
        }
    }

    return {
        changeEditorClasses(ignoredClasses) {
            editorManager.updateText(ignoredClasses)
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