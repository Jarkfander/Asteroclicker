export class OreTrends {
    
    public carbonTrend: number;
    constructor() {
    }

    public getTrendFromString(oreName:string){
        switch(oreName){
            case "carbon":
                return this.carbonTrend;
            default:
                console.log("unknown ore (trend)");
        }
    }

}
