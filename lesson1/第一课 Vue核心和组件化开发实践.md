



## 第一讲 Vue核心和组件化开发实践

---

看完本讲内容，大多数前端初学者就会自以为是地可以在简历写自己"熟练(精通)vue开发“了，最不济也会给自己加个“熟悉掌握vue业务逻辑”的帽子。而对这门课程来说，一切刚刚开始。

### 1. vue核心api：以购物车为例

**需求：**实现一个购物车(cart)

首先通过vue-cli<a href="[https://dangjingtao.github.io/2018/08/30/%E5%9F%BA%E4%BA%8Evue%E7%9A%84%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA/](https://dangjingtao.github.io/2018/08/30/基于vue的项目搭建/)">新建一个项目</a>。

然后在page下面做一个shop.vue，在路由中注册该页面。即可在上面做修改。

#### 数据（插值）绑定:双大括号

```
data（）{
	return {
		title:'cart'
	}
}

// 应用
<h1>{{title}}</h1>
```

#### 属性绑定（:xxx）

```
<h1 :title="title">{{title}}</h1>
```

效果如下：

![](https://wxt.sinaimg.cn/mw1024/683b6b23gy1g2m2kq3fffj207m04sq2z.jpg)

#### 指令

- `v-if`：v-if=布尔值，为真时才展示

你可以给`h1`加个`isConsumer`的布尔值：

```
<h1 :title="title" v-if="isConsumer">{{title}}</h1>
```

如果为false，就不会渲染了。

- `v-for`：直接挂载在子元素上，如`v-tor="item in items"`

```
<table  class="table">
      <tbody>
        <tr >
          <th width="10%">id</th>
          <th width="50">name</th>
          <th width="20%">price</th>
        </tr>

        <tr v-for="item in tableData" :key="item.id">
          <td>{{item.id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.price}}</td>
        </tr>
      </tbody>
    </table>
    
    // ...
    
 data() {
    return {
      // ...
      tableData:[
        {id:1,name:'iphone x',price:'699'},
        {id:2,name:'macbook pro',price:'1699'},
        {id:3,name:'ipad',price:'399'},
      ]
    };
  }
```

如下图

![](<http://markdown.djtao.net/imgs/161556715607_.pic.jpg>)

if比for优先级高。不建议两个一起写在同一个标签上。

#### 用户输入（表单）

通过`v-model`实现"双向"绑定。

```
<input type="text" v-model="goods">
```

实际上是一个语法糖。

#### 请求数据的时机：created和mounted

created运行时，还未挂载到DOM，不能访问到$el属性，可用于初始化一些数据，但和DOM操作相关的不能在created中执行；monuted运行时，实例已经挂在到DOM，此时可以通过DOM API获取到DOM节点。

建议在created阶段请求。除非要用到dom操作。

#### 事件处理

```

<button @click="submit">

methods:{
	submit:function(){
		// 校验和处理逻辑
	}
}
```

和react不同，你可以写`@click="submit(data)"直接传参，无需做任何处理。

默认来说要传事件`e`，可以`bbb(e,data)`

或者`$event`

#### 练习：完整实现购物车

> 实现购物车，有上架商品车功能。

##### 添加商品列表

写一个表单，加点样式：

```
    <div class="form">
      <div class="form-item">
        <div style="width:40%;text-align:right;">trade name&nbsp;&nbsp;</div>
        <input class="input" type="text" v-model="goods" placeholder="please type the trade name" /> 
      </div>
      <div class="form-item">
        <div style="width:40%;text-align:right;">price&nbsp;&nbsp;</div>
        <input class="input" type="number" v-model="price" placeholder="please type the price" /> 
      </div>

      <div class="form-item">
        <button style="display::block;width:90%;margin:auto;" @click="submit">confirm</button>
      </div>
    </div>
// ...

```

核心方法(添加列表)

```
methods:{
    submit:function(){
      if(this.goods){
        this.tableData.push({
          id:this.tableData.length+1,
          name:this.goods,
          price:this.price,
          numbers:1
        });
        this.goods='';
        this.price='';
      }
    },
    // ...
}
```

##### 添加购物车

这里有个加入购物车的按钮,新建一个表格，绑定cartlist。

```
<table class="table">
    <tbody>
      <tr>
        <th width="10%">id</th>
        <th width="20">name</th>
        <th width="20%">unit-price</th>
        <th width="30%">count</th>
        <th width="20%">price</th>
      </tr>

      <tr v-for="item in cartlist" :key="item.id">
        <td>{{item.id}}</td>
        <td>{{item.name}}</td>
        <td>${{item.price}}</td>
        <td>{{item.numbers}}</td>
        <td>${{item.numbers*item.price}}</td>
      </tr>
    </tbody>
  </table>
```

回顾购物车逻辑：

- 当不存在，加入购物车
- 当存在，numbers+1

- 根据单价计算每个商品花费
- 根据

给add加个处理函数：

```
add:function(item){
      // 深度拷贝
      item=JSON.parse(JSON.stringify(item));
      let _index=this.cartlist.map(x=>x.id).indexOf(item.id);
      if(_index<0){
        item.numbers=1;
        this.cartlist.push({...item,numbers:1})
      }else{
        this.cartlist[_index].numbers+=1;
      }      
    }
```

对于es6比较熟悉的话，你也可以用find方法简单查重。

```
this.cartlist.find(x=>x.id==item.id)
```

##### 计算总价

给表格加一个tfoot

---



### 2. 组件化

> 在上面的实现中，我们用了类似element ui的组合方式（form/formItem）。
>
> 通用组件：常见的ui库。业务组件：平时自己写的。便于复用维护
>
> 那么组件通信有什么花式呢？

组件化工作从重构开始。

#### 组件由重构开始

把cart的相关方法和数据都放到单独的文件中：在components下新建一个`Cart.vue`

在引入时，关注引入和注册：

```
import Cart from './../components/Cart.vue';
export default {
  name: "App",
  components: {
      Cart,
  },
  //...
```

那么就可以在shop下的template中引用这个组件了。

现在又个问题：shop页面下的添加到购物车（add to cart）绑定了一个处理逻辑。如何教给子组件去使用这个方法呢？

#### 属性传参

注册属性，数据默认类型和值

```
// shop.vue
<cart :add="add"></cart>

// cart.vue
export default {
  props: {
      add: {
          type: Function,//默认数据类型
          default: ()=>{} //默认值
      },
  },
```

在子组件中直接修改属性，也会触发父组件对数据视图的重新渲染。

add是被传过来了，但是add里的this不是指向组件内的this，而是shop内的this。所以该方案不能满足业务需求。

#### ref传参（不推荐但总是会用）

ref方案是获取组件的真实节点。这样就获得了item和购物车组件内的add方法。

```
// shop.vue
<cart ref="cart"></cart>

	// add逻辑
	this.$refs.cart.add(item)
```

此方案缺点是耦合。因为操作dom而不被推荐。

#### 派发事件

##### 总线模式

项目的`main.js`，也就是在vue初始化时，设置一个新的"bus"方法。

```
// main.js
Vue.prototype.bus=new Vue()

// shop.vue 派发事件
add:function(item){
	this.$bus.$emit.on('add',item)
}

// cart.vue 响应事件
created(){
	this.$bus.$emit.on('add',item=>{
		this.add(item)
	})
}
```

在这个过程中，bus创建了一个新的`vue`实例，所有页面/组件都能访问到。父组件向全局派发了一个名为`add`的自定义事件，同时带上了参数item，关心这个事件的子组件（cart.vue）接受了`add`事件和参数，就可以在组件内部进行处理了。

通过这种方法，可以以解耦合的方式实现完全不相干的两个组件传值。但是不好之处在于：多了一个全局的Vue实例。

##### 子组件传父组件

设想这么一个场景，假如购物单里的东西是限量发行的，用户可以买任意n（n<=3）种，但也只能3个。多了不给。

此需求的业务逻辑是：子组件传参成功后，需要通知父组件一个消息，父组件需要判断来决定是否添加（购物车为空，允许购买，购物车本商品已经达到上限，不让购买）

还是派发事件。

子组件中，设置一个count值，在处理方法add中，处理完之后，给父组件派发一个事件

```
		add: function(item) {
      // 深度拷贝
      item = JSON.parse(JSON.stringify(item));
      let _index = this.cartlist.map(x => x.id).indexOf(item.id);
      if (_index < 0) {
        this.cartlist.push({ ...item, numbers: 1 });
      } else {
        this.cartlist[_index].numbers += 1;
      }
      this.count+=1;
      this.$emit('addSuccess',this.count)
    }
```

同时，父组件加入`isAdd`判断，响应事件，触发回调函数。

```
		// shop.vue
		<cart ref="cart" @addSuccess="addSucessCallback"></cart>
		
		// ...
		add: function(item) {
        if(this.isAdd){
            this.$refs.cart.add(item)
        }else{
            alert('you can choose at most three items');
            return false;
        }
    },

    addSucessCallback:function(count){
        if(count>2){
            this.isAdd=false;
        } 
    }
```

当超过三个，就不许继续买了。

#### 传参模式的选择：

子传父，最好就是派发事件。

父传子当然用props

规模较大时使用**Vuex**是最好的解决方案。



---



### 3. 其它api

#### 动态样式

需求描述：取消勾选一个商品。设置样式为灰底。选中后消失。

```
<tr v-for="item in cartlist" :key="item.id" :style="{background:item.check?'':'#f5f5f5'}">
        // ...
        <td><input type="checkbox" v-model="item.check" @change="handleCheck($event,item)" /></td>
      </tr>
      
      
handleCheck:function(e,item){
        item.check=e.target.checked;
    },
```

#### 计算属性

这个购物车中没有计算总价，要求每计算所有勾选的商品总价。

每次加购物车时，都默认选中：

```
this.cartlist.push({ ...item, numbers: 1,check:true });
```

现在把它实现了。在这里应用es6的reduce方法：

```
<tfoot v-if="cartlist.length>0" border=“1”>
        <td colspan="5" align="right">total</td>
        <td>${{total}}</td>
</tfoot>

//...
computed: {
      total() {
          let result=this.cartlist.reduce((sum,x)=>{          
              if(x.check){
                  console.log(parseInt(x.price)*x.numbers)
                  sum+=parseInt(x.price)*x.numbers;
              }
              return sum
          },0);
       
          return result;
      }
  },
```

#### 监听：watch

假设我从sessionStorage中获取初始数据：

```
cartlist: JSON.parse(sessionStorage.cart)||[],
```

每次数据变动时，都更新sessionStorage。

这种操作非常麻烦，如果是这样，我得插几个眼？

监听数据cartlist变化，默认只看第一层，但如果我要监听第三层，就得加属性了。

```
watch: {
    cartlist: {
      deep: true,
      handler:function(newValue, oldValue) {
        console.log(newValue);
        sessionStorage.cart = JSON.stringify(newValue);
      }
    }
  },
```

自此。购物车所有功能顺利实现。



---



### 4. 组件库的使用:Element ui表单验证的使用和设计

#### element UI

Element UI的表单组件是一个很经典的表单实现。

![](http://markdown.djtao.net/imgs/1011161-20190502122953692-1861547625.png)

实现代码如下：

```
<el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="活动名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
</el-form>
```

相信UI库的使用都没什么难度，这里主要关注这个表单组件的实现。

- 数据模型（model，比如goods，price），

- 校验规则（rules）是一个分字段的对象，比如：`goods:[{required:true,message:'please type the goods'}]`
- form-item组件会带一个prop?用意何在？

思考如下问题：

> el-form-item如何知道校验规则？表单全局校验是如何实现的
>
> value绑定，input事件



#### 设计form组件

接下来回到增加列表的表单中，继续造轮子。

把提交部分的表单独立为一个组件叫做Dform.vue。把相关方法数据都独立出来。

![](http://markdown.djtao.net/imgs/WechatIMG18.png)

#####d-form-input 

继续独立一个"d-form-input"组件。

实现双向绑定由2点决定：

- 子组件通知父组件发生了input事件
- 父组件响应事件

```
<template>
    <input :type="type" :value="value" @input="onInput($event)" />
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
        this.$emit('input',e.target.value)
      }
  },
};
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
}
</style>
```

在dform组件中这么调用：

```
<d-input type="text" :value="model.goods" @input="model.goods=$event"/>
<!-- 等效于<d-input type="text" v-model="model.goods"/> -->
```

就实现了双向数据绑定！



##### d-form-item

d-form-item主要完成以下职责：

- 接收一个label，当存在时，可以展示出来
- 提供一个插槽（slot）存放可能的表单控件（input，button）

匿名插槽直接用`<slot></slot>`即可。具名插槽则需要这么写

```
// vue 2.6+

