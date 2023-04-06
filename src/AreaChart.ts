import BaseChart from "./BaseChart";
import {area, line} from "d3";

export default class AreaChart extends BaseChart {
    build(): this {
        const scaleX = this.buildAxisBottom();

        const scaleY = this.buildAxisLeft();

        const areaGenerator = area().x(function (d: any) {
            return scaleX(d.name)
        })
            .y0(scaleY(0))
            .y1(function (d: any) {
                return scaleY(d.value)
            });

        const lineGenerator = line()
            .x(function (d: any) {
                return scaleX(d.name)
            })
            .y(function (d: any) {
                return scaleY(d.value)
            });

        let areaPath = this.svg.select('path.area');

        // let linePath = this.svg.select('path.line');

        if (!areaPath.empty()) {
            areaPath.attr('clip-path', null)
            // linePath.attr('clip-path', null)
            if (this.options.animation.enabled) {
                areaPath = areaPath.transition().duration(this.options.animation.duration)
                // linePath = linePath.transition().duration(this.options.animation.duration)
            }
            areaPath.attr('d', areaGenerator(this._data))
            // linePath.attr('d', lineGenerator(this._data))
            return;
        }

        const clip = this.svg.append("clipPath")
            .attr("id", "clip");
        const clipRect = clip.append("rect")
            .attr("width", 0)
            .attr("height", this.height)

        this.svg.append("path")
            .attr('class', 'area')
            .attr("fill", this.options.fillColor ?? '#a2d2ff')
            .attr('clip-path', 'url(#clip)')
            .attr('d', areaGenerator(this._data))

        // this.svg.append("path")
        //     .attr('class', 'line')
        //     .attr("fill", "none")
        //     .attr("stroke", this.options.strokeColor ?? '#d7d7d7')
        //     .attr("stroke-width", 1.5)
        //     .attr('clip-path', 'url(#clip)')
        //     .attr("d", lineGenerator(this._data))

        clipRect.transition()
            .duration(this.options.animation.duration)
            .attr("width", this.width)
        return this;
    }

}
