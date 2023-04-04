import {
    forceManyBody,
    select,
    map,
    forceLink,
    forceSimulation,
    forceCenter,
    create,
    drag,
    schemeTableau10,
    forceX, forceY, max
} from "d3";

import Stats from 'stats.js'

export default class Networkgraph {

    protected _data: Array<any>;

    protected _margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
    }

    protected _debug = false;

    constructor(protected container: HTMLElement) {

    }

    enableDebug() {
        this._debug = true;
        return this;
    }

    public data(data) {
        this._data = data;
        return this;
    }

    public margin(top, right, bottom, left) {
        this._margin = {
            top: top,
            right: right,
            bottom: bottom,
            left: left,
        }
        return this;
    }

    build() {
        let data = {
            nodes: [],
            links: [],
        };

        let linkableNodes = [];
        let maxLinks = 1000;

        for (let i = 0; i < maxLinks; i++) {


            let source = Math.floor(Math.random() * maxLinks);
            let target = Math.floor(Math.random() * maxLinks);

            if (linkableNodes.indexOf(source) === -1) {
                data.nodes.push({
                    id: source,
                    name: Math.random()
                });
                linkableNodes.push(source);
            }

            if (linkableNodes.indexOf(target) === -1) {
                data.nodes.push({
                    id: target,
                    name: Math.random()
                });
                linkableNodes.push(target);
            }

            data.links.push({
                source: source,
                target: target,
            })
        }

        const width = this.container.getBoundingClientRect().width - this._margin.left - this._margin.right;
        const height = this.container.getBoundingClientRect().height - this._margin.top - this._margin.bottom;


        // Create the SVG element to hold the scatterplot
        const svg = select(this.container)
            .append("svg")
            .attr("width", width + this._margin.left + this._margin.right)
            .attr("height", height + this._margin.top + this._margin.bottom)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .append("g")
            .attr("transform",
                "translate(" + this._margin.left + "," + this._margin.top + ")");

        var simulation = forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
            .force("link", forceLink()  // This force provides links between nodes
                .id(function (d) {
                    // @ts-ignore
                    return d.id;
                })                     // This provide  the id of a node
                .links(data.links)     // and this the list of links
            )
            .force("charge", forceManyBody().distanceMax(100).strength(-100))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", forceCenter())     // This force attracts nodes to the center of the svg area
            .on("tick", ticked);

        // Create a circle for each data point
        var link = svg
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .style("stroke", "#aaa")

        // Initialize the nodes
        var node = svg
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("r", 8)
            .style("fill", "#69b3a2")
            .call(onDrag(simulation))

        // Let's list the force we wanna apply on the network
        let stats;
        if (this._debug) {
            stats = new Stats()
            stats.showPanel(0)
            document.querySelector('body').appendChild(stats.dom)
        }

        let that = this;

        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            if (that._debug) {
                stats.begin();
            }
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node
                .attr("cx", function (d) {
                    return d.x + 6;
                })
                .attr("cy", function (d) {
                    return d.y - 6;
                });
            if (that._debug) {
                stats.end();
            }
        }

        function onDrag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }
    }

}
