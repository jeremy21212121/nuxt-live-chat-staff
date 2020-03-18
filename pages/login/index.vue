<template>
  <div class="container">
    <!-- <nav-bar /> -->
    <div class="links">
      <h1 class="title">
        Staff Dashboard
      </h1>
      <a
        @click.prevent="$auth.loginWith('google')"
        href="/"
        class="button--green"
      >
        Log in with <span class="hl">@waxshop.ca</span> email
      </a>
    </div>
    <footer>
      <img :src="require('@/assets/info.png')" alt="info" aria-hidden="true">
      This is the staff website for <a class="hl" href="https://waxshop.ca" target="_blank" rel="noopener">The Wax Shop Kelowna</a>. If you are looking for our public website, please follow <a href="https://waxshop.ca" target="_blank" rel="noopener">this link</a>.
    </footer>
  </div>
</template>

<script>
// import NavBar from '~/components/NavBar.vue'

export default {
  name: 'Login',
  components: {
    // NavBar
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/colours.scss';

.links {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 50vh;
  a {
    text-transform: capitalize;

  }
}
footer {
  font-size: 1.1rem;
  padding: 0 16px;
  color: $white70;
  img {
    width: 24px;
  }
  a {
    color: $white80;
  }
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: $light;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
.hl {
  color: rgba(200, 155, 61, 0.9);
  text-shadow: 0 0 1px hsla(0,0%,100%,.16), 0 0 1px hsla(0,0%,100%,.23);
}
</style>
