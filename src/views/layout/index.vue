<template>
  <div class="layout">
    <Layout>
      <Sider
        ref="side"
        hide-trigger
        collapsible
        :width=sliderwidth
        :collapsed-width="80"
        v-model="isCollapsed"
      >
        <layout-slider-open v-if="!isCollapsed" :menuwidth="menuwidth" :menuList="menuList"></layout-slider-open>
        <layout-slider-collapsed v-if="isCollapsed"></layout-slider-collapsed>
      </Sider>
      <Layout>
        <Header class="layout-header-bar">
          <content-toolbar
            :sliderCollapsed="isCollapsed"
            @toggleSliderCollapsed="toggleSliderCollapsedhand"
          ></content-toolbar>
          <content-tabs></content-tabs>
        </Header>
        <Content class="layout-content" :style="contentStyle">
           <!-- 缓存的页面 -->
          <keep-alive>
            <router-view
              :key="$route.name"
              v-if="$route.meta.keepAlive"
            ></router-view>
          </keep-alive>
          <!-- 不需要缓存的页面 -->
          <router-view
            :key="$route.name"
            v-if="!$route.meta.keepAlive"
          ></router-view>
        </Content>
        <Footer class="layout-footer">
          <content-footer></content-footer>
        </Footer>
      </Layout>
    </Layout>
  </div>
</template>
<script>

export default {
  name: "layout",
  data: () => {
    return {
      isCollapsed: false, // 控制slider的收起/展开
      sliderwidth:'200'
    };
  },
  props: {}, //父组件传递参数，可选
  // 计算属性，可选
  computed: {
    // layout理由出口  页面容器的样式
    contentStyle() {
      let documentHeight = this.$util.getWindowSize().h;
      const headerHeight = 80; // Header高度
      const footerHeight = 50; // Footer高度
      documentHeight = documentHeight - headerHeight - footerHeight - 2;
      return {
        height: `${documentHeight}px`,
        overFlow: "auto hidden",
      };
    },
    menuList(){
      return this.$store.state.app.menuList;
    },
    menuwidth(){
      return this.sliderwidth+'px';
    }
  },
  watch: {}, //可选
  components: {
    "layout-slider-open": () => import("@/views/layout/slider/open-slider"),
    "layout-slider-collapsed": () =>
      import("@/views/layout/slider/collapsed-slider"),
    "content-toolbar": () => import("@/views/layout/content-toolbar/index"),
    "content-tabs": () => import("@/views/layout/content-tabs/index"),
    "content-footer": () => import("@/views/layout/content-footer/index"),
  },
  methods: {
    toggleSliderCollapsedhand() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>