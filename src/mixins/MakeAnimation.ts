import {Chartable} from "../interfaces/Chartable";

export default <T extends Chartable>(Parent: T) => {
    return class extends Parent {
        public enableAnimation(duration: number) {
            if (duration) {
                this.getOptions().animation.duration = duration;
            }
            this.getOptions().animation.enabled = true;
            return this;
        }

        public disableAnimation() {
            this.getOptions().animation.enabled = false;
            return this;
        }
    }
}
