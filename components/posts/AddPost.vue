<template>
  <div>
    <nuxt-link to="/posts/new" title="Create a new post">
      &plus;
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'AddPostButton',
}
</script>

<style lang="scss" scoped>
div {
  width: 100%;
  position: absolute;
  bottom: 2vh;
  display: flex;
  a {
    margin-left: auto;
    margin-right: 14px;
    border-radius: 50%;
    background-color: firebrick;
    color: rgba(255,255,255,0.8);
    width: 75px;
    height: 75px;
    box-shadow: 0 0 6px hsla(0,0%,100%,.16),0 0 6px hsla(0,0%,100%,.23);
    font-size: 60px;
    text-decoration: none;
  }
}
</style>