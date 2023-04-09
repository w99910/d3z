import BaseChart from "./BaseChart";
import InteractWithColors from "./mixins/InteractWithColors";
import BuildLegend from "./mixins/BuildLegend";
import MakePretty from "./mixins/MakePretty";
import MakeAnimation from "./mixins/MakeAnimation";
import BuildXAxis from "./mixins/BuildXAxis";
import BuildYAxis from "./mixins/BuildYAxis";
import BuildTooltip from "./mixins/BuildTooltip";

export default function Chart() {
    const applyMixins = (derivedCtor: any, constructors: any[]) => {
        let a = derivedCtor;
        constructors.forEach((baseCtor) => {
            a = baseCtor(a);
        });
        return a;
    }

    return applyMixins(BaseChart, [BuildXAxis, BuildYAxis, InteractWithColors, BuildLegend, MakePretty, MakeAnimation, BuildTooltip])
}
