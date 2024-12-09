<template>
  <div class="left-panel">
    <FireTas @update:formData="updateFormData" />
  </div>
  <div class="main-content">
    <DataTable :form-data="formData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FireTas from "@/components/FireTas.vue";
import DataTable from "@/components/DataTable.vue";
import type { FormData } from "@/types";

export default defineComponent({
  name: "FIRE TAS",
  components: {
    FireTas,
    DataTable,
  },
  data() {
    return {
      formData: {
        general: {},
        personA: {},
        personB: {},
        household: {},
      } as FormData,
    };
  },
  methods: {
    updateFormData(formData: FormData) {
      this.formData = formData;
    },
  },
});
</script>

<style>
.left-panel {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 300px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  overflow-x: hidden;
}

.main-content {
  margin-left: 300px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
