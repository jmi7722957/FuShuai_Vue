<template>
  <div id="app">
    <h2>Vue</h2>
    <router-link to="/main">main</router-link>
    <router-link to="/login">login</router-link>
    <router-link to="/test">test</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
</style>
