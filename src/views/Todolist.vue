<template>
  <div class="bg-[#13232fe6]">
    <button class="block ml-auto px-5 py-5 text-lg text-white bg-[#435359] hover:bg-[#1ab188]" @click="logOutHandler">登出</button>
    <div class="container flex flex-col mx-auto pt-10">
      <div class="w-9/12 mx-auto pb-5">
        <div class="flex mb-8">
          <input type="text" class="flex-grow pl-2" v-model="inputTodoContent" @keyup.enter="addTodoContentHandler" />
          <button class="text-white bg-[#435359] px-5 py-3 hover:bg-[#1ab188]" @click="addTodoContentHandler">新增</button>
        </div>
        <ul class="flex items-center mb-5">
          <span class="mr-2 text-white">tag:</span>
          <li
            class="cursor-pointer mr-4 text-white hover:bg-[#1ab188]"
            :class="[currentTag === tag.text ? 'bg-[#1ab188]' : 'bg-[#435359]']"
            v-for="tag in tagList"
            :key="tag"
            @click="currentTag = tag.text"
          >
            <router-link class="inline-block p-2" :to="`/todolist/${tag.text}`">{{ tag.text }}</router-link>
          </li>
        </ul>
        <ul class="flex mb-14 text-center text-white">
          <li
            class="w-1/3 py-4 cursor-pointer hover:bg-[#1ab188]"
            :class="[currentTab === tab.title ? 'bg-[#1ab188]' : 'bg-[#435359]']"
            v-for="tab in tabList"
            :key="tab.title"
            @click="tabChangeTodoHandler(tab.title)"
          >
            {{ tab.text }}
          </li>
        </ul>
        <ul class="text-white" v-if="store.isLoad">
          <li class="flex items-center mb-6" v-for="todo in todoList" :key="todo.id">
            <template v-if="currentTodoId !== todo.id">
              <label>
                <input type="checkbox" class="mr-2" v-model="todo.checkStatus" @change="store.changeTodoCheckBox(todo.id)" />
                <span class="bg-[#1ab188] rounded-lg px-2 py-1">{{ todo.content.tag }}</span>
                {{ todo.content.text }}
              </label>
              <button class="ml-auto px-4 py-2 bg-[#435359] hover:bg-[#1ab188]" @click="modifyTodoHandler(todo.id, todo.content)">修改</button>
              <button class="ml-4 px-4 py-2 bg-[#435359] hover:bg-[#1ab188]" @click="store.deleteTodo(todo.id)">刪除</button>
            </template>
            <template v-else>
              <input type="text" class="flex-grow pl-2 text-black" v-model="newTodoContent" />
              <button class="ml-5 px-4 py-2 bg-[#435359] hover:bg-[#1ab188]" @click="updateTodoHandler(todo.content.tag)">更新</button>
              <button class="ml-10 px-4 py-2 bg-[#435359] hover:bg-[#1ab188]" @click="currentTodoId = ''">取消</button>
            </template>
          </li>
        </ul>
        <img src="@/assets/load.gif" alt="load" class="m-auto w-12" v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "../store/index";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const tabList = [
      { title: "all", text: "全部" },
      { title: "done", text: "完成" },
      { title: "undone", text: "未完成" },
    ];
    const currentTab = ref("all");
    const tagList = [{ text: "work" }, { text: "private" }, { text: "family" }];
    const currentTag = ref("work");
    const todoList = computed(() => store.processCategory(currentTab.value, currentTag.value));
    const currentTodoId = ref("");
    const inputTodoContent = ref("");
    const newTodoContent = ref("");

    store.getTodo();

    const tabChangeTodoHandler = (tabTitle) => {
      currentTab.value = tabTitle;
    };

    const addTodoContentHandler = async () => {
      if (inputTodoContent.value === "") return;
      await store.addTodo(inputTodoContent.value, currentTag.value);
      inputTodoContent.value = "";
    };

    const modifyTodoHandler = (todoId, oldTodoContent) => {
      currentTodoId.value = todoId;
      newTodoContent.value = oldTodoContent.text;
    };

    const updateTodoHandler = async (tag) => {
      if (newTodoContent.value === "") return;
      await store.updateTodo(newTodoContent, currentTodoId.value, tag);
      currentTodoId.value = "";
    };

    const logOutHandler = () => {
      const signOutUrl = "https://todoo.5xcamp.us/users/sign_out";

      axios
        .delete(signOutUrl, {
          headers: {
            Authorization: store.token,
          },
        })
        .then(() => {
          store.resetStore();
          localStorage.clear();
          sessionStorage.clear();
          router.replace("/");
        });
    };

    return {
      store,
      todoList,
      currentTodoId,
      tabList,
      currentTab,
      inputTodoContent,
      newTodoContent,
      tagList,
      currentTag,
      tabChangeTodoHandler,
      addTodoContentHandler,
      modifyTodoHandler,
      updateTodoHandler,
      logOutHandler,
    };
  },
};
</script>

<style></style>
