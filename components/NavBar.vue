<style lang="scss" scoped>
nav {
  animation: 500ms appear;
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  div {
    width: 66%;
    max-width: 420px;
  }
  a {
    text-transform: capitalize;
    padding: 10px 20px;
    align-self: center;
    font-size: 0.7rem;
  }
}
</style>
<template>
  <nav>
    <div>
      <logo />
    </div>
      <a
        @click.prevent="logInOut.action"
        :href="logInOut.path"
        class="button--green log"
      >
        {{ logInOut.text }}
      </a>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import Logo from '@/components/Logo'

export default {
  name: 'NavBar',
  components: {
    Logo
  },
  data() {
    return {

    }
  },
  computed: {
   ...mapState(['auth']),
    logInOut() {
      const loggedIn = this.auth.loggedIn;
      return {
        text: loggedIn ? 'Log out' : 'Log in',
        path: loggedIn ? '/logout' : '/login',
        action: () => {
          if (loggedIn) {
            this.$auth.logout()
            this.$router.push('/login')
          } else {
            this.$auth.login('google')
          }
        }
      }
    }
  }
}
</script>