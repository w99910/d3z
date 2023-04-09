import {arc, pie, scaleOrdinal, interpolate, select} from "d3";
import Chart from "./Chart";
import {Chartable} from "./interfaces/Chartable";

const PieChart = <T extends Chartable>(Base: T) => {

    return class extends Base {
        protected _radius: number;

        calcTranslate(data, move = 4) {
            const moveAngle = data.startAngle + ((data.endAngle - data.startAngle) / 2);
            return `translate(${-move * Math.cos(moveAngle + Math.PI / 2)}, ${-move * Math.sin(moveAngle + Math.PI / 2)})`;
        }

        build(): this {
            const totalMargin = this.getOptions().margin.top + this.getOptions().margin.bottom + this.getOptions().margin.left + this.getOptions().margin.right;
            const radius = Math.min(this.width(), this.height()) / 2 - totalMargin;


            const colors = scaleOrdinal()
                .domain(this.getData())
                .range(this.getColors());
            const generator = pie()
                .value(function (d: any) {
                    return d.value;
                })

            let chart = generator(this.getData());

            let arcs = this.svg().append("g")
                .attr("transform", "translate(" + this.width() / 2 + "," + this.height() / 2 + ")")
                .selectAll("path")
                .data(chart)
                .enter()
                .append("path")
                .attr('class', 'arc')
                .style("fill", (d, i) => colors[i]);
            let angleInterpolation = interpolate(generator.startAngle()(null), generator.endAngle()(null));

            let Arc = arc().innerRadius(0).outerRadius(radius);

            if (this.getOptions().animation.enabled) {
                arcs.transition()
                    .duration(this.getOptions().animation.duration)
                    .attrTween("d", d => {
                        let originalEnd = d.endAngle;
                        return t => {
                            let currentAngle = angleInterpolation(t);
                            if (currentAngle < d.startAngle) {
                                return "";
                            }

                            d.endAngle = Math.min(currentAngle, originalEnd);

                            return Arc(d);
                        };
                    });
            }

            arcs.attr('d', Arc).attr('fill', function (d) {
                return (colors(d.data.value))
            })

            this.onEndAnimation(() => {
                this.svg().selectAll('path.arc').on('mouseover', (event, v) => {
                    select(event.currentTarget)
                        .transition()
                        .duration(500)
                        .attr('transform', this.calcTranslate(v, 6));
                    select(event.currentTarget).select('path')
                        .transition()
                        .duration(500)
                        .attr('stroke', 'rgba(100, 100, 100, 0.2)')
                        .attr('stroke-width', 4);
                    select('.card-back text').text(v.data.type);
                })
                    .on('mouseout', (event, v) => {
                        select(event.currentTarget)
                            .transition()
                            .duration(500)
                            .attr('transform', 'translate(0, 0)');
                        select(event.currentTarget).select('path')
                            .transition()
                            .duration(500)
                            .attr('stroke', 'white')
                            .attr('stroke-width', 1);
                    });
            })

            return this;
        }
    }
}

export default PieChart(Chart());
