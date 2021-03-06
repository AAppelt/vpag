import Vue from "vue";
import VueRouter from "vue-router";
import { publicRoute, protectedRoute } from "./config"

import store from "@/store"
// import pkceAuthProvider from "@/auth/pkceAuthProvider"
import basicAuthProvider from "@/auth/basicAuthProvider"
import customAuthProvider from "@/auth/customAuthProvider"

Vue.use(VueRouter);

const routes = publicRoute.concat(protectedRoute)

const router = new VueRouter({
  mode: "history",
  linkActiveClass: "active",
  // base: process.env.BASE_URL,
  routes: routes
});

const authProviderSlug = process.env.VUE_APP_DISPATCH_AUTHENTICATION_PROVIDER_SLUG

// router guards
router.beforeEach((to, from, next) => {
  store.dispatch("app/setLoading", true)
  if (!store.state.auth.status.loggedIn) {
    if (authProviderSlug === "dispatch-auth-provider-pkce") {
      // pkceAuthProvider.login(to, from, next)
    } else if (authProviderSlug === "dispatch-auth-provider-basic") {
      basicAuthProvider.login(to, from, next)
    } else {
      // defaults to none, allows custom providers
      customAuthProvider.login(to, from, next)
    }
  } else {
    // get user info from the server if we don't already have it
    if (!store.state.auth.userInfo) {
      store.dispatch("auth/getUserInfo")
    }
    next()
  }
})

router.afterEach(function() {
  store.dispatch("app/setLoading", false)
})

export default router;
