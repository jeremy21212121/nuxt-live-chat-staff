<style lang="scss" scoped>
@import '@/scss/colours.scss';

a {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 48%;
  height: 240px;
  margin-left: 1%;
  // transition: color 300ms ease;
  padding: 30px;
  &:hover {
    h3, span {
      color: $black80;
    }
  }
}
img {
  width: 50%;
  max-width: 95px;
}
h3 {
  color: $light;
  text-transform: capitalize;
}
.description {
  color: $light;
  // margin-top: 20px;
}
@media screen and (max-width: 420px) {
  a {
    width: 96%;
    height: auto;
  }
}
</style>

<template>
  <nuxt-link
    class="button--grey subapp-box"
    :to="app.path"
  >
    <img :src="app.img.src" alt="app.name">
    <h3>{{ app.name }}</h3>
    <span class="description">
      {{ app.description }}
    </span>
  </nuxt-link>
</template>

<script>
export default {
  name: 'subappBox',
  props: {
    app: Object
  }
}
</script>