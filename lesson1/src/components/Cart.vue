<template>
  <table class="table">
    <tbody>
      <tr>
        <th width="10%">id</th>
        <th width="20">name</th>
        <th width="20%">unit-price</th>
        <th width="20%">count</th>
        <th width="20%">price</th>
        <th width="10%">check</th>
      </tr>

      <tr v-for="item in cartlist" :key="item.id" :style="{background:item.check?'':'#f5f5f5'}">
        <td>{{item.id}}</td>
        <td>{{item.name}}</td>
        <td>${{item.price}}</td>
        <td>{{item.numbers}}</td>
        <td>${{item.numbers*item.price}}</td>
        <td>
          <input type="checkbox" v-model="item.check" @change="handleCheck($event,item)">
        </td>
      </tr>
    </tbody>

    <tfoot v-if="cartlist.length>0" border="“1”">
      <td colspan="5" align="right">total</td>
      <td>${{total}}</td>
    </tfoot>
  </table>
</template>

<script>
export default {
  data() {
    return {
      cartlist: sessionStorage.cart ? JSON.parse(sessionStorage.cart) : []
    };
  },
  watch: {
    cartlist: {
      deep: true,
      handler:function(newValue, oldValue) {
        console.log(newValue);
        sessionStorage.cart = JSON.stringify(newValue);
      }
    }
  },
  computed: {
    total() {
      let result = this.cartlist.reduce((sum, x) => {
        if (x.check) {
          sum += parseInt(x.price) * x.numbers;
        }
        return sum;
      }, 0);

      return result;
    }
  },
  created() {},
  methods: {
    handleCheck: function(e, item) {
      item.check = e.target.checked;
    },
    add: function(item) {
      // 深度拷贝
      item = JSON.parse(JSON.stringify(item));
      let _index = this.cartlist.map(x => x.id).indexOf(item.id);
      if (_index < 0) {
        this.cartlist.push({ ...item, numbers: 1, check: true });
      } else {
        this.cartlist[_index].numbers += 1;
      }

      this.$emit("addSuccess", this.cartlist.length);
    }
  }
};
</script>

<style scoped>
.table {
  width: 500px;
  border: 1px solid #ccc;
  margin: 40px auto;
}
.form {
  width: 40%;
  margin: 0 auto;
}
.form-item {
  display: flex;
  margin: 10px 20px;
}
.input {
  display: block;
  width: 100%;
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