// 组件内
<slot name="foo"></slot>

// 使用时
<template v-slot:foo>
	foo content
</template>
```



- 对输入过程中的内容进行校验。

```
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
export default {
  props: {
    label: {
      type: String,
      default: ""
    }
  },
  data() {
      return {
          errmsg: ''
      }
  },
};
</script>

<style  scoped>
.form-item {
  display: flex;
  margin: 10px 20px;
}
.red{
    color: brown
}
</style>
```



​	有了这两个组件，那dform组件实际上写成这样：

```
<template>
  <div class="form" :model="model">

    <d-form-item label="goods">
      <d-input type="text" :value="model.goods" @input="model.goods=$event"/>
    </d-form-item>

    <d-form-item label="price">
      <d-input type="number" :value="model.price" @input="model.price=$event"/>
    </d-form-item>

    <d-form-item>
      <button style="display::block;width:90%;margin:auto;" @click="submit">confirm</button>
    </d-form-item>

  </div>
</template>
```



#### 校验规则

##### 继续重构

dform实际上是业务组件，和element ui相比，外层的form组件最好也应该封装重构。设想一个通用组件`dd-form`，应当具有的功能有：

- 允许插槽存放。
- 绑定model/rule。
- 

d-form-item是最直接拿到表单校验的组件。拿取的方法：通过指定一个prop给它。

dform

```
<dd-form :model="model" :rules="rules" >
    <d-form-item label="goods" prop="goods">
      <d-input type="text" :value="model.goods" @input="model.goods=$event" />
    </d-form-item>

    <d-form-item label="price" prop="price">
      <d-input type="number" :value="model.price" @input="model.price=$event"/>
    </d-form-item>

    <d-form-item>
      <button style="display::block;width:90%;margin:auto;" @click="submit">confirm</button>
    </d-form-item>

  </dd-form>
