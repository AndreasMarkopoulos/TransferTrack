<template>
  <div className="overflow-x-scroll sm:overflow-x-auto">
    <canvas id="chart-3">
    </canvas>
  </div>
</template>

<script setup lang="ts">
import {Chart, ChartItem, registerables} from 'chart.js';
import {Trip} from "~/models/apiModels";
import {PropType} from "@vue/runtime-core";

Chart.register(...registerables);

interface PickupLocationVisit {
  pickupLocation: string;
  visitCount: number;
}

const chart1Data = ref<PickupLocationVisit[]>([])
const chart = ref()

const props = defineProps({
  selectedDateTrips: {
    type: Array as PropType<Trip[]>,
    default: []
  }
})
watch(() => props.selectedDateTrips, () => refreshData())

function getPickupLocationVisits(trips: Trip[]): PickupLocationVisit[] {
  const pickupLocationMap: Map<string, number> = new Map();

  for (const trip of trips) {
    const pickupLocation = trip.pickupLocation;
    if (pickupLocationMap.has(pickupLocation)) {
      pickupLocationMap.set(pickupLocation, pickupLocationMap.get(pickupLocation)! + 1);
    } else {
      pickupLocationMap.set(pickupLocation, 1);
    }
  }

  const pickupLocationVisits: PickupLocationVisit[] = [];

  for (const [pickupLocation, visitCount] of pickupLocationMap) {
    pickupLocationVisits.push({ pickupLocation, visitCount });
  }

  return pickupLocationVisits;
}


async function refreshData() {
  // const originalTrips = JSON.stringify(selectedDateTrips.value)
  // selectedDateTrips.value =  await fetchTripsByDate(props.date);
  chart1Data.value = getPickupLocationVisits(props.selectedDateTrips);
  console.log(chart1Data.value)
  const chart = Chart.getChart(document.getElementById('chart-3') as HTMLCanvasElement)
  // chart.data.datasets[0].data = [chart1Data.value.map(row => row.concurrentTrips)]
  if (chart) {
    chart.data.datasets[0].data = chart1Data.value.map(item => item.visitCount);
    chart.data.labels = chart1Data.value.map(item => item.pickupLocation)
    chart?.update()
  }
}
const labels = chart1Data.value.map(item => item.pickupLocation);
const data = chart1Data.value.map(item => item.visitCount);

onMounted(async () => {
  await refreshData();
  chart.value = new Chart(
      document.getElementById('chart-3') as ChartItem,
      {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              borderColor:'none',
              backgroundColor: ['#5672b3',"#e49a4e","#50b09e","#e85e76",'#287e8f'],
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