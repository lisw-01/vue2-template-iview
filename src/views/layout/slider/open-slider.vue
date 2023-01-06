<template>
    <div class="slider-menu-open" @click="test">
          菜单
    </div>
</template>
<script>
export default {
    data:()=>{
        return {}
    },
    methods:{
        test(){
            this.$router.push({
                name:'html'
            })
        }
    }
}
</script>
<style lang="less" scoped>
.slider-menu-open{
    font-size: 2rem
}
</style>