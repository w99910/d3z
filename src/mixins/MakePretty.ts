import {Chartable} from "../interfaces/Chartable";

export default <T extends Chartable>(Parent: T) => {
    return class extends Parent {
        public pretty() {
            let xAxisGroup = this.svg().node().parentElement.parentElement.querySelector('g.axis-x');
            let yAxisGroup = this.svg().node().parentElement.parentElement.querySelector('g.axis-y');

            xAxisGroup.querySelector('path.domain').setAttribute('stroke', '0');
            yAxisGroup.querySelector('path.domain').setAttribute('stroke', '0');

            if (this.getOptions().orientation === 'vertical') {
                yAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                    tick.setAttribute('x2', this.width().toString())
                    tick.setAttribute('stroke', 'lightgrey')
                });
                xAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                    tick.remove();
                });
            } else {
                xAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                    tick.setAttribute('y2', this.height().toString())
                });
                yAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                    tick.remove()
                });
            }
            return this;
        }
    }
}
