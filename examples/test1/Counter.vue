<template>
  <div id="app">
    <button @click="itemlist({nav:1})">itemlist</button> <br/>
    <button @click="item_detail({itemid:'581393598531'})">itemdetail</button> <br/>
    <button @click="supersearch({keyword:'男士'})">supersearch</button> <br/>
    <button @click="super_classify({nav:1})">super_classify</button> <br/>
    <button @click="column({nav:1})">column</button> <br/>
    <p>itemlist length:{{itemlist_data.length}}</p>
    <p>item_detail length:{{item_detail_data.length}}</p>
    <p>supersearch data length:{{supersearch_data.length}}</p>
    <p>super_classify data length:{{super_classify_data.length}}</p>
    <p>column data length:{{column_data.length}}</p>
  </div>
</template>

<script>
import { api } from 'reward-api'

export default {
  computed: {
    ... api.goods.data
  },
  methods: {
    ... api.goods.actions
  },
  created () {
    api.goods.actions.itemlist()
  }
}
</script>

