<template>
  <div id="container"></div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { markProps } from './types';
export default {
  name: 'Map',
  props: {
    mark: {
      type: Object,
      default: () => {
        return {
          lng: 0,
          lat: 0
        }
      }
    }
  },
  setup(props) {
    const map = ref<any>(null);
    onMounted(() => {
      map.value = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 13,
      });
    })

    function setMapCenter(nmark: markProps, nmap: any) {
      const newMap = nmap ? nmap : map.value;
      const marker = new AMap.Marker({
        position: new AMap.LngLat(nmark.lng, nmark.lat),
      });
      newMap.add(marker);
      newMap.setFitView(marker);
    }
  }
}
</script>
