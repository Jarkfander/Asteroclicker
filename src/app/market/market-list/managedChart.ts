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
            this.addData(new Date(parseFloat(tabKey[i])).getSeconds(), tab[ tabKey[i] ]);
        }
        this.myChart.update();
    }

    public addNew(tab: any[]) {
        const tabKey = Object.keys(tab);
        this.removeDataAndAddData(new Date(parseFloat(tabKey[tabKey.length - 1])).getSeconds(),
                                  tab[ tabKey[tabKey.length - 1] ]);
    }

    addData(label, data) {
        this.myChart.data.labels.push(label);
        this.myChart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
    }

    removeDataAndAddData(label_, data_) {
        const label = new Array<number>(this.numberOfvalues);
        for (let i = 0 ; i < this.numberOfvalues - 1 ; i++) {
            label[i] = this.myChart.data.labels[i + 1];
        }

        const data = new Array<number>(this.numberOfvalues);
        for (let i = 0 ; i < this.numberOfvalues - 1 ; i++) {
            data[i] = this.myChart.data.datasets[0].data[i + 1];
        }

        for (let i = 0 ; i < this.numberOfvalues ; i++) {
            this.myChart.data.labels.pop();
        }

        for (let i = 0 ; i < this.numberOfvalues ; i++) {
            this.myChart.data.datasets[0].data.pop();
        }

        for (let i = 0 ; i < this.numberOfvalues - 1; i++) {
            this.addData(label[i], data[i]);
        }
        this.addData(label_, data_);

        this.myChart.update();
    }
}
