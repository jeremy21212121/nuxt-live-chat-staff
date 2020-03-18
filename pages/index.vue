<template>
  <div class="container">
      <h2 class="title">
        {{ title }}
      </h2>
      <div class="apps">
        <subappBox
          v-for="(app, index) in apps"
          :key="`subapp${index}`"
          :app="app"
        />
      </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import Logo from '~/components/Logo.vue'
import subappBox from '@/components/subappBox'
// import NavBar from '@/components/NavBar'

export default {
  name: 'Home',
  components: {
    Logo,
    subappBox
    // NavBar
  },
  data() {
    return {
      title: 'The wax shop staff dashboard',
      apps: [
        {
          name: 'Live chat support dashboard',
          description: 'Respond to live chat questions and view previous conversations',
          path: '/live-chat',
          img: {
            src: require('@/assets/chat.png')
          }
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/colours.scss';

// .title {
//   text-transform: capitalize;
//   margin-top: 60px;
// }

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.apps {
  width: 100%;
  height: 75vh;
  // padding-top: 15px;
}
</style>
