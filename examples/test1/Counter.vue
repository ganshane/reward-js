<template>
  <div id="app">
    <button @click="itemlist({nav:1})">itemlist</button> <br/>
    <button @click="item_detail({itemid:'581393598531'})">itemdetail</button> <br/>
    <p>{{itemlist_data}}</p>
    <p>{{item_detail_data}}</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState({
    itemlist_data: state => state.goods.itemlist.data,
    item_detail_data: state => state.goods.item_detail.data
  }),
  methods: {
    ...mapActions({
      itemlist: 'goods/itemlist',
      item_detail: 'goods/item_detail'
    })
  }
}
</script>
