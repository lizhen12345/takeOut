<template>
<div class="seller" ref="seller">
    <div class="seller-wrapper">
        <div class="overview">
            <div class="overview-top">
                <h1 class="name">{{seller.name}}</h1>
                <div class="main">
                    
                    <star :score='seller.score' :size='36'></star>
                   
                    <span class="ratingCount">({{seller.ratingCount}})</span>
                    <span class="sellCount">月售{{seller.sellCount}}单</span>
                </div>
                <div class="shoucang" @click="toggleFavorite($event)">
                    <span class="icon-favorite" :class="{'active' : favorite}"></span>
                    <span class="text">{{favoriteText}}</span>
                </div>
            </div>
            <div>
                <ul class="overview-bottom">
                    <li class="block">
                        <h1 class="title">起送价</h1>
                        <div class="content">
                            <span class="detail">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h1 class="title">商家配送</h1>
                        <div class="content">
                            <span class="detail">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h1 class="title">平均配送时间</h1>
                        <div class="content">
                            <span class="detail">{{seller.deliveryTime}}</span>分钟
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <split></split>
        <div class="middle-wrapper">
            <h1 class="title">公告与活动</h1>
            <div class="main-wrapper">
                <p class="text">{{seller.bulletin}}</p>
                <ul v-if="seller.supports" class="supports">
                    <li v-for="(item,index) in seller.supports" class="item" :key="index">
                        <span class="icon" :class="classMap[item.type]"></span>
                        <span class="description">{{item.description}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <split></split>
        <div class="pics">
            <h1 class="title">商家实景</h1>
            <div class="photos-wrapper" ref="photosWrapper">
                <ul class="photos-list" ref="photosList">
                    <li class="photo-item" v-for="(item,index) in seller.pics" :key="index" ref="photoItem">
                        <img :src="item" width="120px" height="90px">
                    </li>
                </ul>
            </div>
        </div>
        <split></split>
        <div class="infos-wrapper">
            <h1 class="title">商家信息</h1>
            <ul>
                <li class="info" v-for="(item,index) in seller.infos" :key="index">
                    <span class="text">{{item}}</span>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>

<script type='text/ecmascript-6'>
import star from '../star/star'
import split from '../split/split'
import BScroll from 'better-scroll'
import {saveToLocal,loadFromLocal} from '../../common/js/store'
export default{
    props:{
        seller :{
            type :Object
        }
    },
    data() {
        return{
            favorite :(() => {
                return loadFromLocal(this.seller.id,'favorite',false)
            })()//立即执行函数
        }
    },
    created(){
       
        this.classMap = ["jian", "zhe", "tejia", "piao", "bao"]//自己创造的数组，用来进行类的循环
       
    },
    computed:{
        favoriteText() {
            return this.favorite? '已收藏' : '未收藏'
        }
    },
    watch:{
        'seller'() {//因为seller是父组件穿过来的，所以不能在created里初始化BScroll，执行的时候先执行mounted，初始化BS，
            this.$nextTick(() => {//然后watch检测到seller传入，dom得到渲染，在重新更新一下BS
                
                    this._initScroll()//better-scroll的初始化一定要保证dom已经被渲染了，
                    this._initPics()    // 在使用props传来的值时，一开始要用到seller，因为它是异步更新的，
                                        // 要用watch去观测他的更新，然后是更新后的操作
                                        // 同时要考虑到切换
                                        // 可能有些属性不会再变化了
                                        // mounted会被来回执行
            })        
        }
    },
    mounted() {
        this.$nextTick(() => {
          
            this._initScroll()
            this._initPics()
        })
        
    },

    methods:{
        toggleFavorite(event) {
            if(!event._constructed){
                return
            }
            this.favorite = !this.favorite
            saveToLocal(this.seller.id,'favorite',this.favorite)
            
        },
        _initScroll() {
        
				if (!this.scroll) {
                  
					this.scroll = new BScroll(this.$refs.seller, {click: true});
				} else {
                   
					this.scroll.refresh();
				}
        },

        _initPics() {
            let picWidth = 120
            let margin = 6
           
            if(this.seller.pics) {
                
                let sumWidth = (picWidth + margin)*this.seller.pics.length - margin//计算这些图片的总宽度
                console.log(sumWidth)
                this.$refs.photosList.style.width = sumWidth + 'px'//让这个dom的样式的宽度为图片的总宽度
            
               console.log(this.$refs.photosList.style.width)
                 
                    if( !this.photoScroll){//初始化BS
                        this.$nextTick(() => {
                            this.photoScroll = new BScroll(this.$refs.photosWrapper,{
                                scrollX :true,//表示横向滚动
                                eventPassthrough :'vertical' //当横向滚动时忽略纵向滚动
                            })
                            
                        })


                        }else{
                            this.photoScroll.refresh()
                        }

               
            }

            }

    },



   

    components:{
        star,
        split
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>

@import '../../common/stylus/mixin';
.seller{
    position :absolute
    top :174px
    bottom :0
    width :100%
    overflow :hidden
    .overview{
        padding :18px
        .overview-top{
            position :relative
            padding-bottom :18px
            margin-bottom :18px
            border-bottom :1px solid rgba(7,17,27,0.1)
            .name{
                margin-bottom :8px
                font-size :14px
                line-height :14px
                color :rgb(7,17,27)
            }
            .main{

                .star{
                    display :inline-block
                    vertical-align :top
                    margin-right :8px
                }
                .ratingCount,.sellCount{
                    display :inline-block
                    vertical-align :top
                    font-size :10px
                    line-height :18px
                    color :rgb(77,85,93)
                }
                .ratingCount{
                    margin-right :12px
                }
            }
            .shoucang{
                position :absolute
                top :0
                right :0
                width :50px
                text-align :center
                .icon-favorite{
                    display :block
                    margin-bottom :4px
                    font-size :24px
                    line-height :24px
                    color :#d4d6d9
                    &.active{
                        color :rgb(240,20,20)
                    }
                }
                .text{
                    font-size :10px
                    line-height :10px
                    color :rgb(77,85,93)
                }
                    

                }
        }
        .overview-bottom{
            display :flex
            .block{
                flex :1
                text-align :center
                border-right :1px solid rgba(7,17,27,0.1)
                &:last-child{
                    border-right :none
                }
                .title{
                    margin-bottom :4px
                    font-size :10px
                    line-height :10px
                    color :rgb(147,153,159)
                }
                .content{
                    font-size :10px
                    color rgb(7,17,27)
                    font-weight :200
                    .detail{
                        font-size :24px
                        line-height :24px
                    }
                }

            }
        }
    }
    .middle-wrapper{
        padding :18px 18px 0 18px
        .title{
            margin-bottom :8px
            font-size :14px
            line-height :14px
            color :rgb(7,17,27)
        }
        .main-wrapper{
            .text{
                margin :0 12px 16px 12px
                line-height :24px
                font-size :12px
                color :rgb(240,20,20)
            }
            .supports{
                .item{
                    padding :16px 12px  
                    font-size :0
                    border-top :1px solid rgba(7,17,27,0.1)
                    .icon{
                        display :inline-block
                        vertical-align :top
                        margin-right :6px
                        width :16px
                        height :16px
                        background-size :16px 16px
                        background-repeat :none
                        &.jian {
                            bg-image('decrease_4');
                        }

                        &.zhe {
                            bg-image('discount_4');
                        }

                        &.piao {
                            bg-image('invoice_4');
                        }

                        &.tejia {
                            bg-image('special_4');
                        }

                        &.bao {
                            bg-image('guarantee_4');
                        }
                    }
                    .description{
                        vertical-align :top
                        font-size :12px
                        line-height :16px
                        font-weight :200
                        color :rgb(7,17,27)
                    }
                }
            }
        }
    }
    .pics{
        padding :18px 0 18px 18px 
        .title{
            margin-bottom :12px
            font-size :14px
            line-height :14px
            color :rgb(7,17,27)
        }
        .photos-wrapper{
            width :100%
            overflow :hidden
            white-space :none
            .photos-list{
                font-size :0
                .photo-item{
                    display :inline-block
                    margin-right :6px
                    width :120px
                    height :90px
                    &:last-child{
                        margin-right :0
                    }

                }
            }
        }
    }
    .infos-wrapper{
        padding :18px 18px 0 18px
        .title{
            margin-bottom :12px
            font-size :14px
            line-height :14px
            color :rgb(7,17,27)
        }
        .info{
            padding :16px 12px
            border-top :1px solid rgba(7,17,27,0.1)
            .text{
                font-size :12px
                line-height :16px
                font-weight :200
                color :rgb(7,17,27)
            }
        }
    }

}
</style>