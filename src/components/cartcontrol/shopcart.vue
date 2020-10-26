<template>
  <div>
    <div class="shopcart">
      <div
        @click="toggleList"
        class="content"
      >
        <div class="content-left">
          <div class="logo-wrapper">
            <div
              :class="[{'highlight':totalCount>0}]"
              class="logo"
            >
              <i
                :class="[{'highlight':totalCount>0}]"
                class="icon-shopping_cart"
              ></i>
            </div>
            <div
              class="num"
              v-show="totalCount>0"
            >{{totalCount}}</div>
          </div>
          <div
            :class="[{'highlight':totalPrice>0}]"
            class="price"
          >￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div
          @click.stop.prevent="pay"
          class="content-right"
        >
          <div
            :class="payClass"
            class="pay"
          >{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <div
          :key="index"
          v-for="(ball,index) in balls"
        >
          <transition
            @after-enter="afterDrop"
            @before-enter="beforeDrop"
            @enter="dropping"
            name="drop"
          >
            <div
              class="ball"
              v-show="ball.show"
            >
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div
          class="shopcart-list"
          v-show="listShow"
        >
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span
              @click="empty"
              class="empty"
            >清空</span>
          </div>
          <div
            class="list-content"
            ref="listContent"
          >
            <ul>
              <li
                :key="index1"
                class="food"
                v-for="(food,index1) in selectFoods"
              >
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol
                    :food="food"
                    @add="addFood"
                  ></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div
        @click="hideList"
        class="list-mask"
        v-show="listShow"
      ></div>
    </transition>
    <exercise></exercise>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import exercise from 'components/exercise/exercise'

export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [
          {
            price: 10,
            count: 1
          }
        ]
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
      balls: [
        // 代表5个小球
        // 五个是为了生成一定数量的小球来作为操作使用,按照小球动画的速度,一般来说五个也可以保证有足够的小球数量来运行动画
        // 即连续按添加商品图标时，在屏幕上可看到5个连续下降的小球
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
      dropBalls: [], // 代表正在运行的小球
      fold: true
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach(food => {
        total += food.price * food.count
      })
      return total
    },
    totalCount() {
      let count = 0
      this.selectFoods.forEach(food => {
        count += food.count
      })
      return count
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}起送`
      } else {
        return '去结算'
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow() {
      return this.showlist()
    }
  },
  methods: {
    showlist() {
      if (!this.totalCount) {
        this.fold = true
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, { click: true })
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    },
    // 触发一次事件就会将所有小球进行遍历,由父组件中的cartcontrol组件中的addFood触发
    drop(el) {
      // console.log(el);
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          // 将false的小球放到dropBalls
          ball.show = true
          ball.el = el // 设置小球的el属性为一个dom对象
          this.dropBalls.push(ball)
          return
        }
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    hideList() {
      this.fold = true
    },
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0
      })
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付${this.totalPrice}元`)
    },
    addFood(target) {
      this.drop(target)
    },
    beforeDrop(el) {
      console.log(el)
      // 这个方法的执行是因为这是一个vue的监听事件
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect() // 获取小球的相对于视口的位移(小球高度)
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22) // 负数,因为是从左上角往下的方向
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          // 处理内层动画
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    dropping(el, done) {
      // console.log(el)
      // 这个方法的执行是因为这是一个vue的监听事件
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight // 触发重绘html
      this.$nextTick(() => {
        // 让动画效果异步执行,提高性能
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        // 处理内层动画
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
        el.addEventListener('transitionend', done) // Vue为了知道过渡的完成，必须设置相应的事件监听器。
      })
    },
    afterDrop(el) {
      // 这个方法的执行是因为这是一个vue的监听事件
      let ball = this.dropBalls.shift() // 完成一次动画就删除一个dropBalls的小球
      // console.log(ball);
      if (ball) {
        ball.show = false
        el.style.display = 'none' // 在左下角购物车内隐藏小球
      }
    }
  },
  components: {
    cartcontrol,
    exercise
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;

  .content {
    display: flex;
    background: #141d27;
    font-size: 0;
    color: rgba(255, 255, 255, 0.4);

    .content-left {
      flex: 1;

      .logo-wrapper {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
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
            line-height: 44px;
            font-size: 24px;
            color: #80858a;

            &.highlight {
              color: #fff;
            }
          }
        }

        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }

      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        font-weight: 700;

        &.highlight {
          color: #fff;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: 10px;
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
        font-weight: 700;

        &.not-enough {
          background: #2b333b;
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

  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    transform3d(0, -100%, 0);

    &.fold-enter-active, &.fold-leave-active {
      transition: all 0.5s;
    }

    &.fold-enter, &.fold-leave-active {
      transform3d(0, 0, 0);
    }

    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      border-bottom: 2px solid rgba(7, 17, 27, 0.1);
      background: #f3f5f7;

      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }

    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;

      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        border-1px(rgba(7, 17, 27, 0.1));

        .name {
          font-size: 14px;
          line-height: 24px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          font-size: 14px;
          line-height: 24px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
}

.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  backdrop-filter: blur(10px);
  opacity: 1;
  background: rgba(7, 17, 27, 0.6);

  &.fade-enter-active, &.fade-leave-active {
    transform: all 0.5s;
  }

  &.fade-enter, &.fade-leave-active {
    opacity: 0;
    background: rgba(7, 17, 27, 0.6);
  }
}
</style>