```

dd-form要把校验规则传给formitem，可使用provide/inject方式。

```
<template>
  <div class="form" :model="model">
    <slot></slot>
  </div>
</template>

<script>

export default {
  // 类似data，provide可跨层级传递内容给子孙
  provide(){
    return {
      form:this //表单的实例可传递给后代
    }
  },
  props: {
    model:{
      type:Object,
      required:true
    },
    rules:{
        type:Object
    } //规则不需要额外指定
  },
  methods: {
   
  }
};
</script>

<style scoped>
.form {
  width: 60%;
  margin: 0 auto;
}

</style>
```

form-item：

```
//子组件中引入
  inject: {
    form: {
      default: () => {
        return {}
      }
    }
  },
```



##### d-input通知d-form-item发生了校验事件

很像jq的操作，可来实现向直系前一代祖先发送通知：

```
onInput(e) {
        // 通知父组件发生了input事件
        this.$emit('input',e.target.value);

        // 通知form-item做校验
        this.$parent.$emit('validate',e.target.value)
}
```



##### d-form-item响应校验事件

d-form-item用接收validate事件后，开启监听：

```
export default {
  props: {
    label: {
      type: String,
      default: ""
    }
  },
  created () {
      this.$on('validate',this.validate);
  },
  data() {
      return {
          errmsg: ''
      }
  },
  methods: {
      validate(e) {
      		// 不直接用e的原因是，不一定要出发onInput才校验，可能直接进行全局校验。
          console.log('执行校验：'+this.form.model[this.prop])
          // 获取父代发出的校验规则
          const descriptor={
              [this.prop]:this.form.rules[this.prop]
          }
      }
  },
};
```

运行程序，在每次输入时都会校验是否合理。



##### async-validator

Element ui 的校验库用的是async-validator 。它 是一个异步验证的库，需要传入要验证的数据和验证规则

官方链接 <https://github.com/yiminghe/async-validator>

你可以定义一个条件来对字段进行校验

```
      rules:{
        goods:[{required:true,message:'goods could not be null'}],
        price:[{required:true,message:'price could not be mull'}]
      }
