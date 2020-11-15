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
      entity: 'polyline',
      loaded: false
    }
  },
  methods: {
    createObject (path) {
      const polyline = new AMap.Polyline({
        path: path
      })
      return polyline
    }
  }
}
</script>

<style scoped>

</style>
