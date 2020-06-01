<style lang="scss" scoped>
.container {
  margin-top: 96px;
  justify-content: flex-start;
  a.breadcrumbs {
    // margin-top: 72px;
    margin-right: auto;
    margin-left: 12px;;
    color: rgba(120,120,255,0.75);
    &:visited {
      color: rgba(120,120,255,0.75);
    }
  }
  h1 {
    margin-top: 0px;
    margin-bottom: 32px;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    fieldset {
      margin: 0 12px;
      display: flex;
      flex-direction: column;
      label {
        // width: 100%;
        // width: auto;
        text-align: left;
        margin-bottom: 8px;
      }
      input {
        flex-grow: 1;
        font-size: 1.1rem;
      }
      // input[type="checkbox"] {
      //   flex-grow: 0;
      //   margin-left: 24px;
      //   margin-right: auto;
      //   margin-top: 8px;
      // }
      // input[type="date"] {
      //   flex-direction: row;
      // }
      textarea {
        flex-grow: 1;
        font-size: 1.1rem;
      }
    }
    fieldset.row {
      flex-direction: row;
      align-items: center;
      input {
        flex-grow: 0;
        margin-left: 24px;
        margin-right: auto;
        margin-top: 2px;
      }
      label {
        margin-bottom: 0;
      }
    }
    div.buttons {
      display: flex;
      margin: 12px;
      justify-content: flex-end;
      button[type="submit"] {
        margin-right: 12px;
      }
    }
  }
}
</style>
<template>
  <main class="container">
    <nuxt-link
      to="/posts"
      class="breadcrumbs"
    >
    &lt;- back to Posts
    </nuxt-link>
    <h1 class="title">
      {{ !isNewPost ? 'edit post' : 'create new post'}}
    </h1>
    <form v-if="editJson && (isNewPost) || (responseData)" action="#">
      <fieldset class="row">
        <label for="publishedinput">Published:</label>
        <input v-model="editJson.fields.published" type="checkbox" name="publishedinput" id="publishedinput">
      </fieldset>
      <fieldset class="row">
        <label for="dateinput">Date:</label>
        <input v-model="editJson.fields.date" type="date" name="dateinput" id="dateinput">
      </fieldset>
      <fieldset>
        <label for="titleinput">Title:</label>
        <input v-model="editJson.fields.title" type="text" name="titleinput" id="titleinput">
      </fieldset>
      <fieldset>
        <label for="fileinput">Image:</label>
        <input type="file" name="fileinput" id="fileinput">
      </fieldset>
      <fieldset class="bodyfieldset">
        <label for="bodytext">Body:</label>
         <EditableHtml
           :htmlString="editJson.fields.body"
           :label="'Formatted text'"
           :disabled="!isEditing"
           :reference="'editable'"
           id="bodytext"
           @HtmlChanged="handleHtmlChanged"
         />
        <!-- <textarea v-model="editJson.fields.body" name="bodytext" id="bodytext" cols="30" rows="30"></textarea> -->
      </fieldset>
      <div class="buttons">
        <span>
          {{message}}
        </span>
        <button type="submit" @click.prevent="saveHandler">
          Save
        </button>
        <button @click.prevent="cancelHandler">
          Cancel
        </button>
      </div>
    </form>
  </main>
</template>

<script>
import Airtable from 'airtable'
import EditableHtml from '@/components/EditableHtml.vue'

export default {
  name: 'SinglePost',
  components: {
    EditableHtml
  },
  data() {
    return {
      responseData: null,
      rawJson: null,
      editJson: {
        fields: {
          date: new Date().toISOString().split('T')[0],
          published: false,
          image: [],
          image_description: '',
          title: '',
          body: ''
        }
      },
      error: null,
      message: '',
      isEditing: true,
      isNewPost: this.$route.params.id === 'new'
    }
  },
  methods: {
    base: new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE),
    findPost(id) {
      return this.base('posts').find(id)
    },
    setResponseData(response) {
      this.responseData = response; // the whole response, with convenience functions for updating
      this.rawJson = response._rawJson; // just the raw data
      this.editJson = Object.assign({}, response._rawJson); // a copy of the raw data
    },
    handleHtmlChanged(htmlString) {
      this.editJson.fields.body = htmlString.trim()
    },
    saveHandler() {
      if (!this.isNewPost) {
        // update post
        this.responseData
          .patchUpdate({ body: this.editJson.fields.body, title: this.editJson.fields.title })
          .then(response => {
            this.setResponseData(response);
            this.setMessage('Success!')
          })
          .catch(this.apiErrorHandler)

      } else {
        // create new post
        this.base('posts')
          .create([ this.editJson ])
          .then(response => {
            this.setResponseData(response);
            this.$router.replace(`/posts/${response.id}`);
          })
          .catch(this.apiErrorHandler)
      }
    },
    cancelHandler() {
      this.$router.push('/posts')
    },
    setMessage(msg) {
      this.message = msg;
      setTimeout(()=>{this.message = ''},5000)
    },
    apiErrorHandler(e) {
      this.error = e;
      this.message = e.message
    }
  },
  mounted() {
    if (!this.isNewPost) {

      this.findPost(this.$route.params.id)
        .then(this.setResponseData)
        .catch(this.apiErrorHandler)

    } else {

    }


  }
}
</script>
