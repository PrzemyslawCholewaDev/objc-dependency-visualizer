//  ===================================================
//  ===============  SELECTING_NODE       =============
//  ===================================================

let graph_actions = {
    create: function (svg, dvgraph) {

        return {
            selectedIdx: -1,
            selectedType: "normal",
            svg: svg,
            selectedObject: {},
            dvgraph: dvgraph,
            currentCycle: -1,
            isSelectedCycle: false,

            deselect_node: function (node) {
                if (node != null) {
                    this._unlockNode(node);
                }
                this.selectedIdx = -1;
                this.selectedObject = {};

                this.svg.selectAll('.node, .structNode')
                    .each(function (node) {
                        node.filtered = false
                    })
                    .classed('filtered', false)
                    .transition();

                this.svg.selectAll('path, text')
                    .classed('filtered', false)
                    .transition();

                this.svg.selectAll('.link')
                    .attr("marker-end", "url(#default)")
                    .classed('filtered', false)
                    .classed('dependency', false)
                    .classed('dependants', false)
                    .transition();
            },

            deselect_selected_node: function () {
                this.deselect_node(this.selectedObject)
            },

            _lockNode: function (node) {
                node.fixed = true;
                node.fx = node.x;
                node.fy = node.y;
            },

            _unlockNode: function (node) {
                delete node.fixed;
                node.fx = null;
                node.fy = null;
            },

            _selectAndLockNode: function (node, type) {
                this._unlockNode(this.selectedObject);
                this.selectedIdx = node.idx;
                this.selectedObject = node;
                this.selectedType = type;
                this._lockNode(this.selectedObject);
            },

            _deselectNodeIfNeeded: function (node, type) {
                if (node.idx === this.selectedIdx && this.selectedType === type) {
                    this.deselect_node(node);
                    return true;
                }
                return false;
            },

            _fadeOutAllNodesAndLinks: function (fadeNodes) {
                // Fade out all circles
                if (fadeNodes) {
                    this.svg.selectAll('.node, .structNode')
                        .classed('filtered', true)
                        .each(function (node) {
                            node.filtered = true;
                            node.neighbours = false;
                        }).transition();
                }

                this.svg.selectAll('text')
                    .classed('filtered', true)
                    .transition();

                this.svg.selectAll('.link')
                    .classed('dependency', false)
                    .classed('dependants', false)
                    .attr("marker-end", "")
                    .transition();


            },

            _highlightNodesWithIndexes: function (indexesArray) {
                this.svg.selectAll('.node, .structNode, text')
                    .filter((node) => indexesArray.indexOf(node.index) > -1)
                    .classed('filtered', false)
                    .each((node) => {
                        node.filtered = false;
                        node.neighbours = true;
                    })
                    .transition();
            },

            _isDependencyLink: (node, link) =>  (link.source.index === node.index),
            _nodeExistsInLink: (node, link) => (link.source.index === node.index || link.target.index === node.index),
            _oppositeNodeOfLink: (node, link) => (link.source.index === node.index ? link.target : link.target.index === node.index ? link.source : null),

            _highlightLinksFromRootWithNodesIndexes: function (root, nodeNeighbors, maxLevel) {
                this.svg.selectAll('.link')
                    .filter((link) => nodeNeighbors.indexOf(link.source.index) > -1)
                    .classed('filtered', false)
                    .classed('dependency', (l) => this._nodeExistsInLink(root,l) && this._isDependencyLink(root, l))
                    .classed('dependants', (l) => this._nodeExistsInLink(root,l) && !this._isDependencyLink(root, l))
                    .attr("marker-end", (l) => this._nodeExistsInLink(root,l) ? (this._isDependencyLink(root, l) ? "url(#dependency)" : "url(#dependants)") : (maxLevel == 1 ? "url(#default)" : ""))
                    .transition();
            },

            selectNodesStartingFromNode: function (node, maxLevel = 100) {
                if (this._deselectNodeIfNeeded(node, "level" + maxLevel)) {
                    return
                }
                this._selectAndLockNode(node, "level" + maxLevel);

                let neighborIndexes =
                    this.dvgraph.nodesStartingFromNode(node, {max_level: maxLevel, use_backward_search: maxLevel == 1})
                        .map((n) => n.index);

                this._fadeOutAllNodesAndLinks(true);
                this._highlightNodesWithIndexes(neighborIndexes);
                this._highlightLinksFromRootWithNodesIndexes(node, neighborIndexes, maxLevel);
	
            },

            showCycle: function(currentIndexModifier) {
                isSelectedCycle = true
                const cycles = this.cyclesInGraph()
                this.currentCycle = (this.currentCycle + currentIndexModifier + cycles.length) % cycles.length

                this._fadeOutAllNodesAndLinks(true);

                let neighborIndexes = cycles[this.currentCycle]
                this._highlightNodesWithIndexes(neighborIndexes);

                this.svg.selectAll('.link')
                    .filter((link) => neighborIndexes.includes(link.source.idx) && neighborIndexes.includes(link.target.idx))
                    .classed('filtered', false)
                    .classed('dependency', true)
                    .attr("marker-end",  "url(#dependency)")
                    .transition();
            },

            deselectCycle: function() {
                if (isSelectedCycle) {
                    this.deselect_node()
                    isSelectedCycle = false
                } else {
                    this.showCycle(0)
                }
            },

            cyclesInGraph: function() {
                // Create simple readable graph model
                let allNodes = Object.keys(this.dvgraph.nodesSet)
                    .map((n) => this.dvgraph.nodesSet[n].index);
                let links = this.svg.selectAll('.link')
                let graph = {}
                for (var node in allNodes) {
                    var destinations = []
                    links
                        .filter((link) => link.source.idx == node)
                        .each(function(link){
                            destinations.push(link.target.idx)
                        });
                    graph[node] = destinations
                }

                // Get all cycles
                var unfilteredCycles = this.getCycles(graph);

                // Filter duplicates
                var filteredCycles = []
                for (unfilteredCycle of unfilteredCycles) {
                    unfilteredCycle.sort()
                    if ( !filteredCycles.some(cycle => JSON.stringify(cycle) == JSON.stringify(unfilteredCycle)) ) { //!filteredCycles.includes(unfilteredCycle)) {
                        filteredCycles.push(unfilteredCycle)
                    }
                }
                filteredCycles.sort()
                return filteredCycles
            },

            getCycles: function(graph) {
                var cycles = []
                // Copy the graph, converting all node references to String
                graph = Object.assign(...Object.keys(graph).map( node =>
                    ({ [node]: graph[node].map(String) }) 
                ));
            
                let queue = Object.keys(graph).map( node => [node] );
                while (queue.length) {
                    const batch = [];
                    for (const path of queue) {
                        const children = graph[path[0]] || [];
                        for (const node of children) {
                            if (node === path[path.length-1]) {
                                cycles.push([...path]
                                    .map((x) => parseInt(x)));
                                continue
                            }
                            if (path.includes(node)) {
                                continue
                            }
                            batch.push([node, ...path]);
                        }
                    }
                    queue = batch;
                }
                return cycles
            }
        };
    }
};

