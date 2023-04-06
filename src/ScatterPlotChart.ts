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

        this.svg.selectAll("circle.point")
            .data(this._data)
            .join(
                enter => {
                    enter = enter
                        .append("circle")
                        .attr('class', 'point')
                        .attr("cx", function (d) {
                            return scaleX(d.name);
                        })
                        .attr("cy", function (d) {
                            return scaleY(d.value);
                        }).style("fill", "#69b3a2")
                    
                    if (this.options.animation.enabled) {
                        enter = enter.attr('r', 0).transition().duration(this.options.animation.duration)
                    }
                    enter.attr('r', this._radius)

                },
                update => {
                    if (this.options.animation.enabled) {
                        update = update.transition()
                            .duration(this.options.animation.duration)
                    }
                    update.attr("cx", function (d) {
                        return scaleX(d.name);
                    })
                        .attr("cy", function (d) {
                            return scaleY(d.value);
                        })
                },
                exit => exit.remove(),
            )


        return this;
    }

}
