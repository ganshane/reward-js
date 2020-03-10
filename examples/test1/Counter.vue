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
import { api } from 'reward'

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
