<template>
  <div id="app">
    <h2 :title="title">{{title}}</h2>
    
    <dform :tableData="tableData"></dform>

    <table class="table">
      <tbody>
        <tr>
          <th width="10%">id</th>
          <th width="40">name</th>
          <th width="20%">price</th>
          <th width="30%">actions</th>
        </tr>

        <tr v-for="item in tableData" :key="item.id">
          <td>{{item.id}}</td>
          <td>{{item.name}}</td>
          <td>${{item.price}}</td>
          <td>
            <a href="javascript:;" @click="add(item)">add to cart</a>
          </td>
        </tr>
      </tbody>
    </table>

    <hr>
    <h2>cart</h2>

    <cart ref="cart" @addSuccess="addSucessCallback"></cart>
  </div>
</template>

<script>
import Cart from "./../components/Cart.vue";
import Dform from "./../components/Dform.vue";
export default {
  name: "App",
  components: {
    Cart,
    Dform
  },
  data() {
    return {
      title: "list",
      tableData: [
        { id: 1, name: "iphone x", price: "699" },
        { id: 2, name: "macbook pro", price: "1699" },
        { id: 3, name: "ipad", price: "399" }
      ],
      isAdd: true
    };
  },
  methods: {
    
    add: function(item) {
      if (this.isAdd) {
        this.$refs.cart.add(item);
      } else {
        alert("you can choose at most three items");
        return false;
      }
    },

    addSucessCallback: function(count) {
      if (count > 2) {
        this.isAdd = false;
      }
    }
  }
};
</script>

<style>

.table {
  width: 400px;
  border: 1px solid #ccc;
  margin: 40px auto;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
