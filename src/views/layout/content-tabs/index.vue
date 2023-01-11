<template>
    <div class="content-tabs">
        {{ msg }}
    </div>
</template>
<script>
export default {
    data:()=>{
        return {
           msg:'content-tabs'
        }
    }
}
</script>
<style lang="less" scoped>
  .content-tabs{
    height: 30%
  }
</style>