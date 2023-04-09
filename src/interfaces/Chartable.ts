import {ChartData, ChartOptions} from "../BaseChart";
import {Mixable} from "./mixable";

interface _Chartable {

    data(data): this;

    getData(): Array<any>;

    svg(): any;

    width(): number;

    height(): number;

    getOptions(): ChartOptions;

    getColors(data?: Array<ChartData> | number): Array<string>;

    buildXAxis(data?: Array<ChartData> | null): any;

    buildYAxis(data?: Array<ChartData> | null): any;

    beforeBuild(callback: () => void);

    afterBuild(callback: () => void);

    onEndAnimation(callback: () => void);
}

export type Chartable = new (...args: any[]) => _Chartable;
