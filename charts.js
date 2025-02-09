function createExpenseChart(data) {
    const options = {
        series: Object.values(data),
        chart: {
            type: 'donut',
            height: 350,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        labels: Object.keys(data),
        colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Expenses',
                            formatter: function (w) {
                                return Object.values(data).reduce((a, b) => a + b, 0).toFixed(2);
                            }
                        }
                    }
                }
            }
        },
        tooltip: {
            y: {
                formatter: function(value) {
                    return value.toFixed(2);
                }
            }
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            markers: {
                width: 20,
                height: 20,
                radius: 5
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    height: 300
                }
            }
        }]
    };

    const chart = new ApexCharts(document.querySelector("#expense-chart"), options);
    chart.render();
    return chart;
}
