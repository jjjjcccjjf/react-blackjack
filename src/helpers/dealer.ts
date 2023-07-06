import ApiHelper from "./api";

type DealerActions = "STAND" | "HIT"

class DealerHelper {

    async getNextAction(handValue: number) {
        if (handValue >= 17) {
            return "STAND"
        } else {
            return "HIT"
        }
    }

}

export default DealerHelper