<template>
  <div class="content-tabs">
    <div class="tab-container">
      <Tag
        v-for="(item, index) in tabs"
        :key="index"
        closable
        checkable
        type="border"
        :color="$route.name == item.name ? 'primary' : 'default'"
        :name="item.name"
        @on-change="tabChange"
        @on-close="tabClose"
        >{{ item.meta.title }}</Tag
      >
    </div>
    <div class="tab-acitons">
      <Dropdown
        style="margin-left: 20px; height: 100%"
        trigger="hover"
        placement="bottom-end"
        @on-click="menuClick"
      >
        <Icon type="md-hand" />
        <DropdownMenu slot="list">
          <DropdownItem name="closeAll">全部关闭</DropdownItem>
          <DropdownItem name="closeOther">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>
<script>
import { Dropdown } from "view-design";

export default {
  data: () => {
    return {
      msg: "",
    };
  },
  props: {
    tabs: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    tabChange(checked, name) {
      this.$router.push({
        name: name,
      });
    },
    tabClose(event, name) {
      const nowTabs = this.$store.state.app.tabs;
      //如果关闭的标签是最后一个标签。则不处理
      const tabsLen = nowTabs.length;
      if (tabsLen == 1) {
        this.$Message.warning("只有一个标签页不允许关闭");
        return;
      }
      //关闭的标签是当前页，则按如下规则处理显示的页： 关闭页的上一个tab如果存在，则显示上一个tab,如果不存在，则显示tabs的最后一个
      if (this.$route.name == name) {
        let nativename = "";
        const index = nowTabs.findIndex((item) => {
          return item.name == name;
        });
        if (index > 0) {
          // 上一个tab存在
          nativename = nowTabs[index - 1].name;
        } else {
          nativename = nowTabs[nowTabs.length - 1].name;
        }
        const newTabs = nowTabs.filter((tab) => {
          return tab.name != name;
        });
        this.$store.commit("app/updateTabs", { type: "update", data: newTabs });
        this.$router.push({
          name: nativename,
        });
      } else {
        //关闭的标签不是当前页，则不需要处理显示的页
        const newTabs = nowTabs.filter((tab) => {
          return tab.name != name;
        });
        this.$store.commit("app/updateTabs", { type: "update", data: newTabs });
      }
    },
    menuClick(name) {
      const nowTabs = this.$store.state.app.tabs;
      let leaveTab;
      if (name == "closeAll") {
        //全部关闭，只留tabs中的 第一个
        leaveTab = nowTabs[0];
      } else if (name == "closeOther") {
        //关闭当前页外的
        leaveTab = nowTabs.find((item) => {
          return item.name == this.$route.name;
        });
      }
      this.$store.commit("app/updateTabs", {
        type: "update",
        data: [leaveTab],
      });
      this.$router.push({
        name: leaveTab.name,
      });
    },
  },
  components: { Dropdown },
};
</script>
<style lang="less" scoped>
@deep:~ '>>>';
.content-tabs {
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 0px 5px 10px;
  background: #f5f7f9;
  .tab-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .tab-acitons {
    height: 100%;
    line-height: 100%;
    cursor: pointer;
  }
}
@{deep} .ivu-dropdown-rel {
  height: 100%;
}
</style>