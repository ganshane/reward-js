<template>
  <div id="app">
    <button @click="findGoods({nav:1})">得到所有产品列表</button> <br/>
    <p>{{content}}</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState({
    content: state => state.goods.list
  }),
  methods: {
    ...mapActions({ findGoods: 'goods/findGoods' })
  }
}
</script>
