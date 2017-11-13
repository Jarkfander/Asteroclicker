export class OreCosts {
    public carbonCosts: number[];
    public titaniumCosts: number[];
    constructor() {
    }

    public getCostsFromString(oreName: string) {
        switch (oreName) {
            case 'carbon':
                return this.carbonCosts;
            case 'titanium':
                return this.titaniumCosts;
            default:
                console.log('unknown material (costs)');
                break;
        }
    }
}
