import {
    forceManyBody,
    forceLink,
    forceSimulation,
    forceCenter,
    drag,
} from "d3";


import BaseChart from "./BaseChart";

export default class NetworkGraphChart extends BaseChart {

    protected _data: Array<any> | NetworkGraphChartData;


    public data(data: Array<any> | NetworkGraphChartData) {
        this._data = data;
        return this;
    }

    build() {
        let data = {
            nodes: [],
            links: []
        }
        if (Array.isArray(this._data)) {
            // generate ids and links
            let nodes = [];
            let links = [];

            const addNode = (nodeId) => {
                let index = nodes.filter((node) => node.id === nodeId);
                if (index.length === 0) {
                    nodes.push({
                        id: nodeId,
                    });
                }
            }

            for (let i = 0; i < this._data.length; i++) {
                // entry should be [from,to]
                if (Array.isArray(this._data[i]) && this._data[i].length === 2) {
                    let from = this._data[i][0];
                    let to = this._data[i][1];
                    addNode(from);
                    addNode(to);
                    links.push({source: from, target: to});
                }
            }
        } else {
            if (this._data.nodes) {
                data.nodes = this._data.nodes;
            }
            if (this._data.links) {
                data.links = this._data.links;
            }
        }

        const simulation = forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
            .force("link", forceLink()  // This force provides links between nodes
                .id(function (d) {
                    // @ts-ignore
                    return d.id;
                })
                .links(data.links)
            )
            .force("charge", forceManyBody().distanceMax(100).strength(-100))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", forceCenter(this.width / 2, this.height / 2))     // This force attracts nodes to the center of the svg area
            .on("tick", ticked);

        // Create a circle for each data point
        const link = this.svg
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .style("stroke", "#aaa");

        // Initialize the nodes
        const node = this.svg
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("r", 8)
            .style("fill", this.options.fillColor ?? '#72aaff')
            .call(onDrag(simulation))

        // Let's list the force we wanna apply on the network


        let that = this;

        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            // if (that._debug) {
            //     stats.begin();
            // }
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
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
            // if (that._debug) {
            //     stats.end();
            // }
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

        return this;
    }
}

export type NetworkGraphChartData = {
    nodes: Array<NetworkGraphNode>,
    links: Array<NetworkGraphLink>
}

export type NetworkGraphNode = {
    id: number,
    name?: string,
}

export type NetworkGraphLink = {
    source: number,
    target: number,
}
