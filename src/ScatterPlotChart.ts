import {Chartable} from "./interfaces/Chartable";
import Chart from "./Chart";

const ScatterPlotChart = <T extends Chartable>(Base: T) => {
    return class extends Base {
        protected _radius: number = 10;

        radius(radius) {
            this._radius = radius;
            return this;
        }

        build(): this {
            const scaleX = this.buildXAxis();
            const scaleY = this.buildYAxis()

            this.svg().selectAll("circle.point")
                .data(this.getData())
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

                        if (this.getOptions().animation.enabled) {
                            enter = enter.attr('r', 0).transition().duration(this.getOptions().animation.duration)
                        }
                        enter.attr('r', this._radius)

                    },
                    update => {
                        if (this.getOptions().animation.enabled) {
                            update = update.transition()
                                .duration(this.getOptions().animation.duration)
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
}

export default ScatterPlotChart(Chart());
