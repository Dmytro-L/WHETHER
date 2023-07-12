<template>
    <div>
        <apexchart v-if="currentCity?.id" height="426" :key="currentCity.id" type="bar" :options="options" :series="series">
        </apexchart>
        <div v-else class="loader">
            <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                <path fill="#fff"
                    d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50"
                        to="360 50 50" repeatCount="indefinite" />
                </path>
            </svg>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    props: {
        currentCity: {
            type: Object as () => WeatherData
        }
    },
    data() {
        return {
            options: {
                chart: {
                    id: 'vuechart',
                    toolbar: {
                        show: false
                    }
                },
                xaxis: {
                    axisTicks: {
                        show: false
                    },
                    axisBorder: {
                        show: false
                    },
                    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    labels: {
                        rotate: 0,
                        style: {
                            colors: '#FDFCFF',
                            fontSize: '14px',
                            fontFamily: 'Helvetica',
                            fontWeight: 400,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                legend: {
                    show: true,
                    showForSingleSeries: true,
                    showForNullSeries: false,
                    showForZeroSeries: false,
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: false,
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial',
                    fontWeight: 400,
                    formatter: undefined,
                    inverseOrder: false,
                    width: undefined,
                    height: undefined,
                    tooltipHoverFormatter: undefined,
                    customLegendItems: [],
                    offsetX: 0,
                    offsetY: -35,
                    labels: {
                        colors: '#FDFCFF',
                        useSeriesColors: false
                    },
                    markers: {
                        width: 10,
                        height: 10,
                        strokeWidth: 0,
                        strokeColor: '#B3FC4F',
                        fillColors: undefined,
                        radius: 2,
                        customHTML: undefined,
                        onClick: undefined,
                        offsetX: 0,
                        offsetY: 0
                    },
                    itemMargin: {
                        horizontal: 0,
                        vertical: 0
                    },
                    onItemClick: {
                        toggleDataSeries: false
                    },
                    onItemHover: {
                        highlightDataSeries: false
                    },
                },
                tooltip: {
                    enabled: false
                },
                yaxis: {
                    show: true,
                    labels: {
                        rotate: 0,
                        style: {
                            colors: '#FDFCFF',
                            fontSize: '14px',
                            fontFamily: 'Helvetica',
                            fontWeight: 400,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                plotOptions: {
                    bar: {
                        columnWidth: '27px',
                        borderRadius: 8,
                        borderRadiusApplication: 'end'
                    }
                },
                colors: ['#B3FC4F'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        type: 'vertical',
                        shadeIntensity: 0,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100],
                        colorStops: [
                            {
                                offset: 0,
                                color: '#B3FC4F'
                            },
                            {
                                offset: 100,
                                color: '#173102'
                            }
                        ]
                    }
                },
                title: {
                    text: 'Analytics',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: undefined,
                        color: '#FDFCFF'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                grid: {
                    show: true,
                    borderColor: '#313131',
                    strokeDashArray: 10,
                    position: 'back',
                    xaxis: {
                        lines: {
                            show: false
                        }
                    },
                    yaxis: {
                        lines: {
                            show: true
                        },
                    },
                    row: {
                        colors: undefined,
                        opacity: 0.5
                    },
                },
            }
        }
    },
    computed: {
        series() {
            return [{
                name: this.currentCity?.name,
                data: this.currentCity?.avg
            }]
        }
    }
})
</script>