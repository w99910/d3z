import {Chartable} from "../interfaces/Chartable";
import {select} from "d3";
import {ChartData} from "../BaseChart";

export default <T extends Chartable>(Parent: T) => {
    return class extends Parent {
        tooltip(enabled: boolean) {
            this.getOptions().tooltip = enabled;
            return this;
        }

        buildTooltip(element, text: (d: ChartData) => string, styles = {}) {
            // Tooltip
            const tooltip = select(this.svg().node().parentElement.parentElement).append('div').attr('class', 'tooltip')
                .style('opacity', 0)
                .style('position', 'fixed')
                .style('background-color', 'white')
                .style('border', 'solid')
                .style('border-width', '1px')
                .style('border-radius', '5px')
                .style('padding', '2px')
                .style('font-size', '12px')
                .style('z-index', '1000')
                .style('pointer-events', 'none')

            for (let property of Object.keys(styles)) {
                const resolveCamma = (property) => {
                    return property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
                }
                tooltip.style(resolveCamma(property), styles[property]);
            }

            this.svg().selectAll(element).on('mouseover', function (event, d) {
                tooltip.transition().duration(100)
                    .style('opacity', 1)
                    .style('left', (event.pageX + 2) + 'px')
                    .style('top', (event.pageY + 2) + 'px')
                    .text(text(d));
            }).on('mouseout', function (event, d) {
                tooltip.transition().duration(100)
                    .style('opacity', 0);
            })
        }
    }
}
