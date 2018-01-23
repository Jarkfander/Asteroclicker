import { Chart } from 'chart.js';
export class ManagedChart {
    myChart: any;
    numberOfvalues: number;

    constructor(canvas, _numberOfValues: number, color: string) {
        this.numberOfvalues = _numberOfValues;
        let chart: Chart;
        this.myChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    borderColor: [
                        color,
                    ],
                    borderWidth: 1,
                    pointRadius: 0
                }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                pieceLabel: {
                 render: 'label'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }],
                    xAxes: [{
                        display: false
                    }]
                }
            } as any
        }) as any;

    }
    // we have to change the values random with the bdd values
    public initTab(tab: any[]) {
        const tabKey = Object.keys(tab);
        for (let i = tabKey.length - this.numberOfvalues; i < tabKey.length ; i++) {
            this.addData(0, tab[ tabKey[i] ]);
        }
        this.myChart.update();
    }

    public addNew(tab: any[]) {
        const tabKey = Object.keys(tab);
        this.removeDataAndAddData(0, tab[ tabKey[tabKey.length - 1] ]);
    }

    addData(label, data) {
        this.myChart.data.labels.push(label);
        this.myChart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
    }

    removeDataAndAddData(label_, data_) {
        this.myChart.data.labels.shift();
        this.myChart.data.datasets.forEach((dataset) => {
            dataset.data.splice(0, 1);
        });
        this.addData(label_, data_);
        this.myChart.update();
    }
}
