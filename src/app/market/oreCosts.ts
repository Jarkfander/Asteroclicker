export class OreCosts {
    public carbonCosts: number[];
    constructor() {
    }

    public getCostsFromString(oreName: string) {
        switch (oreName) {
            case "carbon":
                return this.carbonCosts;
            default:
                console.log("unknown material (costs)");
                break;
        }
    }
}
