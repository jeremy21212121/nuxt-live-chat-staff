<script>
import NavBar from '~/components/NavBar.vue'
export default {
  name: 'DefaultLayout',
  components: {
    NavBar
  }
}
</script>
<template>
  <div>
    <nav-bar />
    <nuxt />
  </div>
</template>

<style lang="scss">
@import '@/scss/colours.scss';

html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: $darkgrey;
  color: $white80;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  animation: appear 500ms;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 42px;
  color: $primary;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin-top: 60px;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid $secondary;
  color: $secondary;
  text-decoration: none;
  padding: 10px 30px;
  -webkit-tap-highlight-color: $secondary;
  transition: color, background-color 300ms ease;
}

.button--green:hover {
  color: $white80;
  background-color: $secondary;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid $primary;
  color: $primary;
  text-decoration: none;
  padding: 10px 30px;
  // margin-left: 15px;
  -webkit-tap-highlight-color: $primary;
  transition: color, background-color 300ms ease;
}

.button--grey:hover {
  color: $white80;
  background-color: $primary;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
