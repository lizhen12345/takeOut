
<template>
<div>
  <div class="goods">
    <div class="menu-wrapper" ref="menuwrapper">
      <ul>
        <li
          v-for="(item,index) in goods"
          class="menu-item"
          :class="{'current':nowIndex===Number(index)}"
          :key="index"
          @click="selectMenu(index,$event)"
        >
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
          <div class="count" v-show="menuCount[index]">{{menuCount[index]}}</div>
        </li>
      </ul>
    </div>
    <div class="goods-wrapper" ref="foodswrapper">
      <ul>
        <li v-for="(item,index) in goods" class="food-list food-list-hook" :key="index">
          <h1 class="biaoti">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="(food,index1) in item.foods" class="food-item" :key="index1">
              <div class="tupian">
                <img :src="food.icon" width="57px" height="57px" />
              </div>
              <div class="content">
                <div class="title">
                  <h1 class="name">{{food.name}}</h1>
                  <p class="description">{{food.description}}</p>
                </div>
                <div class="extra">
                  <span class="sellcount">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="price-now">${{food.price}}</span>
                  <span v-show="food.oldPrice" class="price-old">${{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food='food' @add='addFood'></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :selectFoods='selectFoods' :deliveryPrice='seller.deliveryPrice' :minPrice='seller.minPrice'></shopcart>
  </div>
  <food :food='selectedFood' ref="food"></food>
</div>
</template>

<script type='text/ecmascript-6'>
import label from "../label/label";
import BScroll from "better-scroll";
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'

const ERR_OK = 0;
export default {
  props:{
    seller:{
      type:Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood:{}
    };
  },
  

  computed: {
        nowIndex(){//此部分主要计算当前高度在数组listheight中的位置，返回索引值i
           for (let i=0;i<this.listHeight.length;i++){
              let height1=this.listHeight[i]
              let height2=this.listHeight[i+1]
              // console.log('length',this.listHeight.length)
               // console.log(this.scrollY)
              if (!height2||(this.scrollY>=height1&&this.scrollY<height2)){
                 
                // console.log('i',i)
                 return i
              }
           }
           return 0
        },
        selectFoods(){//将我购买的food添加到一个数组中
          let foods=[]
          this.goods.forEach((good)=>{
              good.foods.forEach((food)=>{
              if(food.count){
                foods.push(food)
              }
            })
          })
          
          return foods
        },
        menuCount(){//实现在菜单上也显示我购买了多少
          let zongshu = []
          this.goods.forEach((good) => {
            let count = 0
            good.foods.forEach((food) => {
              if(food.count){
                count += food.count
              }
            })
            zongshu.push(count)
          })
          console.log(zongshu)
          return zongshu
        }
  },
  created() {
    this.$http.get("/api/goods").then(response => {
      response = response.body;
       //console.log("response.seller",this.seller.constructor,this.seller);
      if (response.errno === ERR_OK) {
       // this.goods = Object.assign({}, this.goods, response.data);//这样得到的goods是一个对象
       this.goods = response.data;
        console.log("goods",this.goods.constructor,this.goods);
        this.$nextTick(() => {//这个函数是异步函数，这是为了确保DOM已经被渲染 
          this._initscroll();
          this.computeHeight();
        });
      }
    });
    this.classMap = ["jian", "zhe", "tejia", "piao", "bao"];
  },
  methods: {
    _initscroll() {//这个函数对左右两侧的dom进行初始化
 
       this.menuScroll = new BScroll(this.$refs.menuwrapper,{click: true})
       //用$refs.menuwrapper来获取dom里的对象，clickture确保其能点击
       this.foodsScroll = new BScroll(this.$refs.foodswrapper, {click: true, probeType: 3})
        //probeType相当于一个探针来实时获取y值
       this.foodsScroll.on('scroll',(pos)=>{this.scrollY=Math.abs(Math.round(pos.y))})//把获取到的y值暴露出来
    },

    computeHeight() {
        //计算每一快的高度返回数组listHeight
      let foodlist=this.$refs.foodswrapper.getElementsByClassName('food-list-hook')
     
      let height=0
      this.listHeight.push(height)
      for (let i=0;i<foodlist.length;i++){
         height=height+foodlist[i].clientHeight
         this.listHeight.push(height)
      }
      console.log("height", this.listHeight);
    },
			selectMenu(index,event) {
				if (!event._constructed) {//去掉自带的click事件点击，即在pc端直接返回
					return;
				}
        let foodlist = this.$refs.foodswrapper.getElementsByClassName('food-list-hook');//获得监听元素
        
				let el = foodlist[index];//获得当前的监听区域
				this.foodsScroll.scrollToElement(el, 300);//类似跳转功能
      },
      addFood(target){
        this._drop(target)//父组件通过@add=addFood监听由子组件cartcontrol中$emit触发的事件，
                          //通过addFood接收从子组件传递过来的数据，通知父组件数据改变了,然后触发_drop函数
      },
      _drop(target){//体验优化，异步下落小球
        this.$nextTick(()=>{
          this.$refs.shopcart.drop(target)//将从cartcontr组件中获得的dom元素传递给子组件shopcart,触发balldrop事件
          //因为两个子组件之间并没有直接的通信，所以只能这么做，才能实现在cartcontrol组件中点击，有小球落到shopcart子组件
        })
      },
      selectFood(food,event){
				if (!event._constructed) {//去掉自带的click事件点击，即在pc端直接返回
					return;
        }
        this.selectedFood = food //将food值传递给子组件
        
        this.$refs.food.show()//调用food组件中的show方法，实现点击出现食品详情页的功能
      }


  },
  components: {
    "v-label": label,
    shopcart,
    cartcontrol,
    food
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin';

.goods {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background-color: #f3f5f7;

    .menu-item {
      position relative
      display: table;
      height: 54px;
      width: 56px;
      line-height: 14px;
      padding: 0 12px;

      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        font-weight: 700;

        .text {
          border-none();
          color: red;
        }
      }

      .icon {
        display: inline-block;
        margin-right: 2px;
        vertical-align: top;
        width: 12px;
        height: 12px;
        background-size: 12px 12px;

        &.jian {
          bg-image('decrease_3');
        }

        &.zhe {
          bg-image('discount_3');
        }

        &.piao {
          bg-image('invoice_3');
        }

        &.tejia {
          bg-image('special_3');
        }

        &.bao {
          bg-image('guarantee_3');
        }
      }

      .text {
        display: table-cell;
        vertical-align: middle;
        width: 56px;
        font-size: 12px;
        font-weight: 200;
        border-1px(rgba(7, 17, 27, 0.1));
      }
      .count{
        position :absolute
        top :13px
        right :8px
        width :15px
        height 15px
        border-radius :50%
        background :#f01414
        font-size :9px
        color :#fff
        text-align :center
        line-height :15px
      }
    }
  }

  .goods-wrapper {
    flex: 1;

    .food-list {
      width: 100%;

      .biaoti {
        padding-left: 14px;
        height: 26px;
        border-left: 3px solid #d9dde1;
        background-color: #f3f5f7;
        font-size: 12px;
        line-height: 26px;
        color: rgb(147, 153, 159);
      }

      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        border-1px: rgba(7, 17, 27, 0.1);

        &:last-child {
          border-none;
          margin-bottom: 0;
        }

        .tupian {
          flex: 0 0 57px;
        }

        .content {
          flex: 1;
          margin-left: 10px;
          margin-top: 2px;

          .title {
            .name {
              margin-bottom: 8px;
              line-height: 14px;
              font-weight: bold;
              font-size: 14px;
              color: rgb(7, 17, 27);
            }

            .description {
              font-size: 10px;
              line-height: 12px;
              color: rgb(147, 153, 159);
            }
          }

          .extra {
            margin-top: 8px;
            margin-bottom: 8px;
            font-size: 10px;
            line-height: 10px;
            color: rgb(147, 153, 159);

            .sellCount {
              padding-right: 12px;
            }
          }

          .price {
            line-height: 14px;
            font-weight: 700;

            .price-now {
              padding-right: 8px;
              font-size: 14px;
              color: rgb(240, 20, 20);
            }

            .price-old {
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          .cartcontrol-wrapper{
            position :absolute
            bottom :12px
            right :0
          }
        }
      }
    }
  }
}
</style>