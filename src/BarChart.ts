import {select} from 'd3';
import BaseChart from "./BaseChart";

export default class BarChart extends BaseChart {


    public build() {
        const scaleX = this.buildAxisBottom();

        const scaleY = this.buildAxisLeft();

        this.svg.selectAll("mybar")
            .data(this._data)
            .enter()
            .append("rect")
            .attr("x", function (d: BarChartData) {
                return scaleX(d.name);
            })
            .attr("y", function (d) {
                return scaleY(0);
            })
            .attr("width", scaleX.bandwidth())
            .attr('height', 0)
            .attr("fill", this.options.fillColor ?? '#72aaff')

        this.svg.selectAll('rect')
            .transition()
            .duration(1000)
            .attr('height', (d: BarChartData) => {
                return this.height - scaleY(d.value);
            })
            .attr('y', function (d: BarChartData) {
                return scaleY(d.value);
            })
            .delay(function (d, i) {
                return i * 10;
            });

        return this;
    }


}

export type BarChartData = {
    name: any,
    value: any,
    meta: any,
}
