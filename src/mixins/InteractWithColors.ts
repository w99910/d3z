import {interpolate} from "d3";
import {ChartData} from "../BaseChart";
import {Chartable} from "../interfaces/Chartable";

export default <T extends Chartable>(Parent: T) => {
    return class extends Parent {

        fillColor(color: string) {
            this.getOptions().fillColor = color;
            return this;
        }

        colors(a: Array<string> | string, b?: string) {
            if (Array.isArray(a)) {
                this.getOptions().colors = a;
            } else {
                this.getOptions().fromColor = a;
                this.getOptions().toColor = b;
            }

            return this;
        }
    }
}
