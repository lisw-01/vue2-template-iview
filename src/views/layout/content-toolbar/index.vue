<template>
  <div>
    <Icon
      @click.native="toggleSliderDone"
      :class="rotateIcon"
      type="md-menu"
      size="24"
    ></Icon>
  </div>
</template>
<script>

export default {
  data: () => {
    return {};
  },
  props: {
    sliderCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  computed:{
    rotateIcon(){
       return  ["menu-icon",this.sliderCollapsed?'rotate-icon':'']
    },
  }, 
  methods: {
    toggleSliderDone() {
        this.$emit('toggleSliderCollapsed')
    },
  },
};
</script>
<style lang="less" scoped>
.menu-icon {
  transition: all 0.3s;
}

.rotate-icon {
  transform: rotate(-90deg);
}
</style>