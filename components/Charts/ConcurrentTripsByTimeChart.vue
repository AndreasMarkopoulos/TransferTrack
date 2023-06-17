<template>
  <div class="overflow-x-scroll sm:overflow-x-auto section">
    <canvas class="sm-line-chart" id="chart-1">
    </canvas>
  </div>
</template>

<script setup lang="ts">
import {Chart, ChartItem, registerables} from 'chart.js';
import {Trip} from "~/models/apiModels";
import {PropType} from "@vue/runtime-core";
import {chartNoDataPlugin} from "~/utils/genericUtils";

Chart.register(...registerables);
interface ConcurrentTrip {
  time: string;
  concurrentTrips: number;
}
const chart1Data = ref<ConcurrentTrip[]>([])
const chart = ref()

const props = defineProps({
  selectedDateTrips: {
    type: Array as PropType<Trip[]>,
    default: []
  }
})
watch(() => props.selectedDateTrips, () => refreshData())
function extractDates(trips: Trip[]): { createdDates: string[], finishedAtDates: string[] } {
  const createdDates: string[] = [];
  const finishedAtDates: string[] = [];

  for (const trip of trips) {
    createdDates.push(trip.created);
    if(trip.finishedAt) {
      finishedAtDates.push(trip.finishedAt);
    }
  }

  return {
    createdDates,
    finishedAtDates,
  };
}
function calculateConcurrentTrips(createdDates: string[], finishedAtDates: string[]): ConcurrentTrip[] {
  const events: { time: string, isStart: boolean }[] = [];

  // Create an array of events with timestamps and flags indicating whether it is a start or finish event
  for (const createdDate of createdDates) {
    events.push({ time: createdDate, isStart: true });
  }

  for (const finishedAtDate of finishedAtDates) {
    events.push({ time: finishedAtDate, isStart: false });
  }

  // Sort the events array by timestamp in ascending order
  events.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  let concurrentTrips = 0;
  const concurrentTripsArray: ConcurrentTrip[] = [];

  // Iterate through the sorted events array and update the concurrentTrips count
  for (const event of events) {
    if (event.isStart) {
      concurrentTrips++;
    } else {
      concurrentTrips--;
    }

    const time = new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    concurrentTripsArray.push({ time, concurrentTrips });
  }

  return concurrentTripsArray;
}
async function refreshData() {
  // const originalTrips = JSON.stringify(selectedDateTrips.value)
  // selectedDateTrips.value =  await fetchTripsByDate(props.date);
  const dateArrays = extractDates(props.selectedDateTrips)
  chart1Data.value = calculateConcurrentTrips(dateArrays.createdDates,dateArrays.finishedAtDates)
  const chart = Chart.getChart(document.getElementById('chart-1') as HTMLCanvasElement)
  // chart.data.datasets[0].data = [chart1Data.value.map(row => row.concurrentTrips)]
  if(chart) {
    chart.data.datasets[0].data = chart1Data.value.map(row => row.concurrentTrips);
    chart.data.labels = chart1Data.value.map(row => row.time)
    chart?.update()
  }
}
onMounted(async () => {
  await refreshData();
  chart.value = new Chart(
      document.getElementById('chart-1') as ChartItem,
      {
        type: 'line',
        plugins:[chartNoDataPlugin],
        data: {
          labels: chart1Data.value.map(row => row.time),
          datasets: [
            {
              label: 'Active Trips by hour',
              data: chart1Data.value.map(row => row.concurrentTrips),
              borderColor: "rgb(30, 185, 128,0.5)",
              borderDash: [5, 5],
              backgroundColor: "#37efba",
              pointBackgroundColor: "#37efba",
              pointBorderColor: "#37efba",
              pointHoverBackgroundColor: "#37efba",
              pointHoverBorderColor: "#37efba",
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            }
          },
          responsive: true,
          scales: {
            y: {
              ticks: {
                precision: 0
              },
              grid: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            x: {
              grid: {
                color: 'rgba(0,0,0,0)'
              },
            }
          }
        }
      },
  );
})
</script>

<style scoped>
.sm-line-chart {
  height: 25rem;min-width:100rem;margin:auto
}
.section::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #36343B;
}
.section::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: rgba(30, 185, 128,0.8);
}
.section::-webkit-scrollbar-thumb:hover {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #37efba;
}
.section::-webkit-scrollbar {
  width: 12px;
  height: 6px;
}
</style>