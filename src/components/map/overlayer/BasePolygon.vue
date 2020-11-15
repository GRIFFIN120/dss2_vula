<template>
  <div>
    <div v-if="loaded">
      <slot :map="map" :polygon="object" ></slot>
    </div>
  </div>
</template>

<script>
import AMap from 'AMap'
import mix from './poly'
export default {
  mixins: [mix],
  data () {
    return {
      entity: 'polygon',
      loaded: false
    }
  },
  methods: {
    createObject (path) {
      const polygon = new AMap.Polygon({
        path: path
      })
      return polygon
    }
  }
}
</script>

<style scoped>

</style>
