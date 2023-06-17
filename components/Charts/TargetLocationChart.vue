<template>
  <div>
    <canvas id="chart-2">
    </canvas>
  </div>
</template>

<script setup lang="ts">
import {Chart, ChartItem, registerables} from 'chart.js';
import {Trip} from "~/models/apiModels";
import {PropType} from "@vue/runtime-core";
import {chartNoDataPlugin} from "~/utils/genericUtils";

Chart.register(...registerables);

interface TargetLocationVisit {
  targetLocation: string;
  visitCount: number;
}

const chart1Data = ref<TargetLocationVisit[]>([])
const chart = ref()

const props = defineProps({
  selectedDateTrips: {
    type: Array as PropType<Trip[]>,
    default: []
  }
})
watch(() => props.selectedDateTrips, () => refreshData())

function getTargetLocationVisits(trips: Trip[]): TargetLocationVisit[] {
  const targetLocationMap: Map<string, number> = new Map();

  for (const trip of trips) {
    const targetLocation = trip.targetLocation;
    if (targetLocationMap.has(targetLocation)) {
      targetLocationMap.set(targetLocation, targetLocationMap.get(targetLocation)! + 1);
    } else {
      targetLocationMap.set(targetLocation, 1);
    }
  }

  const targetLocationVisits: TargetLocationVisit[] = [];

  for (const [targetLocation, visitCount] of targetLocationMap) {
    targetLocationVisits.push({ targetLocation, visitCount });
  }

  return targetLocationVisits;
}


async function refreshData() {
  // const originalTrips = JSON.stringify(selectedDateTrips.value)
  // selectedDateTrips.value =  await fetchTripsByDate(props.date);
  chart1Data.value = getTargetLocationVisits(props.selectedDateTrips);
  console.log(chart1Data.value)
  const chart = Chart.getChart(document.getElementById('chart-2') as HTMLCanvasElement)
  // chart.data.datasets[0].data = [chart1Data.value.map(row => row.concurrentTrips)]
  if (chart) {
    chart.data.datasets[0].data = chart1Data.value.map(item => item.visitCount);
    chart.data.labels = chart1Data.value.map(item => item.targetLocation)
    chart?.update()
  }
}
const labels = chart1Data.value.map(item => item.targetLocation);
const data = chart1Data.value.map(item => item.visitCount);

onMounted(async () => {
  await refreshData();
  chart.value = new Chart(
      document.getElementById('chart-2') as ChartItem,
      {
        type: 'doughnut',
        plugins:[chartNoDataPlugin],
        data: {
          labels,
          datasets: [
            {
              data,
              borderColor:'none',
              backgroundColor: ['#5672b3',"#e49a4e","#50b09e","#e85e76",'#ef8a5a','#287e8f'],
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
        },
      }
  );
})

</script>

<style scoped>

</style>