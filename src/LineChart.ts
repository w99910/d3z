import BaseChart from "./BaseChart";
import {area, line, max} from "d3";

export default class LineChart extends BaseChart {
    build(): this {
        const scaleX = this.buildAxisBottom();

        const scaleY = this.buildAxisLeft()

        const path = this.svg.append("path")
            .attr('class', 'line')
            .datum(this._data)
            .attr("fill", "none")
            .attr("stroke", this.options.strokeColor ?? '#72aaff')
            .attr("stroke-width", 1.5)
            .attr("d", line()
                .x(function (d) {
                    return scaleX(d.name)
                })
                .y(function (d) {
                    return scaleY(d.value)
                }))

        if (this.options.animation.enabled) {
            path.attr('stroke-dasharray', function () {
                return this.getTotalLength();
            })
                .attr('stroke-dashoffset', function () {
                    return this.getTotalLength();
                })
                .transition()
                .duration(this.options.animation.duration)
                .attr('stroke-dashoffset', 0);
        }


        return this;
    }

}
