<template>
  <div class="page-login">
    <div class="login-form">
      <div class="form-title">欢迎登入</div>
      <Form ref="loginFormRef" :model="loginform" :rules="loginformRule">
        <FormItem prop="name">
          <Input
            type="text"
            size="large"
            v-model="loginform.name"
            placeholder="用户名"
          >
            <Icon type="ios-contact" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input
            type="password"
            size="large"
            v-model="loginform.password"
            placeholder="Password"
          >
            <Icon type="md-lock" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('loginFormRef')"
            >登入</Button
          >
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data: () => {
    return {
      loginform: {
        name: "",
        password: "",
      },
      loginformRule: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {}, //父组件传递参数，可选
  computed: {}, // 计算属性，可选
  watch: {}, //可选
  comments:{},
  // 方法
  methods: {
    //获取signkey
    getSingkey() {
      this.$api.getSin_Key().then(
        (resp) => {
          const { status, data } = resp;
          if (status == "success") {
            const sinkey = data.sinkey;
            console.log(
              "store保存前【没值，store刷新后数据也没了，特性和angular服务一样】------",
              this.$store.state.app.singkey
            );
            this.$store.commit("app/setSingKey", sinkey); // 放入store
            this.$mystore.setStr("singkey", sinkey); // 放入持久化存储
            console.log("store保存后------", this.$store.state.app.singkey);
          }
        },
        (err) => {}
      );
    },
    handleSubmit(formRef) {
      this.$refs[formRef].validate((valid) => {
        if (!valid) {
          this.$Message.warning("账号或者密码不正确");
          return;
        }
        const userName = this.loginform.name;
        const pwd = this.loginform.password;
        const aes_usrname = this.$util.aesString(userName); //用户名加密
        const aes_pwd = this.$util.aesString(pwd); // 密码加密
        this.$api
          .login({
            username: aes_usrname,
            pwd: aes_pwd,
          })
          .then((resp) => {
            const { status, data } = resp;
            if (status == "success") {
              const token = data.token;
              this.$store.commit("app/setToken", token); // 放入store
              this.$mystore.setStr("token", token); // 放入持久化存储
              //用户信息放入持久化存储
              this.$mystore.setObj("user", {
                name: aes_usrname,
                pwd: aes_pwd,
              });
              this.$router.push({
                name:"layout"
              });
            } else {
              this.$Message.error(data.err);
            }
          });
      });
    },
  },
  created() {
    this.getSingkey();
  },
  mounted() {},
  destroyed() {}
};
</script>

<style lang="less" scoped>
@import "~@/base.less"; // base.less使用示例
.page-login {
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/image/loginbg.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  .login-form {
    position: absolute;
    // base.less使用示例
    background-color: @black;
    width: 400px;
    height: 300px;
    left: calc(50% - 200px);
    top: calc(50% - 150px);
    padding: 20px 50px;
    border-radius: 10px;
    .form-title {
      line-height: 60px;
      font-size: 20px;
    }
  }
}
</style>