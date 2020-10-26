<template>
  <div class="rating-select">
    <div class="rating-type">
      <span class="block positive" :class="{'active':selectType===2}" @click="select(2,$event)">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span class="block positive" :class="{'active':selectType===0}" @click="select(0,$event)">
        {{desc.positive}}
        <span class="count">{{positiveNum}}</span>
      </span>
      <span class="block negative" :class="{'active':selectType===1}" @click="select(1,$event)">
        {{desc.negative}}
        <span class="count">{{negativeNum}}</span>
      </span>
    </div>
    <div class="swith">
      <span class="icon-check_circle" :class="{'active':onlyContent}" @click="toggleContent($event)"></span>
      <span class="name">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  props: {
    ratings: {
      //接收父组件的评论内容
      type: Array,
      default() {
        return [];
      }
    },
    selectType: {
      //接收父组件中我具体想看什么内容，是所有，还是吐槽评论，还是推荐评论
      type: Number,
      default: ALL
    },
    onlyContent: {
      //接收父组件中我是否只看有内容的评论，true是只看
      type: Boolean,
      default: false
    },
    desc: {//每一块包含的内容
      type: Object,
      default() {
        return {
          all: "全部",
          positive: "满意",
          negative: "不满意"
        };
      }
    }
  },
  computed:{
      positiveNum(){//计算好评论数
          let Num=0
          this.ratings.forEach((each) => {
              if(each.rateType === POSITIVE){
                  Num++
              }
          })
          return Num
      },
      negativeNum(){
          let Num=0
          this.ratings.forEach((each) => {
              if(each.rateType === NEGATIVE){
                  Num++
              }
          })
          return Num
      }
  },
  methods: {

    select(type, event) {
      if (!event._constructed) {
        //去掉自带的click事件点击，即在pc端直接返回
        return;
      }
      this.$emit("select", type); //监听事件，回调函数给父组件
    },
    toggleContent(event) {
      if (!event._constructed) {
        //去掉自带的click事件点击，即在pc端直接返回
        return;
      }
      this.$emit("toggle", this.onlyContent);
     
    }
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin';

.rating-select {
  .rating-type {
    padding: 18px 0;
    margin-left: 18px;
    border-1px(rgba(7, 17, 27, 0.1));
    font-size: 0;

    .block {
      display: inline-block;
      padding: 8px 12px;
      margin-right: 8px;
      border-radius: 1px;
      font-size: 12px;
      line-height: 16px;
      color: rgb(77, 85, 93);

      &.active {
        color: #fff;
      }

      .count {
        font-size: 8px;
        margin-left: 2px;
      }

      &.positive {
        background: rgba(0, 160, 220, 0.2);

        &.active {
          background: rgb(0, 160, 220);
        }
      }

      &.negative {
        background: rgba(77, 85, 93, 0.2);

        &.active {
          background: rgb(77, 85, 93);
        }
      }
    }
  }

  .swith {
    padding: 12px 0 12px 18px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.2);
    color: rgb(147, 153, 159);
    line-height: 24px;
    font-size: 0;

    .icon-check_circle {
      display: inline-block;
      vertical-align: top; // 垂直居中的一种办法
      margin-right: 4px;
      font-size: 24px;

      &.active {
        color: rgb(0, 160, 220);
      }
    }

    .name {
      display: inline-block;
      vertical-align: top;
      font-size: 12px;
    }
  }
}
</style>