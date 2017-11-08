import Chart from 'chart.js';
export class ManagedChart {
    myChart: Chart;
    numberOfvalues: number;

    constructor(canvas, _numberOfValues: number) {
        this.numberOfvalues = _numberOfValues;
        this.myChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                pieceLabel: {
                render: 'label'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    }
    // we have to change the values random with the bdd values
    public initTab(tab: any[]) {
        const tabKey = Object.keys(tab);
        for (let i = 0; i < 10 ; i++) {
            this.addData(new Date(parseFloat(tabKey[i])).getMinutes(), tab[ tabKey[i] ]);
        }
        this.myChart.update();
    }

    public addNew(tab: any[]) {
        const tabKey = Object.keys(tab);
        this.removeDataAndAddData(new Date(parseFloat(tabKey[this.numberOfvalues - 1])).getMinutes(),
                                  tab[ tabKey[this.numberOfvalues - 1] ]);
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
