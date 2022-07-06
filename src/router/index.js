import { createRouter, createWebHashHistory } from "vue-router";
import Entrance from "@/views/Entrance.vue";
import Todolist from "@/views/Todolist.vue";
import { useStore } from "../store/index";

const routes = [
  {
    path: "/",
    name: "home",
    component: Entrance,
  },
  {
    path: "/todolist",
    name: "todolist",
    component: Todolist,
    children: [
      {
        path: ":tag",
        component: Todolist,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const currentTime = new Date().getTime();
  const endTime = Number(localStorage.getItem("endTime"));
  const store = useStore();

  const path = to.matched[0].path;

  const pathChange = {
    "/": () => {
      if (localStorage.getItem("token") && currentTime < endTime) {
        next({ path: "/todolist" });
      } else {
        localStorage.clear();
        next();
      }
    },
    "/todolist": () => {
      if (sessionStorage.getItem("token")) {
        store.setToken(sessionStorage.getItem("token"));
        next();
        return;
      }

      if (!localStorage.getItem("token")) {
        next({ path: "/" });
      }

      if (localStorage.getItem("token")) {
        if (currentTime < endTime) {
          store.setToken(localStorage.getItem("token"));
          next();
        } else {
          localStorage.clear();
          next({ path: "/" });
        }
      }
    },
  };

  pathChange[path]();
});

export default router;
