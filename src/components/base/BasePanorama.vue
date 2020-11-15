<template>
  <div id="photo-sphere">
    <div id="viewer"></div>
  </div>
</template>

<script>
import PhotoSphereViewer from 'photo-sphere-viewer'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
export default {
  props: ['data'],
  components: {
  },
  data () {
    return {
      panoramadata: null,
      div: 'viewer',
      imgurl: '/dfs/' + this.data.url
    }
  },
  mounted () {
    this.displayPanoramadata = true
    this.panoramadata = PhotoSphereViewer({
      container: this.div, // 必须的参数：绑定的容器
      panorama: this.imgurl, // 必须的参数：图片路径
      size: {
        width: '100%',
        height: '550'
      }
    })
  }
}
</script>

<style scoped>
.pano{
  width: 100%;
  height: 400px;
}
</style>
