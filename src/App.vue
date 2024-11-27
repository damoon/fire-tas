<template>
  <div
    class="left-panel"
    :class="{ collapsed: !isPanelExpanded }"
    @click.stop="openPanel"
  >
    <div v-show="isPanelExpanded">
      <FireTas @update:formData="updateFormData" />
    </div>
    <div v-show="!isPanelExpanded" class="collapsed-text">
      <img
        src="/icon.svg"
        alt="FIRE TAS Logo"
        style="width: 24px; vertical-align: top"
      />
      FIRE TAS - Einstellungen
    </div>
  </div>
  <div class="main-content" @click="closePanel">
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
      isPanelExpanded: false,
      formData: {
        general: {},
        personA: {},
        personB: {},
        household: {},
      } as FormData,
    };
  },
  methods: {
    openPanel() {
      this.isPanelExpanded = true;
    },
    closePanel() {
      // this.isPanelExpanded = false;
    },
    updateFormData(formData: FormData) {
      this.formData = formData;
    },
  },
  created() {
    // Initialize isPanelExpanded from localStorage
    const savedState = localStorage.getItem("isPanelExpanded");
    if (savedState !== null) {
      this.isPanelExpanded = JSON.parse(savedState);
    }
  },
  watch: {
    isPanelExpanded(newValue) {
      // Save isPanelExpanded to localStorage
      localStorage.setItem("isPanelExpanded", JSON.stringify(newValue));
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
}

.left-panel.collapsed {
  width: 50px;
  cursor: pointer;
  user-select: none;
}

.collapsed-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  white-space: nowrap;
  font-size: 24px;
}

.main-content {
  margin-left: 300px;
}

.collapsed + .main-content {
  margin-left: 50px;
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
