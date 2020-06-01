<template>
  <div name="content-editable" class="editable pt-2 mb-4">
    <!-- <label class="ml-2" for="content-editable">{{label}}</label> -->
    <div
      class="inner-editable"
      :contenteditable="!disabled"
      :ref="reference"
      :label="label"
      @input="htmlChanged"
      v-html="componentHtmlString"
    ></div>
    <span class="message">{{ message }}</span>
    <button
      v-if="hasClipboard"
      @click.prevent="pasteStuff"
    >
      Paste
    </button>
  </div>
</template>
<script>
export default {
  name: 'EditableHTML',
  props: {
    htmlString: String,
    label: String,
    message: {
      default: () => 'Paste formatted text above',
      type: String,
    },
    disabled: {
      default: () => false,
      type: Boolean,
    },
    reference: {
      default: () => 'editable',
      type: String,
    },
  },
  data() {
    return {
      componentHtmlString: '',
      elementRef: null,
    };
  },
  computed: {
    hasClipboard() {
      return !!(navigator && navigator.clipboard)
    }
  },
  watch: {
    htmlString(val) {
      this.componentHtmlString = val;
    },
  },
  mounted() {
    this.componentHtmlString = this.htmlString;
    this.elementRef = this.$refs[this.reference];
    document.execCommand('InsertHTML', true, '<br>');
    document.execCommand('defaultParagraphSeparator', true, '<br>');
  },
  methods: {
    // this function is not currently being used
    salvageInnerText(el) {
      // some elements not in the whitelist could conceivably have important text content in them. It is unlikely but possible. This function will grab the elements innerText and put it into a plain old p element.
      const txt = el.innerText.trim();
      if (txt.length > 0) {
        // there is txt for salvaging!
        const pEl = document.createElement('p');
        pEl.innerText = txt;
        el.replaceWith(pEl);
      }
    },
    htmlChanged(event) {
      // console.log(event.target.innerHTML);
      const htmlString = event.target.innerHTML;
      const safeString = this.processHtml(htmlString);
      this.$emit('HtmlChanged', safeString);
    },
    elWhitelist(el) {
      const approvedTags = [ 'A', 'BR', 'P', 'UL', 'OL', 'LI', 'B', 'EM', 'STRONG', 'I', 'S', 'DEL', 'U', 'STRIKE', 'H1', 'H2', 'H3', 'H4' ];
      return approvedTags.includes(el.tagName);
    },
    removeAllAttr(el) {
      // allowed attributes, by tag name
      const whitelist = { 'A': ['href'] }
      // array of allowed attributes for this tag name, or empty array if none
      const allowedAttrs = whitelist.hasOwnProperty(el.tagName) ? whitelist[el.tagName] : []
      // array of attrs to remove
      const attrs = el.getAttributeNames()
        .filter(name => !allowedAttrs.includes(name.toLocaleLowerCase()))
      // removes all attributes from an element (unless in whitelist), including classes, inline styles, onload, etc
      if (attrs.length > 0) {
        attrs.forEach(attr => el.removeAttribute(attr));
      }
    },
    processHtml(string) {
      const div = document.createElement('div'); // a container element that will handle parsing html string. We return this elements innerHTML at the end.
      div.innerHTML = string;// parse html string
      const walker = document.createTreeWalker(div, NodeFilter.SHOW_ELEMENT); // this allows us to traverse all the child elements of div
      const elementsToRemove = []; // elements to remove after we walk the dom nodes. Removing the element before we finish walking everything breaks TreeWalker.nextNode() and it all falls apart.
      while (walker.nextNode()) { // nextNode() returns undefined when we have visited every element
        if (walker.currentNode.tagName === 'LI' && walker.currentNode.firstElementChild && walker.currentNode.firstElementChild.tagName === 'P') {
          walker.currentNode.innerHTML = walker.currentNode.firstElementChild.innerHTML; // handle edge case where LI text is needlessly wrapped in a P
        }
        if (walker.currentNode.tagName === 'P' && walker.currentNode.innerText.trim() === '' && !elementsToRemove.includes(walker.currentNode)) {
          elementsToRemove.push(walker.currentNode); // discard paragraphs that contain no text
        }
        this.removeAllAttr(walker.currentNode); // remove all attributes (class, style, onload, etc)
        const whiteListed = this.elWhitelist(walker.currentNode);
        if (!whiteListed && !elementsToRemove.includes(walker.currentNode)) {
          elementsToRemove.push(walker.currentNode); // if it is not whitelisted and not already slated for removal, add it to removal list
        }
      }
      elementsToRemove.forEach(el => el.remove());
      return div.innerHTML;// we have mutated div, so we just need to return the div's innerHTML
    },
    pasteStuff() {
      if (!navigator || !navigator.clipboard) return;
      navigator.clipboard.readText()
        .then(txt => {
          this.$emit('HtmlChanged', this.processHtml(txt))
        })
    }
    // handleClick(e) {
    //   const selection = window.getSelection()
    //   if (selection.type !== 'Range' || selection.anchorNode !== selection.focusNode) return
    //   const text = selection.anchorNode.innerText
    //   const replaceText = `<em>${selection.toString()}</em>`
    //   // e.target.innerHTML = `<em>${text}</em>`
    //   // this.htmlChanged(e)
    //   console.log(selection)

    // }
  },
};

//          <EditableHTML
//            :htmlString="this.elementData.mutable.html_txt"
//            :label="'HTML text'"
//            :disabled="!isEditing"
//            :reference="'editable'"
//            @HtmlChanged="handleHtmlChanged"
//          />
</script>
<style lang="scss" scoped>
@import '@/scss/boxShadows.scss';

.content-editable {
  min-height: 96px;
}
.editable {
  min-height: 96px;
  width: 100%;
  background: rgba(255,255,255,.06);
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  /* border-bottom: 2px solid rgba(0,0,0,.42); */
  button {
    @include bs-white-0b;
  }
}
.editable:hover {
  background: rgba(255,255,255,.12);
  /* border-bottom: 2px solid rgba(0,0,0,.84); */
}
.editable label {
  color: rgba(255,255,255,.54);
  font-size: 13px;
}
.inner-editable {
  width: 100%;
  min-height: 80px;
  border-bottom: 2px solid rgba(255,255,255,.42);
  text-align: left;
}
.editable:hover .inner-editable {
  border-bottom: 2px solid rgba(255,255,255,.84);
}
span.message {
  color: rgba(255,255,255,.54);
}
</style>
<style lang="scss">
// unscoped so styles apply to contents of the contenteditable div
.inner-editable {
  p,h1,h2,h3,h4 {
    margin: 16px 4px;
    &:focus {
      background-color: rgba(245,10,0,0.3);
    }
  }
}
</style>
