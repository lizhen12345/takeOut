
<template>
<div class="rating" ref="ratings">
    <div class="rating-content">
        <div class="overview">
            <div class="overview-left">
                <h1 class="score">{{seller.score}}</h1>
                <div class="name">综合评分</div>
                <div class="rankrate">高于周边商家{{seller.rankRate}}</div>
            </div>
            <div class="overview-right">
                <div class="score-wrapper">
                    <span class="title">服务态度</span>
                    <star :score='seller.serviceScore' :size='36'></star>
                    <span class="score">{{seller.serviceScore}}</span>
                </div>
                <div class="score-wrapper">
                    <span class="title">商品评分</span>
                    <star :score='seller.foodScore' :size='36'></star>
                    <span class="score">{{seller.foodScore}}</span>
                </div>
                <div class="delivery-wrapper">
                    <span class="title">送达时间</span>
                    <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
                </div>
            </div>
        </div>
        <split></split>
        <ratingselect  :ratings='ratings' :selectType='selectType' :onlyContent='onlyContent' :desc='desc' @select='selectRating' @toggle='selectContent'></ratingselect>
        <div class="rating-wrapper">
            <ul>
                <li v-show="needShow(item.rateType,item.text)" class="rating-item" v-for="(item,index) in ratings" :key="index">
                    <div class="avatar">
                        <img :src="item.avatar" width="28px" height="28px">
                    </div>
                    <div class="content">
                        <h1 class="user">{{item.username}}</h1>
                        <div class="detail">
                            <div class="star-wrapper">
                                <star :score='item.score' :size='24'></star>
                                <span class="deliveryTime" v-show="item.deliveryTime">{{item.deliveryTime}}分钟送达</span>
                            </div>
                            <p class="text">{{item.text}}</p>
                        </div>
                        <div class="recommend" v-show="item.recommend">
                            <span class="icon" :class="{'icon-thumb_up':item.rateType === 0,'icon-thumb_down':item.rateType === 1}"></span>
                            <span class="item" v-for="(item1,index1) in item.recommend" :key="index1">{{item1}}</span>
                        </div>
                        <div class="rateTime">{{item.rateTime | formatTime}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
import star from '../star/star'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import {formatTime} from '../../common/js/date1'

const ERR_OK = 0
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default{

    props:{
        seller:{
            type:Object
        }
    },
    data(){
        return {
            ratings:[],
            selectType:ALL,
            onlyContent:false,
            desc: {
                all: '全部',
                positive: '满意',
                negative: '不满意'
            }
        }
    },
    created(){
        this.$http.get('/api/ratings').then(response => {
            response = response.body
            if (response.errno === ERR_OK){
                this.ratings = response.data 
                this.$nextTick(() => {
                    this._initscroll() 
                })
            }
        })
        
    },
    methods:{
        _initscroll() {
           this.scroll = new BScroll(this.$refs.ratings,{click:true})//设置click是为了让滚动的页面中部分可以被点击
        },
        selectRating(type) {
            this.selectType = type
            this.$nextTick(() => {
                this.scroll.refresh()
            })
        },
        selectContent() {
            this.onlyContent = !this.onlyContent
            this.$nextTick(() => {
                this.scroll.refresh()
            })
        },
        needShow(type,text){
            if (this.onlyContent && !text){
                return false
            }
            if (this.selectType === ALL){
                return true
            }else{
                return this.selectType === type
            }
        }

    },
    filters:{
        formatTime(time){
            let date = new Date(time)
            return formatTime(date,'yyyy-MM-dd hh:mm')
        }
    },
    components:{
        star,
        split,
        ratingselect
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
.rating{
    position :absolute
    top :174px
    bottom :0
    width :100%
    overflow :hidden
    .overview{
        display :flex
        padding :18px 0 18px 0
        .overview-left{
            flex :0 0 137px
            width :137px
            border-right :1px solid rgba(7,17,27,0.1)
            .score{
                padding-top :6px
                margin-bottom :6px
                text-align :center
                font-size :24px
                line-height :28px
                color :rgb(255,153,0)
            }
            .name{
                text-align :center
                margin-bottom :8px
                font-size :12px
                line-height :12px
                color :rgb(7,17,27)
            }
            .rankrate{
                margin-bottom :6px
                text-align :center
                font-size :10px
                line-height :10px
                color :rgb(7,17,27)
            }
        }
        .overview-right{
            flex :1
            padding  :6px 0
            margin-left :24px
            .score-wrapper{
                margin-bottom :8px
                font-size :0
                .title{
                    display :inline-block
                    vertical-align :top
                    margin-right :12px
                    font-size :12px
                    line-height :18px
                    color :rgb(7,17,27)
                }
                .star{
                    display :inline-block
                    vertical-align :top
                    margin-right :12px
                }
                .score{
                    display :inline-block
                    vertical-align :top
                    font-size :12px
                    line-height :18px
                    color :rgb(255,153,0)
                }
            }
            .delivery-wrapper{
                font-size :0
                .title{
                    padding-right :12px
                    font-size :12px
                    line-height :18px
                    color :rgb(7,17,27)
                }
                .deliveryTime{
                    font-size :12px
                    line-height :18px
                    color :rgb(147,153,159)
                }
            }
        }
    }
    .rating-wrapper{
        padding : 0 18px
        .rating-item{
            display :flex
            padding :18px 0
            border-bottom :1px solid rgba(7,17,27,0.1)
            .avatar{
                flex :0 0 28px
                width :28px
                margin-right :12px
                img{
                    border-radius :50%
                }
            }
            .content{
                flex :1
                position :relative
                .user{
                    margin-bottom :4px
                    font-size :10px
                    line-height :12px
                    color :rgb(7,17,27)
                }
                .detail{
                   margin-bottom :8px
                   .star-wrapper{
                       margin-bottom :6px
                       font-size :0
                       .star{
                           display :inline-block
                           vertical-align :top
                           margin-right :6px
                       }
                       .deliveryTime{
                           display :inline-block
                           vertical-align :top
                           font-size :10px
                           font-weight :200
                           line-height :12px
                           color :rgb(147,153,159)
                       }
                   }
                   .text{
                       font-size :12px
                       line-height :18px
                       color :rgb(7,17,27)
                   }
                }
                .recommend{
                    font-size :0
                    .icon{
                        margin-right :8px
                        font-size :12px
                        line-height :16px
                        &.icon-thumb_up{
                            color :rgb(0,160,220)
                        }
                        &.icon-thumb_down{
                            color :rgb(183,187,191)
                        }
                    }
                    .item{
                        display :inline-block
                        padding :0 8px
                        margin-right :8px
                        font-size :9px
                        line-height :16px
                        color :rgb(147,153,159)
                        border-radius :2px
                        background :rgb(255,255,255)
                        border :1px solid rgba(7,17,27,0.1)
                    }
                }
                .rateTime{
                    position :absolute
                    top :0
                    right :0
                    font-size :10px
                    line-height :12px
                    font-weight :200
                    color :rgb(147,153,159)
                }
            }
        }
    }
}
</style>
