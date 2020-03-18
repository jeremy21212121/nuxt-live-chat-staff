<style lang="scss" scoped>
@import '@/scss/colours.scss';
main.container {
  margin-top: 60px;
  section.heading {
    width: 100%;
    .status {
      display: flex;
      justify-content: center;
      align-items: center;
      span.indicator {
        display: block;
        width: 20px;
        height: 20px;
        margin-left: 8px;
        background-color: $red80;
        border-radius: 50%;
        transition: background-color 300ms ease;
        &.active {
          background-color: $green80;
        }
      }
      a {
        font-size: 0.8rem;
        display: inline-block;
        border-radius: 4px;
        text-decoration: none;
        padding: 5px 10px;
        margin-left: 20px;
        transition: color, background-color 300ms ease;
        &.red {
          border: 1px solid $red80;
          color: $red80;
          -webkit-tap-highlight-color: $red80;
          &:hover {
            background-color: $red80;
            color: $white80;
          }
        }
        &.green {
          border: 1px solid $green80;
          color: $green80;
          -webkit-tap-highlight-color: $green80;
          &:hover {
            background-color: $green80;
            color: $white80;
          }
        }
      }
    }
    h1.title {
      margin: 0;
    }
  }
}
section.convos {
  width: 100%;
  height: 75vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .chatbox {
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    max-height: 150px;
    min-width: 95%;
    max-width: 96%;
    transition: all 300ms ease;
    animation: 300ms appear ease;
    color: $light;
    div {
      width: 100%;
      .new {
        text-align: right;
        animation: 300ms appear ease;
        // color: $light;
      }
      .alert {
        position: relative;
        left: 25%;
        bottom: 10px;
        display: inline-block;
        background-color: yellow;
        border-radius: 50%;
        color: $black80;
        width: 24px;
        height: 24px;
        font-size: 22px;
        font-weight: bold;
        transition: all 300ms ease;
        animation: 300ms appear ease;
      }
    }
    img {
      // transform: scale(2);
      width: 40px;
      height: 40px;
    }
    h3 {
      text-transform: capitalize;
      // color: $light;
    }
    &:hover {
      color: $black90;
    }
  }
}
@media screen and (min-width: 720px) {
  main.container {
    section.convos {
      a.chatbox {
        min-width: 47%;
        max-width: 48%;
      }
    }
  }
  
}
</style>
<template>
  <main class="container">
    <section class="heading">
      <div v-if="ioSocket" class="status">
        <span>Connected: </span>
        <span class="indicator" :class="{ active: chatSessions.isActive }" :title="(() => { const con = chatSessions.isActive ? 'connected' : 'disconnected'; return `You are ${con}`})()"></span>
        <a @click.prevent="statusBar.a.action" :href="statusBar.a.href" :class="statusBar.a.class" :title="`Click to ${statusBar.a.text}`">{{ statusBar.a.text }}</a>
      </div>
      <h1 class="title">{{ title }}</h1>
    </section>
    <section class="convos">
      <a
        v-for="(convo, index) in chatSessions.conversations"
        :key="`chatbox${index}`"
        href="#"
        class="button--grey chatbox"
      >
        <div v-if="convo.lastRead < convo.messages[convo.messages.length - 1].time">
          <span v-if="true" class="new">New message(s) from:</span>
          <span class="alert">!</span>
        </div>
        <img :src="convo.identicon" :alt="convo.humanId" :title="convo.humanId">
        <h3>{{ convo.humanId }}</h3>

      
      </a>
    </section>
  </main>
</template>
<script>
import io from '@/node_modules/socket.io-client/dist/socket.io.slim'
// import io from 'socket.io-client'
import humanHash from '@/mixins/humanHash'
import sha1 from 'crypto-js/sha1'
import Identicton from 'identicon.js'
export default {
  name: 'LiveSupportChat',
  mixins: [ humanHash ],
  data() {
    return {
      title: 'Live support chat',
      subtitle: 'Active chat sessions',
      // baseUrl: this.$auth.ctx.env.BASE_URL,
      baseUrl: process.env.BASE_URL,
      socketSlug: process.env.SOCKET_SLUG,
      chatSessions: {
        isActive: false,
        conversations: []
      },
      ioSocket: null
    }
  },
  mounted() {
    console.log('mounted')
    if (!this.$isServer) {
      this.ioSocket = io(`/${this.socketSlug}staff`, { path: '/ws/v1/socket.io' })
      this.ioSocket.on('connect', () => { this.chatSessions.isActive = true })
      this.ioSocket.on('chatEvent', this.chatEventHandler)
      this.ioSocket.on('echoChatEvent', this.echoChatEventHandler)
      this.ioSocket.on('disconnect', () => { this.chatSessions.isActive = false })
    }
  },
  methods: {
    // Identicton: require('identicon.js'),
    identictonDataUri(sid) {
      const b64PngIdenticton = new Identicton(sha1(sid).toString(), 20)
      return `data:image/png;base64,${b64PngIdenticton}`
    },
    chatEventHandler(chatEvent) {
      const convo = this.chatSessions.conversations.find((obj) => obj.id === chatEvent.from)
      if (!convo) {
        const socketId = chatEvent.from.replace(/\/client#/, '')
        this.chatSessions.conversations.push({
          id: chatEvent.from,
          humanId: this.humanHash(socketId),
          identicon: this.identictonDataUri(socketId),
          messages: [ chatEvent ],
          lastRead: 0,
          archived: false
        })
      } else {
        convo.messages.push(chatEvent)
      }
    },
    echoChatEventHandler(echoChatEvent) {
      const convo = this.chatSessions.conversations.find((obj) => obj.id === echoChatEvent.to)
      if (!convo) {
        this.chatSessions.conversations.push({
          id: echoChatEvent.to,
          humanId: this.humanHash(echoChatEvent.to.replace(/\/client#/, '')),
          messages: [ echoChatEvent ]
        })
      } else {
        convo.messages.push(echoChatEvent)
      }
    }
  },
  computed: {
    statusBar() {
      return {
        a: {
          href: this.chatSessions.isActive ? '/disconnect' : '/connect',
          text: this.chatSessions.isActive ? 'Disconnect' : 'Reconnect',
          class: this.chatSessions.isActive ? 'red' : 'green',
          action: () => this.chatSessions.isActive ? this.ioSocket.disconnect() : this.ioSocket.connect()
        }
      }
    }
  }
}
</script>