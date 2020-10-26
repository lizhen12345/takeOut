<template>
<div>
  <div class="shopcart">
    <div class="content">
      <div class="content-left"  @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">${{totalPrice}}</div>
        <div class="desc">另需要配送费${{deliveryPrice}}</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="[paydesc === '去结算'? 'enough' : 'not-enough']">{{paydesc}}</div>
      </div>
    </div>
    <div class="ball-contain">
      <div v-for="(ball,index) in balls" :key="index">
        <transition @before-enter="beforeDrop" @enter='dropping' @after-enter='afterDrop' name="drop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name='fade'>
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="list">
          <ul>
            <li class="food" v-for="(food,index) in selectFoods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>${{food.count*food.price}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food='food'></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
  <transition name="fade">
    <div class="list-mark" v-show="listShow" @click="hideList"></div>
  </transition>
</div>
</template>

<script type='text/ecmascript-6'>
import cartcontrol from '../cartcontrol/cartcontrol'
import BScroll from "better-scroll";
export default {
  props: {
    selectFoods: {
      //传入一个数组，里面包含每个被选中货物的价格和数量，没有传入的话，返回一个空数组。
      type: Array,
      default() {
        return [];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      //定义一个数组来控制小球的状态，多个对象表示同时做下滑的小球
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold:true//购物车折叠状态，默认是折叠
    };
  },
  computed: {
    totalPrice() {
      //计算总的价钱
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });

      return total;
    },
    totalCount() {
      //计算买的总的数量
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    paydesc() {
      //根据总的价钱来决定右侧输出什么
      if (this.totalPrice === 0) {
        return "$" + this.minPrice + "起送";
      } else if (this.totalPrice > 0 && this.totalPrice < this.minPrice) {
        let dff = this.minPrice - this.totalPrice;
        return "还差$" + dff + "元配送";
      } else {
        return "去结算";
      }
    },
    listShow() {
      if (!this.totalCount){//如果购物是空的，置为折叠状态
        this.fold = true
        return false
      }
      let show = !this.fold//当我不点击购物篮时，show永远是flase，即不会展示具体购物车页面，当我点击购物篮时
      //console.log('show',show)//就会调用toggleList函数，使fold为flase（前提是有物品），show为ture就会执行下面的if，使购物篮可滚动
      if (show){
        this.$nextTick(() => {
          if(!this.scroll){
            
              this.scroll = new BScroll(this.$refs.list,{click:true})
            
          }
          else{
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  },
  methods: {
    toggleList() {
      if (!this.totalCount){
        return
      }
      this.fold = !this.fold
      // console.log('fold',this.fold)
    },
    empty() {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    hideList(){
      this.fold=!this.fold
    },
    pay() {
      if (this.totalPrice<this.minPrice){
        return
      }
      window.alert(`去支付${this.totalPrice}元`)//在dom的函数中添加stop来阻止冒泡事件，（当点击pay，toggleList也被触发）
    },
    drop(el) {
      //  console.log('target',el)// 这个输出可以证明我从子组件shopcart中访问到了和其同一个父组件的子组件cartcontrol的值，也就是我点击的dom元素
      for (let i = 0; i < this.balls.length; i++) {
        //取到我点击的小球，将其值变为true并放到dropballs中
        let ball = this.balls[i]; //改变ball中的show值，balls[i]中的值也改变了，只是因为这是一个引用传递而不是值传递，两者指向的是同一个内存地址
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
            // console.log('balls',this.balls)
            // console.log('dropBalls',this.dropBalls)
            
          return;
        }
      }
    },
    beforeDrop(el) {
      let count =this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let pos = ball.el.getBoundingClientRect();//获得点击的图标对于视口偏移的位置
          // console.log(pos);
          let x=pos.left-32;//减去小球的宽度才是在水平方向的实际偏移
          let y=-(window.innerHeight-pos.top-22)
          el.style.display=''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`//外层元素做纵向的动画，y是变量
          el.style.transform = `translate3d(0,${y}px,0)`
          // console.log(el)
          let inner =el.getElementsByClassName('inner-hook')[0]
          // console.log('inner',inner)
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`//内层元素做横向的动画，x是变量
          inner.style.transform = `translate3d(${x}px,0,0)`
          // console.log('inner',inner)
        }
      }
    },
    dropping(el,done){
      
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight; // 触发重绘html
      this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner =el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
          el.addEventListener('transitionend',done)
          
      })
    },
    afterDrop(el){
        
        let  ball = this.dropBalls.shift()
        if (ball){
            ball.show = false
            el.style.display='none'
        }
    }
  },
  components:{
    cartcontrol
  }
  
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>

@import '../../common/stylus/mixin'
.shopcart {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 50;
  height: 48px;

  .content {
    display: flex;
    background: #141d27;
    font-size: 0;

    .content-left {
      flex: 1;

      .logo-wrapper {
        display: inline-block;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        vertical-align: top;
        box-sizing: border-box;
        background: #141d27;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          text-align: center;
          background: #2b343c;

          &.highlight {
            background: rgb(0, 160, 220);
          }

          .icon-shopping_cart {
            font-size: 24px;
            line-height: 44px;
            color: rgba(255, 255, 255, 0.4);

            &.highlight {
              color: rgb(255, 255, 255);
            }
          }
        }

        .num {
          position: absolute;
          top: 0;
          right: 0;
          height: 16px;
          width: 24px;
          text-align: center;
          line-height: 16px;
          font-size: 9px;
          font-weight: 700;
          color: rgb(255, 255, 255);
          background-color: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          border-radius: 16px;
        }
      }

      .price {
        display: inline-block;
        vertical-align: top;
        box-sizing: border-box;
        margin-top: 12px;
        padding-right: 12px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
        border-right: solid 1px rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.4);

        &.highlight {
          color: rgb(255, 255, 255);
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.1);
        font-weight: 300;
      }
    }

    .content-right {
      flex: 0 0 105px;
      width: 105px;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        font-weight: 700;

        &.not-enough {
          background: #2b343c;
        }

        &.enough {
          background: #00b43c;
          color: #fff;
        }
      }
    }
  }

  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
      // 动画抛物曲线(贝塞尔曲线)

      // 的配置,http://cubic-bezier.com/#.17,.67,.83,.67
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgb(0, 160, 220);
        transition: all 0.4s linear;
      }
    }
  }
  .shopcart-list{
    position :absolute
    top :0
    left :0
    z-index :-1
    width :100%
    transform :translate3d(0,-100%,0)
    &.fade-enter-active,&.fade-leave-active{
      transition :all 0.5s linear
    }
    &.fade-enter-to,&.fade-leave{
      transform :translate3d(0,-100%,0)
    }
    &.fade-enter,&.fade-leave-to{
      transform :translate3d(0,0,0)
    }
    .list-header{
      height :40px
      line-height :40px
      padding :0 18px
      background :#f3f5f7
      border-bottom :1px solid rgba(1,17,27,0.1)
      .title{
        float :left
        font-size :14px
        color :rgb(7,17,27)
      }
      .empty{
        float :right
        font-size :12px
        color :rgb(0,160,20)
      }
    }
    .list-content{
      padding :0 18px
      max-height :217px
      overflow :hidden
      background :#fff
      .food{
        position :relative
        padding :12px 0
        box-sizing :border-box
        border-1px(rgba(7,17,27,0.1))
        .name{
          line-height :24px
          font-size :14px
          color :rgb(7,17,27)
        }
        .price{
          position :absolute
          right :90px
          bottom :12px
          line-height :24px
          font-size :14px
          font-weight :700
          color :red
        }
        .cartcontrol-wrapper{
          position :absolute
          bottom :6px
          right :0
        }
      }
    }
  }
}
.list-mark{
  position :fixed
  top :0
  left :0
  width :100%
  height :100%
  z-index :40
  opacity :1
  backdrop-filter :blur(10px)
  background :rgba(7,17,27,0.6)
  &.fade-enter{
    opacity :0
    background :rgba(7,17,27,00)
  }
  &.fade-enter-active{
    transition :all 0.5s
  }
  &.fade-leave{
    opacity :1
    background :rgba(7,17,27,0.6)
  }
  &.fade-leave-active{
    transition :all 0.5s
  }
  &.fade-leave-to{
    opacity :0
    background :rgba(7,17,27,0)
  }
}
</style>