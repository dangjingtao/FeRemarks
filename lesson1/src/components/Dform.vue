<template>
  <dd-form :model="model" :rules="rules" ref="ddform">

    <d-form-item label="goods" prop="goods">
      <d-input type="text" :value="model.goods" @input="model.goods=$event" />
    </d-form-item>

    <d-form-item label="price" prop="price">
      <d-input type="number" :value="model.price" @input="model.price=$event"/>
    </d-form-item>

    <d-form-item>
      <button style="display::block;width:90%;margin:auto;" @click="submit('ddform')">confirm</button>
    </d-form-item>

  </dd-form>
</template>

<script>
import DdForm from './DdForm.vue';
import DInput from "./DInput.vue";
import DFormItem from './DFormItem.vue';
export default {
  components: {
    DInput,
    DFormItem,
    DdForm 
  },
  props: {
    tableData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      model:{
        goods: "",
        price: '0'
      },
      rules:{
        goods:[{required:true,message:'goods could not be null'}],
        price:[{required:true,message:'price could not be mull'}]
      }
    };
  },
  methods: {
    
    input: function(e) {
      this.model.goods = e;
    },
    submit: function(form) {

      this.$refs[form].validate(valid=>{
          if(valid){
            this.tableData.push({
            id: this.tableData.length + 1,
            name: this.model.goods,
            price: this.model.price,
            numbers: 1
          });
          this.model.goods = "";
          this.model.price = "";
        }else{
          alert('填完再提交');
          return false
        }
      })
      
    }
  }
};
</script>

<style scoped>
.form {
  width: 60%;
  margin: 0 auto;
}

</style>