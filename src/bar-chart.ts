import {select, scaleBand, create, InternSet, range, map, scaleLinear, max, axisBottom, axisLeft} from 'd3';
import BaseChart from "./BaseChart";

export default class BarChart extends BaseChart {
    protected _data: Array<BarChartData>;

    constructor(protected container: HTMLElement) {
        super(container);
    }

    public data(data: Array<BarChartData>) {
        this._data = data;
        return this;
    }


    public build() {
        const svg = select(this.container)
            .append("svg")
            .attr("width", this.width + this.options.margin.left + this.options.margin.right)
            .attr("height", this.height + this.options.margin.top + this.options.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.options.margin.left + "," + this.options.margin.top + ")");
        const x = scaleBand()
            .range([0, this.width])
            .domain(this._data.map(function (d: BarChartData) {
                return d.name;
            }))
            .padding(0.2);

        svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .attr('class', 'axis-bottom')
            .call(axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        const y = scaleLinear()
            .domain([0, max(this._data, function (d: BarChartData) {
                return d.value;
            })])
            .range([this.height, 0]);
        svg.append("g")
            .attr('class', 'axis-left')
            .call(axisLeft(y));

        svg.selectAll("mybar")
            .data(this._data)
            .enter()
            .append("rect")
            .attr("x", function (d: BarChartData) {
                return x(d.name);
            })
            .attr("y", function (d) {
                return y(0);
            })
            .attr("width", x.bandwidth())
            .attr('height', 0)
            .attr("fill", "#69b3a2")

        svg.selectAll('rect')
            .transition()
            .duration(1000)
            .attr('height', (d: BarChartData) => {
                return this.height - y(d.value);
            })
            .attr('y', function (d: BarChartData) {
                return y(d.value);
            })
            .delay(function (d, i) {
                return i * 10;
            });

        return this;
    }

    update(data: Array<BarChartData>): this {
        this._data = data;
        select(this.container).select('svg').remove();
        return this.build();
    }
}

export type BarChartData = {
    name: any,
    value: any,
    meta: any,
}
