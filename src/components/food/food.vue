<template>
<transition name="move">
    <div class="food" v-show="showFlag" ref="food">
        <div class="food-content">
            <div class="image-header">
                <img :src="food.image">
                <div class="back-wrapper" @click="back">
                    <span class="icon-arrow_lift"></span>
                </div>
            </div>
            <div class="content">
                <div class="name">{{food.name}}</div>
                <div class="detail">
                    <span class="sell-count">月售{{food.sellCount}}份</span>
                    <span class="rating-rate">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="price-now">${{food.price}}</span>
                  <span v-show="food.oldPrice" class="price-old">${{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                    <cartcontrol :food='food'></cartcontrol>
                </div>
                <transition name="fade">
                    <div class="buy" v-show="!food.count || food.count === 0" @click="buyfood($event)">加入购物车</div>
                </transition>
            </div>
            <split v-show="food.info"></split>
            <div class="desc" v-show="food.info">
                <div class="title">商品介绍</div>
                <div class="info">{{food.info}}</div>
            </div>
            <split></split>
            <div class="food-rating">
                <h1 class="title">商品评价</h1>
                <ratingselect @select='selectRating' @toggle='selectContent' :ratings='food.ratings' :selectType='selectType' :onlyContent='onlyContent' :desc='desc'></ratingselect>

                <div class="rating-wrapper">
                    <ul v-show="food.ratings && food.ratings.length">
                        <li v-show="needShow(rating.rateType,rating.text)" class="ratings-item" v-for="(rating,index) in food.ratings" :key="index">
                                <div class="date">{{rating.rateTime | formatTime}}</div>
                                <div class="text">
                                    <span class="icon" :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                                    <span class="wenzi">{{rating.text}}</span>
                                </div>
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="touxiang" :src="rating.avatar" width="12px" height="12px">
                                </div>
                        </li>
                    </ul>
                    <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                </div>
            </div>
        </div>
    </div>
</transition>
</template>

<script type='text/ecmascript-6'>
import BScroll from "better-scroll";
import {formatTime} from '../../common/js/date1'
import Vue from 'vue'
import cartcontrol from '../cartcontrol/cartcontrol'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'

const ALL = 2
export default{
    props:{
        food: {
            type: Object
        }
    },
    data() {
        return{
            showFlag: false,
            selectType :ALL,
            onlyContent :false,
            desc :{
                    all :'全部',
                    positive :'推荐',
                    negative :'吐槽'
            }
        }
    },
    methods: {
        show() {
            this.showFlag = true
            this.selectType = ALL
            this.onlyContent = false //这些是为了保证我点开一个food页面关闭之后，再打开一个food页面，数据扔初始化
        
            this.$nextTick(() => {//为了使页面能滚动起来
                if (!this.scroll){
                    this.scroll =new BScroll(this.$refs.food,{click:true}) 
                }else{
                    this.scroll.refresh()
                }
                
            })

        },
        back() {
            this.showFlag = false
        },
        buyfood(event) {
            if (!event._constructed){
                return
            }
            
             this.$emit('add',event.target)//为了第一次点购物的时候也有小球下落动画
            Vue.set(this.food,'count',1)//在food页面点击购买商品，
        },
        selectRating(type){
            this.selectType = type
            //监听ratingselect子组件中的事件
            this.$nextTick(() => {//重置bsroll，使页面可以重新定义滑动的低端位置
                this.scroll.refresh()
            })
        },
        selectContent(){
             this.onlyContent = !this.onlyContent
            this.$nextTick(() => {
                this.scroll.refresh()
            })             
        },
        needShow(type,text) {//函数按钮来控制评论的显示
            if(this.onlyContent && !text){//当我只看有内容的时候，正好这条评论无文本，那么这条评论通过V-show不显示
                return false
            }
            if(this.selectType === ALL){//如果按钮为全显示，则所以都显示
                return true
            }else{//若按钮为其他的，例如吐槽什么的，则返回和我想看的类型一样的评论（selectType是我想看的类型）
                return  this.selectType === type
            }
        }
    },
    filters: {
        formatTime(time){//此处将日期替代为如下格式
             let date=new Date(time)
             return formatTime(date,'yyyy-MM-dd hh:mm')
        }
    },
    components:{
        cartcontrol,
        split,
        ratingselect
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
.food{
    position :fixed
    left :0
    top :0
    bottom :48px
    z-index :30
    width :100%
    background :#fff
    
    &.move-enter{
        transform: translate3d(-100%, 0, 0)
    }
    &.move-leave-to{
        transform: translate3d(0, 100%, 0)
    }
    &.move-enter-active,&.move-leave-active{
        transition :all 0.4s linear 
    }
    &.move-enter-to,&.move-leave{
        transform: translate3d(0, 0, 0)
    }
    .image-header{
        position :relative
        width :100%
        height :0
        padding-top :100% //吧高度设为0，这为100%，看起来是个宽高相等的容器
        img{
            position :absolute
            top :0
            left :0
            width :100%
            height :100%
        }
        .back-wrapper{
            position :absolute
            top :10px
            left :0
            .icon-arrow_lift{
                padding :10px
                font-size :20px
                color #fff
            }
        }
    } 
    .content{
        position: relative
        padding :18px
        .name{
            margin-bottom :8px
            font-size :14px
            font-weight :700
            line-height :14px
            color :rgb(7,17,27)
        }
        .detail{
            margin-bottom :18px
            font-size :0px
            line-height :10px
            color :rgb(147,153,159)
            .sell-count{
                padding-right :12px
                font-size :10px
            }
            .rating-rate{
                font-size :10px
            }
        }
        .price{
            font-size :0
            line-height :24px
            .price-now{
                padding-right :12px
                font-size :14px
                color :rgb(240,20,20)
                font-weight :700
            }
            .price-old{
                text-decoration :line-through
                font-size :10px
                color :rgb(147,153,159)
            }
        }
        .cartcontrol-wrapper{
            position :absolute
            right :12px
            bottom :12px
        }
        .buy{
            position :absolute
            right :18px
            bottom :18px
            z-index :10
            height :24px
            line-height :24px
            padding :0 12px
            box-sizing :border-box
            font-size :10px
            border-radius :12px
            color :#fff
            background :rgb(0,160,120)
            &.fade-enter-to,&.fade-leave{
                opacity :1
            }
            &.fade-enter-active,&.fade-leave-active{
                transition :all 0.2s
            }
            &.fade-enter,&.fade-leave-to{
                opacity :0
            }
        }
    }
    .desc{
        padding :18px
        
        .title{
            margin-bottom :6px
            font-size :14px
            font-weight :700
            color :#07111b
        }
        .info{
            padding :0 8px
            font-size :12px
            line-height :24px
            font-weight :200
            color :rgb(77,85,93)
        }
    }
    .food-rating{
        padding-top :18px
        .title{
            margin-left :18px
            font-size :14px
            font-weight :700
            color :#07111b
        }
        .rating-wrapper{
            padding :0 18px
            .ratings-item{
                position :relative
                padding :16px 0
                border-bottom :1px solid  rgba(7,17,27,0.1)
                .date{
                    margin-bottom :6px
                    font-size :10px
                    line-height :12px
                    color :rgb(147,153,159)
                }
                .text{
                    font-size :0
                    .icon-thumb_up,.icon-thumb_down{
                        font-size :12px
                        line-height :24px
                    }
                    .icon-thumb_up{
                        color :rgb(0,160,220)
                    }
                    .icon-thumb_down{
                        color :rgb(147,153,159)
                    }
                    .wenzi{
                        margin-left :4px
                        font-size :12px
                        line-height :16px
                        color :rbg(7,17,27)
                    }
                }
                .user{
                    position :absolute
                    right :0
                    top :16px
                    font-size :0
                    .name{
                        display :inline-block
                        vertical-align :top
                        margin-right :6px
                        font-size :10px
                        line-height :12px
                        color :rgb(147,153,159)
                    }
                    .touxiang{
                        display :inline-block
                        vertical-align :top
                        border-radius :50%
                    }
                }
            }
            .no-ratings{
                padding :16px 0
                font-size :14px
                color :rgb(147,153,159)
            }
        }

    }

}
</style>