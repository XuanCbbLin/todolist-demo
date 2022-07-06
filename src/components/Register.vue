<template>
  <div class="flex flex-col mb-6">
    <label for="emil" class="text-white mb-[8px]">Email</label>
    <input type="text" id="emil" class="mb-[10px] pl-[8px]" v-model="user.email" />
    <span class="text-red-500">{{ errMsg.email }}</span>
    <label for="username" class="text-white mb-[8px]">username</label>
    <input type="text" id="username" class="mb-[10px] pl-[8px]" v-model="user.nickname" />
    <label for="password" class="text-white mb-[8px]">password</label>
    <input type="password" id="password" class="mb-[10px] pl-[8px]" v-model="user.password" />
    <span class="text-red-500">{{ errMsg.password }}</span>
  </div>

  <button class="w-full text-white p-[10px_60px] bg-[#1ab188]" @click.prevent="submitHandler">註冊</button>
  <span class="text-green-300">{{ successMsg }}</span>
</template>

<script>
import axios from "axios";
import { reactive, ref } from "@vue/reactivity";
export default {
  setup() {
    const user = reactive({
      email: "",
      password: "",
      nickname: "",
    });

    const successMsg = ref("");
    const errorMsgArr = ["密碼 字數太少，至少需要 6 個字", "電子信箱 格式有誤", "電子信箱 已被使用"];
    const errMsg = reactive({
      password: "",
      email: "",
    });

    const submitHandler = () => {
      const url = "https://todoo.5xcamp.us/users";

      axios
        .post(url, {
          user: {
            email: user.email,
            nickname: user.nickname,
            password: user.password,
          },
        })
        .then((res) => {
          errMsg.password = "";
          errMsg.email = "";
          successMsg.value = "註冊成功";
        })
        .catch((error) => {
          successMsg.value = "";
          errMsg.password = "";
          errMsg.email = "";
          let newErrorArr = error.response.data.error.filter((str) => {
            return errorMsgArr.includes(str);
          });

          newErrorArr.forEach((str) => {
            if (str.includes("密碼")) {
              errMsg.password = str;
            }

            if (str.includes("電子信箱")) {
              errMsg.email = str;
            }
          });
        });
    };

    return {
      user,
      successMsg,
      errMsg,
      submitHandler,
    };
  },
};
</script>

<style scoped lang="scss"></style>
