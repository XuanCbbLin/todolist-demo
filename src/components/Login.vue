<template>
  <div class="flex flex-col mb-3">
    <label for="emil" class="text-white mb-[8px]">Email</label>
    <input type="text" id="emil" class="mb-[10px] pl-[8px]" v-model="user.email" />
    <span class="text-red-500"></span>
    <label for="password" class="text-white mb-[8px]">password</label>
    <input type="password" id="password" class="mb-[10px] pl-[8px]" v-model="user.password" />
    <span class="text-red-500"></span>
  </div>
  <label class="inline-block mb-3">
    <input type="checkbox" class="mr-2" v-model="isKeepLogin" />
    <span class="text-white">保持登入</span>
  </label>
  <button class="w-full text-white p-[10px_60px] bg-[#1ab188]" @click.prevent="submitHandler">登入</button>
  <span :class="`text-${responseMsg.color}`">{{ responseMsg.text }}</span>
</template>

<script>
import axios from "axios";
import { reactive, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";

export default {
  setup() {
    const user = reactive({
      email: "",
      password: "",
    });

    const responseMsg = reactive({
      text: "",
      color: "",
    });

    const router = useRouter();
    const isKeepLogin = ref(false);

    const submitHandler = () => {
      const url = "https://todoo.5xcamp.us/users/sign_in";

      axios
        .post(url, {
          user: {
            email: user.email,
            password: user.password,
          },
        })
        .then((res) => {
          const date = new Date();
          const twelveClock = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            hour: 0,
            minutes: 0,
            seconds: 0,
          };

          const endTime = new Date(twelveClock.year, twelveClock.month - 1, twelveClock.date + 1, twelveClock.hour, twelveClock.minutes, twelveClock.seconds).getTime();

          responseMsg.text = res.data.message;
          responseMsg.color = "green-300";

          if (isKeepLogin.value === false) {
            sessionStorage.setItem("token", res.headers.authorization);
          }

          if (isKeepLogin.value === true && !localStorage.getItem("endTime")) {
            localStorage.setItem("endTime", String(endTime));
            localStorage.setItem("token", res.headers.authorization);
          }

          router.push("/todolist");
        })
        .catch((error) => {
          responseMsg.text = error.response.data.message;
          responseMsg.color = "red-500";
        });
    };

    return { user, responseMsg, isKeepLogin, submitHandler };
  },
};
</script>

<style scoped lang="scss"></style>
