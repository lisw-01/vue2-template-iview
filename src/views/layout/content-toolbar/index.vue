<template>
  <div class="content-toolbar">
    <div class="containerL">
      <Icon
        @click.native="toggleSliderDone"
        :class="rotateIcon"
        type="md-menu"
        size="24"
      ></Icon>
      <!-- 面包屑 -->
      <Breadcrumb>
        <BreadcrumbItem
          v-for="(crumbItem, index) in breadCrumbItems"
          :key="index"
        >
          <Icon :type="crumbItem.meta.icon" /> {{ crumbItem.meta.title }}
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="containerR">
      <Dropdown
        style="margin-left: 20px"
        trigger="click"
        placement="bottom-end"
        @on-click="menuClick"
      >
        <div class="username">admin</div>
        <Avatar icon="ios-person" size="large" style="cursor: pointer" />
        <DropdownMenu slot="list">
          <DropdownItem name="signOut">退出</DropdownItem>
          <DropdownItem name="userInfo">用户</DropdownItem>
          <DropdownItem name="dark">dark</DropdownItem>
          <DropdownItem name="light">light</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>
<script>
import { BreadcrumbItem } from "view-design";

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
  computed: {
    rotateIcon() {
      return ["menu-icon", this.sliderCollapsed ? "rotate-icon" : ""];
    },
    breadCrumbItems() {
      return this.$store.state.app.BreadcrumbItems;
    },
  },
  methods: {
    toggleSliderDone() {
      this.$emit("toggleSliderCollapsed");
    },
    menuClick(dropdownItemName) {
      switch (dropdownItemName) {
        case "signOut":
          {
            this.$router.push({ name: "login" });
          }
          break;
        case "userInfo":
          {
          }
          break;
        case "dark":
          {
            this.$emit("themeChange",'dark');
          }
          break;
        case "light":
          {
            this.$emit("themeChange",'light');
          }
          break;
      }
    },
  },
  components: { BreadcrumbItem },
};
</script>
<style lang="less" scoped>
.content-toolbar {
  height: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .containerL {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 2;
    .menu-icon {
      transition: all 0.3s;
      padding-left: 20px;
      padding-right: 20px;
    }

    .rotate-icon {
      transform: rotate(-90deg);
    }
  }
  .containerR {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    .username {
      display: inline-block;
    }
  }
}
</style>