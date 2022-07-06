<template>
  <div class="flex absolute inset-0 bg-[#13232fe6]">
    <div class="container mx-auto flex justify-center items-center">
      <form class="py-10 px-16 rounded-md bg-[#24333C] shadow-[5px_5px_10px_5px]">
        <ul class="flex mb-5">
          <li
            class="cursor-pointer p-[10px_60px] transition-[background-color] duration-300 hover:bg-[#1ab188] hover:text-white"
            :class="[tab.name === currentTab ? 'text-white bg-[#1ab188]' : 'bg-[#435359] text-slate-400']"
            v-for="tab in tabs"
            :key="tab.text"
            @click="currentTab = tab.name"
          >
            {{ tab.text }}
          </li>
        </ul>
        <keep-alive>
          <component :is="currentTab" />
        </keep-alive>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import Register from "@/components/Register.vue";
import Login from "@/components/Login.vue";
export default {
  components: {
    Register,
    Login,
  },
  setup() {
    const tabs = reactive([
      {
        name: "register",
        text: "註冊",
      },
      {
        name: "login",
        text: "登入",
      },
    ]);

    const currentTab = ref("login");

    return {
      tabs,
      currentTab,
    };
  },
};
</script>

<style scoped lang="scss"></style>
