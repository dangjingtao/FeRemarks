<template>
  <div class="form-item">
    <div v-if="label" style="width:30%;text-align:right;">
      <span>{{label}}&nbsp;&nbsp;</span>
    </div>
    <!-- 插槽 -->
    <slot></slot>
    <!-- 校验信息 -->
    <div style="width:20%" v-if="errmsg">
      <span class="red">{{errmsg}}</span>
    </div>
  </div>
</template>

<script>
import Validator from "async-validator";
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    prop: {
      type: String
    }
  },
  created() {
    this.$on("validate", this.validate);
  },
  data() {
    return {
      errmsg: ""
    };
  },
  inject: {
    form: {
      default: () => {
        return {};
      }
    }
  },
  methods: {
    validate(e) {
      return new Promise(resolve => {
        console.log("执行校验：" );
        // 获取校验规则 实际输出可能是{goods:{required:true,...}}
        const descriptor = {
          [this.prop]: this.form.rules[this.prop]
        };
        //校验器
        const validator = new Validator(descriptor);
        validator.validate({ [this.prop]: this.form.model[this.prop] }, err => {
          if (err) {
            this.errmsg = err[0].message;
            resolve(false)
          } else {
            console.log("校验成功");
            this.errmsg=''
            resolve(true)
          }
        });

      });
    }
  }
};
</script>

<style  scoped>
.form-item {
  display: flex;
  margin: 10px 20px;
}
.red {
  color: brown;
}
</style>