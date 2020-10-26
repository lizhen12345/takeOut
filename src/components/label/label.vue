<template>

    <span class="icon" :class="leixing"></span>


</template>

<script type='text/ecmascript-6'>
export default{
    props: {
        type: {
            type:Number
        }
    },
    computed: {
        leixing() {
            if(this.type>0){
                return this.classMap[this.type]
            }
            else{
                return 'wu'
            }
        }

    },
    created() {
        console.log(this.iconsize)
        this.classMap = ["jian", "zhe", "tejia", "piao", "bao"]
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin'

    .icon{
            display :inline-block
            margin-right :2px
            align-self :center
            width :12px
            height :12px
            background-size :12px 12px
            &.jian {
                 bg-image('decrease_3')
               }

               &.zhe {
                 bg-image('discount_3')
               }

               &.piao {
                 bg-image('invoice_3')
               }

               &.tejia {
                 bg-image('special_3')
               }

               &.bao {
                 bg-image('guarantee_3')
               }
               &.wu{
                   display :none
                   margin-right :0
               }
    }

</style>