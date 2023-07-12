<template>
  <div class="wrapper">
    <div class="chart">
      <my-chart :current-city="currentCity" />


    </div>
    <div class="table-wrapper">
      <div class="filters">

        <my-filter @filter="setFilterByCounties" title="Country" filter-name="country" :countries="allCountries"
          :filter-type="filterTypes.COUNTRIES_FILTER" />
        <my-filter @filter-number="setFilterByTemp" title="MIN" filter-name="min"
          :filter-type="filterTypes.WHITHIN_FILTER" />

        <my-filter @filter-number="setFilterByTemp" title="MAX" filter-name="max"
          :filter-type="filterTypes.WHITHIN_FILTER" />
      </div>
      <div class="table">
        <my-table @current-item="setActiveCity" :loading="loading" :list-items="prepareList" />
      </div>
    </div>
  </div>>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { cities, dataCities } from '@/components/data/cities';
import { countries } from '@/components/data/countries';
import MyFilter from '@/components/table/MyFilter.vue';
import MyTable from '@/components/table/MyTable.vue';
import MyChart from '@/components/chart/MyChart.vue'
import { WeatherData, FilterByCountry, NumberFilter } from '@/components/types.d';


import ApexCharts from 'apexcharts'

import { WHITHIN_FILTER, COUNTRIES_FILTER } from '@/components/data/filterTypes';




export default defineComponent({
  name: 'App',
  components: {
    MyFilter, MyTable, MyChart
  },
  data() {
    return {
      cities: cities,
      allCountries: countries,
      filterTypes: {
        WHITHIN_FILTER,
        COUNTRIES_FILTER
      },
      filterByCountry: [] as FilterByCountry[],
      filterByTempMin: {} as NumberFilter,
      filterByTempMax: {} as NumberFilter,
      itemList: dataCities as WeatherData[],
      loading: false,
      filteredList: [] as WeatherData[],
      currentCity: {} as WeatherData,
    }
  },
  mounted() {
    // this.getData() // to server
  },
  methods: {
    setActiveCity(val: WeatherData) {
      this.currentCity = val
    },
    setFilterByTemp(val: NumberFilter) {
      if (val.type === 'min') {
        this.filterByTempMin = val;
      } else {
        this.filterByTempMax = val
      }
      this.applyFilters()
    },
    applyFilterTempMin() {
      const itemsFilter: WeatherData[] = this.filterByCountry.length ? this.filteredList : this.itemList;
      const filteredItems: WeatherData[] = itemsFilter.filter(elem => elem.min >= this.filterByTempMin.min && elem.min <= this.filterByTempMin.max);
      this.filteredList = filteredItems;
    },
    applyFilterTempMax() {
      const itemsFilter: WeatherData[] = this.filterByCountry.length || this.filterByTempMin ? this.filteredList : this.itemList;

      const filteredItems: WeatherData[] = itemsFilter.filter(elem => elem.max >= this.filterByTempMax.min && elem.max <= this.filterByTempMax.max);
      this.filteredList = filteredItems;

    },
    applyFilters() {
      if (this.filterByCountry) {
        this.applyFilterByCounties()
      }
      if (this.filterByTempMin.min) {
        this.applyFilterTempMin()
      }
      if (this.filterByTempMax.min) {
        this.applyFilterTempMax()
      }
    },
    setFilterByCounties(val: FilterByCountry[]) {
      this.filterByCountry = val;
      this.applyFilters();
    },
    applyFilterByCounties() {
      const filteredItemsList: WeatherData[] = this.itemList;

      let filteredList: WeatherData[] = [];
      this.filterByCountry.forEach(item => {
        let searchItems: WeatherData[] = filteredItemsList.filter(el => el.idCountry === item.id)
        filteredList.push(...searchItems);
      });

      this.filteredList = filteredList
    },
    calculateAverage(item: { time: string[], temperature_2m: number[] }) {
      let hourlyTemp: number[] = item.temperature_2m;

      const days: number = hourlyTemp.length / 24;
      const hoursPerDay = 24;

      const dailyAverages: number[] = [];
      for (let i = 0; i < days; i++) {
        const startIndex: number = hourlyTemp.length - (days - i) * hoursPerDay;
        const endIndex: number = startIndex + hoursPerDay;
        const dailyTemperatures: number[] = hourlyTemp.slice(startIndex, endIndex);
        const dailyAverage: number = Math.ceil(dailyTemperatures.reduce((sum, temperature) => sum + temperature, 0) / hoursPerDay);
        dailyAverages.push(dailyAverage);
      }
      return dailyAverages
    },
    findDate(num: number) {
      let date = new Date();
      if (num !== 0) {
        date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    async getData() {
      let countriesList = [];
      const currentDate = this.findDate(0)
      const prevDate = this.findDate(6)
      this.loading = true
      for (let i = 0; i < this.cities.length; i++) {

        try {
          const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${this.cities[i].location.latitude}&longitude=${this.cities[i].location.longitude}&hourly=temperature_2m,winddirection_10m&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=GMT&start_date=${prevDate}&end_date=${currentDate}`);

          countriesList.push({
            ...this.cities[i],
            current_weather: response.data.current_weather,
            min: response.data.daily.temperature_2m_min.pop(),
            max: response.data.daily.temperature_2m_max.pop(),
            avg: this.calculateAverage(response.data.hourly)
          });

        } catch (e) {
          console.log(e)
        }
      }
      this.loading = false;
      this.itemList = countriesList;
    },
  },
  computed: {
    prepareList(): WeatherData[] {
      return this.filteredList.length ? this.filteredList.slice(0, 8) : this.itemList.slice(0, 8);
    }
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}

.chart {
  padding: 16px 24px 0px 14px;
  border-radius: 16px;
  background: #1A1A1A;
  width: 432px;
  height: 453px;
}

#app .table-wrapper {
  width: 641px;
  padding: 25px 16px 18px 16px;
  justify-content: flex-end;
  align-items: flex-start;
  border-radius: 16px;
  background: #1A1A1A;

  .table {
    min-height: 342px;
  }

  .filters {
    margin-bottom: 25px;
    display: flex;
  }
}
</style>