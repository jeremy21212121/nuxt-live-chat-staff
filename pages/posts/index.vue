<style lang="scss" scoped>
@import '@/scss/colours.scss';

.container {
  justify-content: flex-start;
  h1 {
    margin-top: 72px;
    margin-bottom: 32px;
  }
  .posts {
    display: flex;
    flex-wrap: wrap;
    a {
      width: 100%;
      margin: 12px 4px;
      background-color: $white10;
      color: $white70;
      &:hover {
        background-color: $white20;
      }
      .bodytext {
        max-height: 150px;
        overflow: hidden;
      }
      .row {
        display: flex;
        justify-content: space-around;
      }
    }
  }
}
</style>
<template>
  <main class="container">
    <h1 class="title">Posts</h1>
    <section v-if="responseData.length" class="posts">
      <nuxt-link
        v-for="post in responseData"
        :key="post.id"
        :to="`/posts/${post.id}`"
        class="preview button--grey"
      >
        <div class="row">
          <img v-if="post.fields.image" :src="post.fields.image[0].thumbnails.small.url" :alt="post.fields.image_description">
          <span>
            {{ new Date(post.fields.date).toDateString() }}
          </span>
        </div>
        <div class="row">
          <h2 class="subtitle">
            {{ post.fields.title }}
          </h2>
        </div>
        <div v-html="post.fields.body" class="bodytext" />
      </nuxt-link>
    </section>
    <add-post />
  </main>
</template>

<script>
import Airtable from 'airtable'
import AddPost from '@/components/posts/AddPost.vue'

export default {
  name: 'Posts',
  components: {
    AddPost
  },
  data() {
    return {
      base: null,
      table: 'posts',
      responseData: [],
      responseError: null,
    }
  },
  methods: {
    bodyPreview(string) {
      let output = string;
      if (output.length > 200) {
        output = output.substring(0, 200).trim() + '...'
      }
      return output
    },
    // findPost(id) {
    //   if (!this.base) {
    //     this.base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
    //   }
    //   return this.base('posts').find(id)
    // }
  },
  // mounted() {
    // this.base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
    // this.base('posts').select().all((err, result) => {
    //   if (err) {
    //     this.responseError = err
    //   } else {
    //     this.responseData = result
    //   }
    // })
  // },
  asyncData() {
    const output = {}
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE)
    return new Promise((resolve) => {
      base('posts').select().all((err, result) => {
        if (err) {
          output.responseError = err
        } else {
          // map to rawJson because asyncData serializes the output and we can't serialize functions
          // use the mounted hook instead on pages where we might change the data, avoiding SSR but preserving convenience functions
          output.responseData = result.map(item => item._rawJson)
        }
        resolve(output)
      })
    })
  }
}
</script>
