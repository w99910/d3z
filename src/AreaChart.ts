import {area} from "d3";
import {Chartable} from "./interfaces/Chartable";
import Chart from "./Chart";

const AreaChart = <T extends Chartable>(Parent: T) => {
    return class extends Parent {
        build(): this {
            const scaleX = this.buildXAxis();

            const scaleY = this.buildYAxis();

            const areaGenerator = area().x(function (d: any) {
                return scaleX(d.name)
            })
                .y0(scaleY(0))
                .y1(function (d: any) {
                    return scaleY(d.value)
                });

            let areaPath = this.svg().select('path.area');

            if (!areaPath.empty()) {
                areaPath.attr('clip-path', null)
                if (this.getOptions().animation.enabled) {
                    areaPath = areaPath.transition().duration(this.getOptions().animation.duration)
                }
                areaPath.attr('d', areaGenerator(this.getData()))
                return;
            }

            const clip = this.svg().append("clipPath")
                .attr("id", "clip");
            const clipRect = clip.append("rect")
                .attr("width", 0)
                .attr("height", this.height())

            this.svg().append("path")
                .attr('class', 'area')
                .attr("fill", this.getOptions().fillColor ?? '#a2d2ff')
                .attr('clip-path', 'url(#clip)')
                .attr('d', areaGenerator(this.getData()))

            clipRect.transition()
                .duration(this.getOptions().animation.duration)
                .attr("width", this.width())
            return this;
        }
    }
}

export default AreaChart(Chart());
