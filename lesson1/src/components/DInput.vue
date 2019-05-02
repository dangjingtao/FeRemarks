<template>
    <div class="input-wrap">
        <input :type="type" :value="value" @input="onInput($event)" />
    </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "text"
    },
    value:{
        type:String,
        default:''
    }
  },

  methods: {
      onInput(e) {
        // 通知父组件发生了input事件
        this.$emit('input',e.target.value);

        // 通知form-item做校验
        this.$parent.$emit('validate',e.target.value)
      }
  },
};
</script>

<style scoped>
.input-wrap{
    width: 50%
}
.input {
  display: block;
  width: 100%;
}
</style>