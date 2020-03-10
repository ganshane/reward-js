<template>
  <div id="app">
    <button @click="itemlist({nav:1})">itemlist</button> <br/>
    <button @click="item_detail({itemid:'581393598531'})">itemdetail</button> <br/>
    <button @click="supersearch({keyword:'男士'})">supersearch</button> <br/>
    <button @click="super_classify({nav:1})">super_classify</button> <br/>
    <button @click="column({nav:1})">column</button> <br/>
    <p>{{itemlist_data}}</p>
    <p>{{item_detail_data}}</p>
    <p>{{supersearch_data}}</p>
    <p>{{super_classify_data}}</p>
    <p>{{column_data}}</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState({
    itemlist_data: state => state.goods.itemlist.data,
    item_detail_data: state => state.goods.item_detail.data,
    supersearch_data: state => state.goods.supersearch.data,
    super_classify_data: state => state.goods.super_classify.data,
    column_data: state => state.goods.column.data
  }),
  methods: {
    ...mapActions({
      itemlist: 'goods/itemlist',
      item_detail: 'goods/item_detail',
      supersearch: 'goods/supersearch',
      super_classify: 'goods/super_classify',
      column: 'goods/column'
    })
  }
}
</script>
