import {select, selectAll} from "d3";

export default abstract class BaseChart {

    protected options = {
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        },
        orientation: 'vertical',
        animation: true,
    }

    protected _data: Array<any>;

    protected _svg;

    protected constructor(protected container: HTMLElement) {

    }

    protected get width() {
        return this.container.getBoundingClientRect().width - this.options.margin.left - this.options.margin.right;
    }

    protected get height() {
        return this.container.getBoundingClientRect().height - this.options.margin.top - this.options.margin.bottom;
    }

    public abstract build(): this;

    public abstract update(data): this;

    public abstract data(data: Array<any>): this;

    public margin(margin = {}) {
        for (let property of Object.keys(margin)) {
            this.options.margin[property] = margin[property];
        }
        return this;
    }

    public pretty() {
        let mainGroup = this.container.querySelector('svg g');

        let xAxisGroup = mainGroup.children[0];
        let yAxisGroup = mainGroup.children[1]


        xAxisGroup.querySelector('path.domain').setAttribute('stroke', '0');
        yAxisGroup.querySelector('path.domain').setAttribute('stroke', '0');

        if (this.options.orientation === 'vertical') {
            yAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                tick.setAttribute('x2', this.width.toString())
                tick.setAttribute('stroke', 'lightgrey')
            });
            xAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                tick.remove();
            });
        } else {
            xAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                tick.setAttribute('y2', this.height.toString())
            });
            yAxisGroup.querySelectorAll('.tick line').forEach((tick) => {
                tick.remove()
            });
        }
    }

    public enableAnimation() {
        this.options.animation = true;
        return this;
    }

    public disableAnimation() {
        this.options.animation = false;
        return this;
    }
}
