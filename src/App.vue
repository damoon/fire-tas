<template>
  <div id="app">
    <div
      class="left-panel"
      :class="{ collapsed: !isPanelExpanded }"
      @click.stop="openPanel"
    >
      <div v-show="isPanelExpanded">
        <FireTas @update:formData="updateFormData" />
      </div>
    </div>
    <div class="main-content" @click="closePanel">
      <DataTable :form-data="formData" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FireTas from "@/components/FireTas.vue";
import DataTable from "@/components/DataTable.vue";

export default defineComponent({
  name: "FIRE TAS",
  components: {
    FireTas,
    DataTable,
  },
  data() {
    return {
      isPanelExpanded: false,
      formData: {},
    };
  },
  methods: {
    openPanel() {
      this.isPanelExpanded = true;
    },
    closePanel() {
      this.isPanelExpanded = false;
    },
    updateFormData(newData) {
      this.formData = newData;
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
  transition: width 0.3s ease;
  border-right: 1px solid #ddd;
}

.left-panel.collapsed {
  width: 50px;
}

.main-content {
  margin-left: 200px;
  transition: margin-left 0.3s ease;
}

.collapsed + .main-content {
  margin-left: 75px;
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
