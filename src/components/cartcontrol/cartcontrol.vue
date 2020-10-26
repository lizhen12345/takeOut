<template>
<div class="cartcontrol">
   <transition name="move">
        <div class="cart-decrease" v-show="food.count>0" @click.stop="decreaseCart">
            <span class="inner  icon-remove_circle_outline"></span>
        </div>
   </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart($event)"></div>
</div>
</template>

<script type='text/ecmascript-6'>
import Vue from 'vue'
export default {
    props:{
        food:{
            type:Object
        }
    },
    created() {
        //console.log('food',this.food.count)
    },
    methods: {
        addCart(event){
         console.log(1) 
            if (!event._constructed) {//去掉自带的click事件点击，即在pc端直接返回
					return;
            }
            window.event.cancelBubble = true
            if (!this.food.count){
                Vue.set(this.food,'count',1)//此处给对象新添加一个属性count
                // this.food.count = 1//此种方法不会触发更新
                //this.$set(this.food,'count',1)//相当于vue.set
                // this.food = Object.assign({},this.food,{count:1})
            }
            else{
                this.food.count++
            }
            this.$emit('add',event.target)//当点击添加数量时，通过$emit属性触发add事件，将参数传递给父组件
            
        },
        decreaseCart(event){
        	if (!event._constructed) {//去掉自带的click事件点击，即在pc端直接返回
					return;
            }
            if(this.food.count){
                this.food.count--
            }
        }
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>

.cartcontrol{
    font-size :0
    .cart-decrease{
        display :inline-block
        padding :6px 
		opacity: 1
		transform: translate3d(0, 0, 0)
		.inner{
				display: inline-block
				line-height: 24px
				font-size: 24px
				color: rgb(0, 160, 220)
        }
		&.move-enter-active, &.move-leave-active{ //小球进入和离开过程的样式(平移)
				transition: all 0.4s linear
        }
		&.move-enter, &.move-leave-to{
				opacity: 0 //小球进入和离开后整体的透明度
				transform: translate3d(24px, 0, 0) //左右平移24px
				.inner{
					transform: rotate(180deg) // 小球进入前和离开后的旋转角度（旋转），顺时针旋转180
                }
        }
		&.move-enter-to, &.move-leave{
				opacity: 1 
				transform: translate3d(0, 0, 0) 
				.inner{
					transform: rotate(0) 
                }
        }
    }
    .cart-count{
        display :inline-block
        vertical-align :top
        width :12px
        padding-top :6px
        text-align :center
        line-height :24px
        font-size :10px
        color :rgb(147,153,159)
    }
    .cart-add{
        display :inline-block
        padding :6px
        line-height :24px
        font-size :24px
        color :rgb(0,160,200)
    }
}
</style> 