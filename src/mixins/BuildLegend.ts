import {Chartable} from "../interfaces/Chartable";

export default <T extends Chartable>(Parent: T) => {
    return class extends Parent {
        legend(enabled: boolean) {
            this.getOptions().legend = enabled;
            return this;
        }

        protected buildLegends(data, colors) {
            data.forEach((d, index) => {
                const legend = this.svg()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', `translate(${(this.width() - 100) + (index * 60)}, ${this.getOptions().margin.top})`)
                legend.append('rect')
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('fill', colors[index])
                legend.append('text')
                    .attr('x', 15)
                    .attr('y', 10)
                    .text(d.name)
            })
        }
    }
}
