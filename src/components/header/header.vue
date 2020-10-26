<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64px" height="64px" :src="seller.avatar" />
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div v-if="seller.supports" class="supports">
          <span class="icon" :class="classMap[seller.supports[1].type]"></span>
          <span class="text">{{seller.supports[1].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports.length>1" class="supports-count" @click='Show'>
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="Show">
      <span class="icon-gonggao"></span>
      <span class="text-gonggao">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%" />
    </div>
    <transition name="fade">
    <div v-show="detailShow" class="detail">
      <div class="detail-wrapper">
        <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size='48' :score='seller.score'></star>
            </div>
            <div class="detail-title">
              <div class="line"></div>
              <div class="biaoti">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li v-for="(item,index) in seller.supports" :key="index" class="supports-item">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="detail-title">
              <div class="line"></div>
              <div class="biaoti">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="wenzi">
              <p class='text'>{{seller.bulletin}}</p>
            </div>
        </div>
      </div>
      <div class="detail-close" @click="Close">
        <i class="icon-close"></i>
      </div>
    </div>
    </transition>
  </div>
</template>

<script type='text/ecmascript-6'>
import star from '../star/star'
export default {
  data() {
    return{
      detailShow:false
    }
  },
  props: {
    seller: {
      type: Object,
      // default: () => {}
    }
  }, //props是接收App组件里传过来的东西，在App里传进来使用‘seller’=seller；
  methods:{
    Show(){
       this.detailShow=true

    },
    Close(){
      this.detailShow=false//两个函数，用来打开背景展示和关闭背景展示
    }
  },
  created() {
    this.classMap = ["jian", "zhe", "tejia", "piao", "bao"];//自己创造的数组，用来进行类的循环
    
  },
  components: {
    star
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin';

.header {
  position: relative;
  color: rgb(255, 255, 255);
  background: rgba(7, 17, 27, 0.5);

  .content-wrapper {
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0;

    .avatar {
      display: inline-block;
      vertical-align: top;

      img {
        border-radius: 2px;
      }
    }

    .content {
      display: inline-block;
      margin-left: 16px;

      .title {
        margin: 2px 0 8px 0;

        .brand {
          display: inline-block;
          vertical-align: top;
          width: 30px;
          height: 18px;
          bg-image('brand');
          background-size: 30px 18px;
        }

        .name {
          margin-left: 6px;
          vertical-align: top;
          font-size: 16px;
          font-weight: bold;
          line-height: 18px;
        }
      }

      .description {
        margin-bottom: 10px;
        line-height: 12px;
        font-size: 12px;
      }

      .supports {
        margin-bottom: 2px;

        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          background-size: 12px 12px;

          &.jian {
            bg-image('decrease_1');
          }

          &.zhe {
            bg-image('discount_1');
          }

          &.piao {
            bg-image('invoice_1');
          }

          &.tejia {
            bg-image('special_1');
          }

          &.bao {
            bg-image('guarantee_1');
          }
        }

        .text {
          margin-left: 4px;
          line-height: 12px;
          font-size: 10px;
        }
      }
    }

    .supports-count {
      position: absolute;
      right: 12px;
      bottom: 14px;
      padding: 0 8px;
      height: 24px;
      border-radius: 7px;
      background-color: rgba(0, 0, 0, 0.2);
      text-align: center;

      .count {
        font-size: 10px;
        line-height: 12px;
      }

      .icon-keyboard_arrow_right {
        margin-left: 2px;
        line-height: 24px;
        font-size: 10px;
      }
    }
  }

  .bulletin-wrapper {
    position: relative;
    padding: 0 22px 0 12px;
    height: 28px;
    line-height: 28px;
    background: rgba(7, 17, 27, 0.2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .icon-gonggao {
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
      width: 22px;
      height: 12px;
      bg-image('bulletin');
      background-size: 22px 12px;
    }

    .text-gonggao {
      vertical-align: top;
      margin: 0 4px;
      font-size: 10px;
    }

    .icon-keyboard_arrow_right {
      position: absolute;
      right: 12px;
      top: 8px;
      font-size: 10px;
    }
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);
  }

  .detail {
    position: fixed;
    overflow: auto;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter :blur(10px)
    background: rgba(7, 17, 27, 0.8)
    z-index: 100;
    &.fade-enter-active,&.fade-leave-active{
       transition :all 0.5s
    }
    &.fade-enter,&.fade-leave-to{
       opacity :0
       
    }
    &.fade-enter-to,&.fade-leave{
       opacity :1
       
    }
    .detail-wrapper{
       
       width :100%
       .detail-main{
         margin-top :64px
         padding-bottom :64px
         .name{
           text-align :center
           line-height :16px
           font-weight 700
           font-size :16px
         }
         .star-wrapper{
           margin :16px 
           text-align :center
           
         }
         .detail-title{
           display :flex
           width :80%
           margin :28px auto 24px auto
           .text{
             padding :0 12px
             font-size :14px
             font-weight :700
           }
           .line{
             flex :1
             position :relative
             top :-7px
             border-bottom :1px solid rgba(255,255,255,0.2)
           }
         }
         .supports{
           width :80%
           margin :0 auto
           .supports-item{
             margin-bottom :12px
             font-size :0
             &:last-child{
               margin-bottom :0
             }
               
             .icon{
               display :inline-block
               margin-right :6px
               vertical-align :top
               width :16px
               height :16px
               background-size :16px 16px
               &.jian {
                 bg-image('decrease_2')
               }

               &.zhe {
                 bg-image('discount_2')
               }

               &.piao {
                 bg-image('invoice_2')
               }

               &.tejia {
                 bg-image('special_2')
               }

               &.bao {
                 bg-image('guarantee_2')
               }
             }
             .text{
               font-size :12px
               line-height :16px
               font-weight :200
             }
           }
         }
         .wenzi{
           
           margin :0 auto
           width :80%
           .text{
             padding :0 12px
             font-size :12px
             line-height :24px
             font-weight :200
           }
         }
        }
    }
    
    .detail-close{
       position :relative
       margin :0px auto 5px auto
       width :32px
       height :32px
       font-size :32px
       clear :both
    }
  }
}
</style>
