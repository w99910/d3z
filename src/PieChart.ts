import BaseChart from "./BaseChart";
import {arc, pie, scaleOrdinal, interpolate, select} from "d3";

export default class PieChart extends BaseChart {
    protected _radius: number;

    protected _colors: Array<string>;

    protected _fromColor: string;

    protected _toColor: string;

    colors(a: Array<string> | string, b?: string) {
        if (Array.isArray(a)) {
            this._colors = a;
        } else {
            this._fromColor = a;
            this._toColor = b;
        }

        return this;
    }

    build(): this {
        const totalMargin = this.options.margin.top + this.options.margin.bottom + this.options.margin.left + this.options.margin.right;
        const radius = Math.min(this.width, this.height) / 2 - totalMargin;

        const getColors = () => {
            if (this._colors) {
                return this._colors;
            }
            const interpolateColor = interpolate(this._fromColor ?? 'red', this._toColor ?? 'blue')
            return this._data.map((d, i) => interpolateColor(i / this._data.length));
        }

        const colors = scaleOrdinal()
            .domain(this._data)
            .range(getColors());
        const generator = pie()
            .value(function (d) {
                return d.value;
            })

        let chart = generator(this._data);

        let arcs = this.svg.selectAll("path")
            .data(chart)
            .enter()
            .append("path")
            .style("fill", (d, i) => colors[i]);
        let angleInterpolation = interpolate(generator.startAngle()(), generator.endAngle()());

        let Arc = arc();

        arcs.transition()
            .duration(100)
        // .attrTween("d", d => {
        //     let originalEnd = d.endAngle;
        //     return t => {
        //         let currentAngle = angleInterpolation(t);
        //         if (currentAngle < d.startAngle) {
        //             return "";
        //         }
        //
        //         d.endAngle = Math.min(currentAngle, originalEnd);
        //
        //         return Arc(d);
        //     };
        // });

        arcs.attr('d', d => {
            console.log(d)
            console.log(Arc.innerRadius(100).outerRadius(100)(d))
            return Arc.innerRadius(100).outerRadius(100)(d)
        })

        // arcs
        //     .transition()
        //     .attr("d", () => {
        //         return Arc
        //             .innerRadius(50)
        //             .outerRadius(100);
        //     });

        return this;
    }

}

// function calcTranslate(data, move = 4) {
//     const moveAngle = data.startAngle + ((data.endAngle - data.startAngle) / 2);
//     return `translate(${-move * Math.cos(moveAngle + Math.PI / 2)}, ${-move * Math.sin(moveAngle + Math.PI / 2)})`;
// }

// .call(endall, () => {
//     this.svg.selectAll('path.arc').on('mouseover', (event, v) => {
//         select(event.currentTarget)
//             .transition()
//             .duration(500)
//             .attr('transform', calcTranslate(v, 6));
//         select(event.currentTarget).select('path')
//             .transition()
//             .duration(500)
//             .attr('stroke', 'rgba(100, 100, 100, 0.2)')
//             .attr('stroke-width', 4);
//         select('.card-back text').text(v.data.type);
//     })
//         .on('mouseout', (event, v) => {
//             select(event.currentTarget)
//                 .transition()
//                 .duration(500)
//                 .attr('transform', 'translate(0, 0)');
//             select(event.currentTarget).select('path')
//                 .transition()
//                 .duration(500)
//                 .attr('stroke', 'white')
//                 .attr('stroke-width', 1);
//         });
// })

// function endall(transition, callback) {
//     if (typeof callback !== "function") throw new Error("Wrong callback in endall");
//     if (transition.size() === 0) {
//         callback()
//     }
//     let timeout
//     transition
//         .on("end", function () {
//             if (timeout) {
//                 clearTimeout(timeout);
//             }
//             timeout = setTimeout(() => {
//                 callback()
//             }, 300);
//         });
// }
