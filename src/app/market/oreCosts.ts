export class OreCosts {
    public carbonCosts: number[];
    public titaniumCosts: number[];
    public ferCosts: number[];
    constructor() {
    }

    public getCostsFromString(oreName: string) {
        switch (oreName) {
            case 'carbon':
                return this.carbonCosts;
            case 'titanium':
                return this.titaniumCosts;
            case 'fer':
                return this.ferCosts;
            default:
                console.log('unknown material (costs)');
                break;
        }
    }
}
