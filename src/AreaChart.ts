import BaseChart from "./BaseChart";
import {area, line} from "d3";

export default class AreaChart extends BaseChart {
    build(): this {
        const scaleX = this.buildAxisBottom();

        const scaleY = this.buildAxisLeft();

        const clip = this.svg.append("clipPath")
            .attr("id", "clip");
        const clipRect = clip.append("rect")
            .attr("width", 0)
            .attr("height", this.height)

        let areaPath = this.svg.append("path")
            .attr('class', 'area')
            .datum(this._data)
            .attr("fill", this.options.fillColor ?? '#72aaff')
            .attr('clip-path', 'url(#clip)')
            .attr('d', area().x(function (d) {
                return scaleX(d.name)
            })
                .y0(scaleY(0))
                .y1(function (d) {
                    return scaleY(d.value)
                }))

        let linePath = this.svg.append("path")
            .datum(this._data)
            .attr("fill", "none")
            .attr("stroke", this.options.strokeColor ?? '#8d8d8d')
            .attr("stroke-width", 1.5)
            .attr('clip-path', 'url(#clip)')
            .attr("d", line()
                .x(function (d) {
                    return scaleX(d.name)
                })
                .y(function (d) {
                    return scaleY(d.value)
                }))

        if (this.options.animation.enabled) {
            clipRect.transition()
                .duration(this.options.animation.duration)
                .attr("width", this.width)
        }
        return this;
    }

}
