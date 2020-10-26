<template>
  <div>
    <!-- <img src="./assets/logo.png"> -->
    <v-header :seller='seller'></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
        <div class="tab-item">
         <router-link to="/seller">商家</router-link>
        </div>
    </div>
    <keep-alive>
      <router-view :seller='seller'></router-view>
    </keep-alive>
  </div>
</template>
 
<script>
import header from './components/header/header'
import { urlParse } from "./common/js/util";
const ERR_OK=0;
export default {
  data() {
     return {
       seller:{
         id :(() => {
           let queryParam = urlParse();
          //  console.log(queryParam)
           return queryParam.id//一开始seller是有个id的，id是从url参数里边拿的，
                              // 我们需要写一个立即执行的函数：urlParse()
                              // 通过一个方法拿到queryParam，拿到queryParam以后，再去拿他的id
         })()
         
       }
     }
  },
  created() {
      this.$http.get("/api/seller?id="+ this.seller.id).then(response => {
        response = response.body;
        // console.log('response.seller',response);
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data);//给对象扩展属性
          console.log(this.seller)
          // console.log('seller', this.seller)
        }
      });
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import "./common/stylus/mixin.styl"
    .tab
      background :white
      display: flex
      width: 100%
      height: 40px
      line-height : 40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
          flex : 1
          text-align :center
          &>a
            display:block
            font-size :14px
            color:rgb(77,85,93)
            &.active
             color :rgb(240,20,20)

          &.content
            color:red
            text-align :center
</style>
