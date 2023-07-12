
import { createApp } from 'vue';
import App from './App.vue';
import MyFilter from './components/table/MyFilter.vue'
import MyTable from './components/table/MyTable.vue'
import MyChart from './components/chart/MyChart.vue'
import VueApexCharts from "vue3-apexcharts";
import './assets/style.scss';


const app = createApp(App);
app.use(VueApexCharts, MyChart, MyTable, MyFilter);
app.mount('#app');
