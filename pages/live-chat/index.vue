<style lang="scss" scoped>
section {
  width: 100%;
  height: 66vh;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
}
</style>

<template>
  <main class="container">
    <!-- <nav-bar /> -->
    <h1 class="title">
      {{ title }}
    </h1>
    <section class="sub">
      <subapp-box
        v-for="(sub, index) in subs"
        :key="`subl${index}`"
        :app="sub"
      />
    </section>
  </main>
</template>

<script>
// import NavBar from '@/components/NavBar'
import subappBox from '@/components/subappBox'

export default {
  name: 'LiveChatSupport',
  components: {
    // NavBar,
    subappBox
  },
  data() {
    return {
      title: 'Live chat support dashboard',
      subs: [
        {
          name: 'Live chat support',
          description: 'Respond to live chat questions from waxshop.ca',
          path: '/live-chat/live',
          img: {
            src: require('@/assets/chat.png')
          }
        },
        {
          name: 'View previous chats',
          description: 'Historical log of previous live chat conversations',
          path: '/live-chat/history',
          img: {
            src: require('@/assets/time.png')
          }
        }
      ]
    }
  }
}
</script>