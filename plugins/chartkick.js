import Vue from 'vue'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'

import 'chartjs-plugin-datalabels'

Vue.use(VueChartkick, { adapter: Chart })
