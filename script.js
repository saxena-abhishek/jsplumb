$(document).ready(function () {
    let index = 0;
    const box = $("#toolbox");
    nodenames = [
        { id: 'nginx', name: 'Nginx', icon: 'fa-file' },
        { id: 'wordpress', name: 'Wordpress', icon: 'fa-wordpress' },
        { id: 'static', name: 'StaticServer', icon: 'fa-server' },
        { id: 'mysql', name: 'MySQL', icon: 'fa-database' },
    ]

    for (i = 0; i < nodenames.length; i++) {
        var control = document.createElement("div");
        var icon = document.createElement("i");
        iconclass = nodenames[i].icon;
        icon.classList.add("fa", iconclass);
        control.append(icon);
        var text = document.createElement("span");
        text.innerHTML = nodenames[i].name;
        control.append(text);
        control.classList.add('control');
        control.id = nodenames[i].id;
        box.append(control);
    }

    instance = jsPlumb.getInstance({});

    instance.setContainer("diagram");

    instance.bind("ready", function () {
        instance.registerConnectionTypes({
            "red-connection": {
                paintStyle: { stroke: "red", strokeWidth: 4 },
                hoverPaintStyle: { stroke: "red", strokeWidth: 8 },
                connector: "Flowchart"
            }
        });

        instance.bind("contextmenu", function (component, event) {
            if (component.hasClass("jtk-connector")) {
                event.preventDefault();
                window.selectedConnection = component;
                $("<div class='custom-menu'><button class='delete-connection'>Delete connection</button></div>")
                    .appendTo("body")
                    .css({ top: event.pageY + "px", left: event.pageX + "px" });
            }
        });

        $("body").on("click", ".delete-connection", function (event) {
            instance.deleteConnection(window.selectedConnection);
        });

        $(document).bind("click", function (event) {
            $("div.custom-menu").remove();
        });

        $("body").on("contextmenu", "#diagram .control", function (event) {
            event.preventDefault();
            window.selectedControl = $(this).attr("id");
            $("<div class='custom-menu'><button class='delete-control'>Delete control</button></div>")
                .appendTo("body")
                .css({ top: event.pageY + "px", left: event.pageX + "px" });
        });

        $("body").on("click", ".delete-control", function (event) {
            instance.remove(window.selectedControl);
        });

        $("#toolbox .control").draggable({
            helper: "clone",
            containment: "body",
            appendTo: "#diagram"
        });

        $("#diagram").droppable({
            drop: function (event, ui) {
                var id = `${ui.draggable[0].id}_${index}`;
                var clone = $(ui.helper).clone(true);
                index++;
                clone.attr("id", id);
                clone.appendTo(this);
                instance.draggable(id, { containment: true });
                instance.addEndpoint(id, {
                    endpoint: "Dot",
                    anchor: ["RightMiddle"],
                    isSource: true,
                    connectionType: "red-connection",
                    maxConnections: -1,
                });

                instance.addEndpoint(id, {
                    endpoint: "Dot",
                    anchor: ["LeftMiddle"],
                    isTarget: true,
                    connectionType: "red-connection",
                    maxConnections: -1,
                });
            }
        })
    });
});


function saveNodeJson() {
    const controls = $("#diagram > .control");
    var nodes = $("#diagram > .control").map(function () {
        return {
            id: this.id,
        }
    }).get();

    var connections = [];
    const connection = $.each(instance.getConnections(), function (id, connection) {
        connections.push({
            SourceId: connection.sourceId,
            TargetId: connection.targetId
        })
    })

    const json = JSON.stringify({ nodes, connections });
    console.log(json);
}