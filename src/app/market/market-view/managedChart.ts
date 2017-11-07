export class ManagedChart {
    public lineChartData: Array<any>;
    public lineChartLabels: Array<any>;
    public lineChartOptions: any;
    public lineChartColors: Array<any>;
    public lineChartLegend;
    public lineChartType;

    constructor() {
        // this.initTab(tab);

        this.lineChartOptions = {
            responsive: true
        };
          this.lineChartColors = [
            { // grey
              backgroundColor: 'rgba(148,159,177,0.2)',
              borderColor: 'rgba(148,159,177,1)',
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: 'rgba(254,50,50,1)',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            }
          ];
          this.lineChartLegend = true;
          this.lineChartType = 'line';
    }

    // we have to change the values random with the bdd values
    public initTab(tab: any[]) {
        const _lineChartData: Array<any> = new Array();
        const _lineChartLabels: Array<any> = new Array(10);
        _lineChartData[0] = {data: new Array(10), label: 'Carbon'};

        const tabKey = Object.keys(tab);
        for (let i = 0; i < 10 ; i++) {
            _lineChartData[0].data[i] = tab[tabKey[i]];
        }
        this.lineChartData = _lineChartData;

        for (let i = 0; i < 10 ; i++) {
            _lineChartLabels[i] = new Date(parseFloat(tabKey[i])).getMinutes();
        }
        this.lineChartLabels = _lineChartLabels;
    }

}
