import BaseChart from "./BaseChart";

export default class ScatterPlotChart extends BaseChart {
    protected _radius: number = 10;

    radius(radius) {
        this._radius = radius;
        return this;
    }

    build(): this {
        const scaleX = this.buildAxisBottom();
        const scaleY = this.buildAxisLeft()

        let circles = this.svg.append('g')
            .selectAll("dot")
            .data(this._data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return scaleX(d.name);
            })
            .attr("cy", function (d) {
                return scaleY(d.value);
            })
            .style("fill", "#69b3a2")

        if (this.options.animation.enabled) {
            circles = circles.attr('r', 0)
                .transition()
                .duration(this.options.animation.duration)
        }

        circles.attr('r', this._radius);

        return this;
    }

}
