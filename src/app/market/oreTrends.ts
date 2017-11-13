export class OreTrends {
    public carbonTrend: number;
    public titaniumTrend: number;
    constructor() {
    }

    public getTrendFromString(oreName: string) {
        switch (oreName) {
            case 'carbon':
                return this.carbonTrend;
            case 'titanium':
                return this.carbonTrend;
            default:
                console.log('unknown ore (trend)');
        }
    }

}
