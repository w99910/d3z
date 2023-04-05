import BaseChart from "./BaseChart";
import {area, line, max} from "d3";

export default class LineChart extends BaseChart {
    protected showPointIndicator = false;

    enablePointIndicator() {
        this.showPointIndicator = true;
        return this;
    }

    build(): this {
        const scaleX = this.buildAxisBottom();

        const scaleY = this.buildAxisLeft();

        const linePath = this.svg.append("path")
            .attr('class', 'line')
            .datum(this._data)
            .attr("fill", "none")
            .attr("stroke", this.options.strokeColor ?? '#72aaff')
            .attr("stroke-width", 1.5)
            .attr("d", line()
                .x(function (d: any) {
                    return scaleX(d.name)
                })
                .y(function (d: any) {
                    return scaleY(d.value)
                }))

        let indicators;

        if (this.showPointIndicator) {
            indicators = this.svg.selectAll("myCircles")
                .data(this._data)
                .enter()
                .append("circle")
                .attr("class", 'point')
                .attr("cx", function (d) {
                    return scaleX(d.name)
                })
                .attr("cy", function (d) {
                    return scaleY(d.value)
                })
                .attr("r", 4)
                .attr("fill", this.options.strokeColor ?? '#72aaff')
                .attr("stroke", "white")
        }

        if (this.options.animation.enabled) {
            const clip = this.svg.append("clipPath")
                .attr("id", "clip");
            const clipRect = clip.append("rect")
                .attr("width", 0)
                .attr("height", this.height)

            linePath.attr('clip-path', 'url(#clip)')
                .attr('stroke-dasharray', function () {
                    return this.getTotalLength();
                })
                .attr('stroke-dashoffset', function () {
                    return this.getTotalLength();
                })
                .transition()
                .duration(this.options.animation.duration)
                .attr('stroke-dashoffset', 0);

            if (indicators) {
                indicators.attr('clip-path', 'url(#clip)')
            }

            clipRect.transition()
                .duration(this.options.animation.duration)
                .attr("width", this.width)
        }


        return this;
    }

}
