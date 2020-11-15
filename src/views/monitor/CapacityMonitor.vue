<template>
  <BaseMap :style-param="13" >
    <template v-slot="{map}">
      <LocaTest :map="map"></LocaTest>
    </template>
  </BaseMap>
</template>

<script>
import BaseMap from '../../components/map/BaseMap'
import LocaTest from './LocaTest'
export default {
  components: {
    BaseMap,
    LocaTest
  }
}
</script>

<style scoped>

</style>
