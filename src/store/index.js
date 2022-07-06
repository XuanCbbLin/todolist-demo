import axios from "axios";
import { defineStore } from "pinia";

export const useStore = defineStore("todoList", {
  state: () => {
    return {
      token: "",
      todo: [],
      isLoad: false,
    };
  },
  getters: {
    processCategory() {
      const currentTodo = {
        all: (currentTag) => this.todo.filter((obj) => obj.content.tag === currentTag),
        done: (currentTag) => this.todo.filter((obj) => obj.completed_at !== null && obj.content.tag === currentTag),
        undone: (currentTag) => this.todo.filter((obj) => obj.completed_at === null && obj.content.tag === currentTag),
      };

      return (currentTab, currentTag) => currentTodo[currentTab](currentTag);
    },
  },
  actions: {
    setToken(resToken) {
      this.token = resToken;
    },
    resetStore() {
      this.$reset();
    },
    getTodo() {
      this.isLoad = false;
      axios
        .get("https://todoo.5xcamp.us/todos", {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          res.data = res.data || {};
          res.data.todos = res.data.todos || [];
          this.todo = res.data.todos;
          this.setTodoContentFormat();
          this.setCheckStatus();
          this.isLoad = true;
        });
    },
    setCheckStatus() {
      this.todo.forEach((obj) => {
        if (obj.completed_at) {
          obj.checkStatus = true;
        } else {
          obj.checkStatus = false;
        }
      });
    },
    setTodoContentFormat() {
      this.todo.forEach((obj) => {
        if (typeof obj.content === "string") {
          obj.content = { text: obj.content.split(",")[0], tag: obj.content.split(",")[1] };
        }
      });
    },
    addTodo(todoContent, currentTag) {
      return axios
        .post(
          "https://todoo.5xcamp.us/todos",
          {
            todo: {
              content: `${todoContent},${currentTag}`,
            },
          },
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        .then((res) => {
          res.data = res.data || {};
          res.data.completed_at = null;
          this.todo.unshift(res.data);
          this.setTodoContentFormat();
        });
    },
    updateTodo(newTodoContent, currentTodoId, tag) {
      return axios
        .put(
          `https://todoo.5xcamp.us/todos/${currentTodoId}`,
          {
            todo: {
              content: `${newTodoContent.value},${tag}`,
            },
          },
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        .then((res) => {
          res.data = res.data || {};
          this.todo.forEach((obj) => {
            if (obj.id === currentTodoId) {
              obj.content.text = newTodoContent.value;
            }
          });
          this.setTodoContentFormat();
        });
    },
    deleteTodo(deleteTodoId) {
      axios
        .delete(`https://todoo.5xcamp.us/todos/${deleteTodoId}`, {
          headers: {
            Authorization: this.token,
          },
        })
        .then(() => {
          this.todo = this.todo.filter((obj) => obj.id !== deleteTodoId);
        });
    },
    changeTodoCheckBox(toggleId) {
      axios
        .patch(
          `https://todoo.5xcamp.us/todos/${toggleId}/toggle`,
          {
            toggleId,
          },
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        .then((res) => {
          res.data = res.data || {};

          this.todo.forEach((obj) => {
            if (obj.id === res.data.id) {
              obj.completed_at = res.data.completed_at;
            }
          });
        });
    },
  },
});
