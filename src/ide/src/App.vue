<template>
  <prism-editor class="my-editor" v-model="code" :highlight="highlighter" line-numbers ref="editor" @click="focus"></prism-editor>
</template>

<script lang="ts">
  import { PrismEditor } from 'vue-prism-editor';
  import 'vue-prism-editor/dist/prismeditor.min.css';

  import { highlight, languages } from 'prismjs/components/prism-core';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-javascript';
  import 'prismjs/components/prism-java';
  import 'prismjs/themes/prism-tomorrow.css';

  export default {
    components: {
      PrismEditor,
    },
    data() {
      return {
         code: `
package example;
import java.util.ArrayList;
import java.util.List;

public class Example {
  private ArrayList<String> names;

  public Example() {
    names = new ArrayList<>();
    names = "hello";
  }

  public void addName(String name) {
    names.add(name);
  }

  public List<String> getNames() {
    return new ArrayList<>(names);
  }
}
`
      }
    },
    methods: {
      highlighter(code) {
        return highlight(code, languages.java); // languages.<insert language> to return html with markup
      },
      focus() {
        console.log(this.$refs.editor)
      },
    },
  };
</script>

<style>
  /* required class */

  .my-editor {
    background: #2d2d2d;
    color: #ccc;

    /* you must provide font-family font-size line-height. Example: */
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    height: 100vh;
  }

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>