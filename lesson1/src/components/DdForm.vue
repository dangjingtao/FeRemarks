<template>
  <div class="form" :model="model">
    <slot></slot>
  </div>
</template>

<script>
export default {
  // 类似data，但provide可跨层级传递内容给子孙
  provide() {
    return {
      form: this //表单的实例可传递给后代
    };
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: {
      type: Object
    } //规则不需要额外指定
  },
  methods: {
    async validate(callback) {
      //   执行表单所有校验,结果是由promise组成的数组。
      let tasks = this.$children.filter(x => x.prop).map(x => x.validate());
      // 接下来拿到的是由纯粹布尔值组成的数组。
      const results = await Promise.all(tasks);
      if (results.some(valid => !valid)) {
        callback(false);
      } else {
        callback(true);
      }
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