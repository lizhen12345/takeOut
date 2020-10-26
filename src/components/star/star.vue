<template>
  <div class="star" :class="starType">
    <span v-for="(eachstar,index) in allstar" :class="eachstar" class="staritem" :key="index"></span>
    <!-- <span v-for="(eachstar,index) in allstar" :class="eachstar" class="staritem" :key="index"></span> -->
  </div>
</template>

<script type='text/ecmascript-6'>
const LENGTH = 5;
const ZF_on = "on";
const ZF_half = "half";
const ZF_off = "off"; //定义一些常量

export default {
  // 从header组件中接收size 和score
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starType() {
      return "star-" + this.size; //计算我是需要多大尺寸的星星，动态的设计我的div中的类
    },
    allstar() {
      //动态的根据score分数生成数组result，result作为类的循环数组，在span中应用
      let result = [];
      let score = Math.floor(this.score * 2) / 2;
      // console.log(score)
      let ZHENGSHU = Math.floor(score); //整数部分
      let yushu = score % 1 !== 0; //余数部分
      // console.log('yushu',yushu)
      let i = 0;
      for (i; i < ZHENGSHU; i++) {
        result.push(ZF_on);
      }
      if (yushu) {
        result.push(ZF_half);
      }
      while (result.length < LENGTH) {
        result.push(ZF_off);
      }
      // console.log(result)
      return result;
    }
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin';

.star {
  .staritem {
    display: inline-block;
    background-repeat: no-repeat;
  }

  &.star-48 {
    .staritem {
      display: inline-block;
      margin-right: 22px;
      width: 20px;
      height: 19px;
      background-size: 20px 19px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        bg-image('star48_on');
      }

      &.half {
        bg-image('star48_half');
      }

      &.off {
        bg-image('star48_off');
      }
    }
  }

  &.star-36 {
    .staritem {
      display: inline-block;
      margin-right: 6px;
      width: 15px;
      height: 15px;
      background-size: 15px 15px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        bg-image('star36_on');
      }

      &.half {
        bg-image('star36_half');
      }

      &.off {
        bg-image('star36_off');
      }
    }
  }

  &.star-24 {
    .staritem {
      display: inline-block;
      margin-right: 3px;
      width: 10px;
      height: 10px;
      background-size: 10px 10px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        bg-image('star24_on');
      }

      &.half {
        bg-image('star24_half');
      }

      &.off {
        bg-image('star24_off');
      }
    }
  }
}
</style>