```

现在就来安装运用这个库。

```
npm install async-validator 
```

引入

```
import Validator from 'async-validator';
```

在validate方法中，可以这样用

```
      validate(e) {
          console.log('执行校验：'+e);         
          // 获取校验规则,实际输出可能是{goods:{required:true,...}}
          const descriptor={
              [this.prop]:this.form.rules[this.prop]
          }
          //校验器
          const validator=new Validator(descriptor);
          let a=validator.validate({[this.prop]:this.form.model[this.prop]},err=>{
              if(err){
                  this.errmsg=err[0].message;
              }else{
                  console.log('校验成功')
              }
          });
      }
```

那么校验就实现了。为了未来全局操作的需要，validate需要设置一个返回值,成功为true，反之为false。

如前所述，async-validator是一个异步校验库。设置返回值需要用promise...resolve

```
	validate(e) {
      return new Promise(resolve => {
        console.log("执行校验：" + e);
        // 获取校验规则 实际输出可能是{goods:{required:true,...}}
        const descriptor = {
          [this.prop]: this.form.rules[this.prop]
        };
        //校验器
        const validator = new Validator(descriptor);
        validator.validate({ [this.prop]: e }, err => {
          if (err) {
            this.errmsg = err[0].message;
            resolve(false)
          } else {
            console.log("校验成功");
            this.errmsg
            resolve(true)
          }
        });

      });
    }
```



#### 全局校验

凡事先搞清楚谁去做，做什么，什么时候做。

全局校验很明显，就是在提交时。操作的主体当然是`dd-form`（可通过this.refs.form）.

业务逻辑：必须判断所有字段都通过校验。具体做法睡觉哦是对所有`d-form-item`进行循环校验。

问题来了，dd-form包含一个button，但button的父组件没有设置prop值因此不参与校验。判断依据在于，谁设置了prop，谁就需要校验。

在dd-form中定义校验方法

```
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
```

在dform中

```
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
```

最后对submit方法进行重构：

```
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
```

那么这个项目就终于，，做完了。



---

本节完。









