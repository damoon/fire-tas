<template>
  <img
    src="/icon.svg"
    alt="FIRE TAS Logo"
    style="width: 50px; margin: 5px auto 0px"
  />
  <h1>FIRE TAS</h1>

  <!-- General Section -->
  <section class="form-section">
    <h2 @click="toggleSection('general')" class="toggle-header">
      Allgemein {{ sectionStates.general ? "▼" : "►" }}
    </h2>
    <div v-show="sectionStates.general">
      <div class="input-group">
        <label>Inflation (%)</label>
        <input
          type="number"
          v-model="formData.general.inflation"
          step="0.1"
          min="0"
        />
      </div>
      <div class="input-group">
        <label>Mediangehaltssteigerung (%)</label>
        <input
          type="number"
          v-model="formData.general.medianSalaryIncrease"
          step="0.1"
          min="0"
        />
      </div>
      <div class="input-group">
        <label>Gehaltssteigerung (%)</label>
        <input
          type="number"
          v-model="formData.general.salaryIncrease"
          step="0.1"
          min="0"
        />
      </div>
      <div class="input-group">
        <label>Mediangehalt 2023</label>
        <input type="number" v-model="formData.general.medianSalary" />
      </div>
      <div class="input-group">
        <label>Rentenpunktwert 2023</label>
        <input type="number" v-model="formData.general.pensionPointValue" />
      </div>
      <div class="input-group">
        <label>Rentensicherheit (%)</label>
        <input
          type="number"
          v-model="formData.general.pensionRiskAdjustment"
          step="1"
          min="0"
        />
      </div>
      <div class="input-group">
        <label>Rentenalter</label>
        <input type="number" v-model="formData.general.retirementAge" />
      </div>
      <div class="input-group">
        <label>Renditeerwartung (%)</label>
        <input
          type="number"
          v-model="formData.general.expectedReturn"
          step="0.1"
        />
      </div>
      <div class="input-group">
        <label>Steuern auf Rendite (%)</label>
        <input type="number" v-model="formData.general.returnTax" step="0.1" />
      </div>
      <div class="input-group">
        <label>Globales KGV</label>
        <input
          type="number"
          v-model="formData.general.globalPE"
          step="1"
          min="0"
        />
      </div>
    </div>
  </section>

  <!-- Person A Section -->
  <section class="form-section">
    <h2 @click="toggleSection('personA')" class="toggle-header">
      {{ formData.personA.name || "Person A" }}
      {{ sectionStates.personA ? "▼" : "►" }}
    </h2>
    <div v-show="sectionStates.personA">
      <div class="input-group">
        <label>Name</label>
        <input type="text" v-model="formData.personA.name" />
      </div>
      <div class="input-group">
        <label>Geschlecht</label>
        <select v-model="formData.personA.gender">
          <option value="male">Männlich</option>
          <option value="female">Weiblich</option>
        </select>
      </div>
      <div class="input-group">
        <label>Geburtsjahr</label>
        <input type="number" v-model="formData.personA.birthYear" />
      </div>
      <div class="input-group">
        <label>Brutto</label>
        <input type="number" v-model="formData.personA.gross" />
      </div>
      <div class="input-group">
        <label>Netto</label>
        <input type="number" v-model="formData.personA.net" />
      </div>
      <div class="input-group">
        <label>Rentenpunkte</label>
        <input
          type="number"
          v-model="formData.personA.pensionPoints"
          step="0.1"
        />
      </div>
      <div class="input-group">
        <label>BaV aktuell</label>
        <input type="number" v-model="formData.personA.currentCompanyPension" />
      </div>
      <div class="input-group">
        <label>BaV bei Rente</label>
        <input type="number" v-model="formData.personA.companyPension" />
      </div>
    </div>
  </section>

  <!-- Person B Section -->
  <section class="form-section">
    <h2 @click="toggleSection('personB')" class="toggle-header">
      {{ formData.personB.name || "Person B" }}
      {{ sectionStates.personB ? "▼" : "►" }}
    </h2>
    <div v-show="sectionStates.personB">
      <div class="input-group">
        <label>Name</label>
        <input type="text" v-model="formData.personB.name" />
      </div>
      <div class="input-group">
        <label>Geschlecht</label>
        <select v-model="formData.personB.gender">
          <option value="male">Männlich</option>
          <option value="female">Weiblich</option>
        </select>
      </div>
      <div class="input-group">
        <label>Geburtsjahr</label>
        <input type="number" v-model="formData.personB.birthYear" />
      </div>
      <div class="input-group">
        <label>Brutto</label>
        <input type="number" v-model="formData.personB.gross" />
      </div>
      <div class="input-group">
        <label>Netto</label>
        <input type="number" v-model="formData.personB.net" />
      </div>
      <div class="input-group">
        <label>Rentenpunkte</label>
        <input
          type="number"
          v-model="formData.personB.pensionPoints"
          step="0.1"
        />
      </div>
      <div class="input-group">
        <label>BaV aktuell</label>
        <input type="number" v-model="formData.personB.currentCompanyPension" />
      </div>
      <div class="input-group">
        <label>BaV bei Rente</label>
        <input type="number" v-model="formData.personB.companyPension" />
      </div>
    </div>
  </section>

  <!-- Household Section -->
  <section class="form-section">
    <h2 @click="toggleSection('household')" class="toggle-header">
      Haushalt {{ sectionStates.household ? "▼" : "►" }}
    </h2>
    <div v-show="sectionStates.household">
      <div class="input-group">
        <label>Kinderanzahl</label>
        <input
          type="number"
          v-model="formData.household.numberOfChildren"
          min="0"
          step="1"
        />
      </div>
      <div class="input-group">
        <label>Kindsalter</label>
        <input
          type="number"
          v-model="formData.household.childsAge"
          min="0"
          step="1"
        />
      </div>
      <div class="input-group">
        <label>Ausgaben</label>
        <input
          type="number"
          v-model="formData.household.expenses"
          min="0"
          step="1000"
        />
      </div>
      <div class="input-group">
        <label>Coast Fire</label>
        <input type="number" v-model="formData.household.coastAge" />
      </div>
      <div class="input-group">
        <label>Fire</label>
        <input type="number" v-model="formData.household.fireAge" />
      </div>
      <div class="input-group">
        <label>Aktiendepot</label>
        <input
          type="number"
          v-model="formData.household.currentInvestments"
          step="1000"
        />
      </div>
      <div class="input-group">
        <label>Sequence of returns risk premium (%)</label>
        <input
          type="number"
          v-model="formData.household.sequenceOrReturnRiskPremium"
          step="5"
        />
      </div>
    </div>
  </section>

  <!-- Display Section -->
  <section class="form-section">
    <h2 @click="toggleSection('display')" class="toggle-header">
      Darstellung {{ sectionStates.display ? "▼" : "►" }}
    </h2>
    <div v-show="sectionStates.display">
      <div class="input-group">
        <label>Tabelle minimieren</label>
        <input type="checkbox" v-model="formData.display.minimizeTable" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DataTable from "./DataTable.vue";
import type { FormData } from "@/types";

export default defineComponent({
  name: "FireTas",
  components: {
    DataTable,
  },

  data() {
    return {
      sectionStates: {
        general: false,
        personA: false,
        personB: false,
        household: false,
        display: false,
      },
      formData: {
        general: {
          inflation: 3.0,
          salaryIncrease: 1.0,
          medianSalaryIncrease: 2.0,
          medianSalary: 43142,
          pensionPointValue: 39.32,
          pensionRiskAdjustment: 70,
          retirementAge: 67,
          expectedReturn: 7,
          returnTax: 18.375,
          globalPE: 20,
        },
        personA: {
          name: "Person A",
          gender: "male",
          birthYear: 1984,
          gross: 43142,
          net: 28774.5,
          pensionPoints: 20,
          currentCompanyPension: 0,
          companyPension: 0,
        },
        personB: {
          name: "Person B",
          gender: "female",
          birthYear: 1982,
          gross: 43142,
          net: 28774.5,
          pensionPoints: 20,
          currentCompanyPension: 450,
          companyPension: 900,
        },
        household: {
          expenses: 36000,
          coastAge: 55,
          fireAge: 64,
          sequenceOrReturnRiskPremium: 50,
          numberOfChildren: 1,
          childsAge: 2,
          currentInvestments: 100000,
        },
        display: {
          minimizeTable: false,
        },
      } as FormData,
    };
  },

  methods: {
    toggleSection(section: string) {
      Object.keys(this.sectionStates).forEach((key: string) => {
        const sectionKeys = Object.keys(this.sectionStates) as Array<
          keyof typeof this.sectionStates
        >;
        type SectionKey = (typeof sectionKeys)[number];
        this.sectionStates[key as SectionKey] =
          key === section ? !this.sectionStates[key as SectionKey] : false;
      });
    },
  },

  created(): void {
    const savedSections = localStorage.getItem("sectionStates");
    if (savedSections) {
      this.sectionStates = JSON.parse(savedSections);
    }

    const savedData = localStorage.getItem("fireTasData");
    if (savedData) {
      this.formData = JSON.parse(savedData);
    }

    this.$emit("update:formData", this.formData);
  },

  watch: {
    sectionStates: {
      handler(newValue) {
        localStorage.setItem("sectionStates", JSON.stringify(newValue));
      },
      deep: true,
    },
    formData: {
      handler(newValue: FormData): void {
        localStorage.setItem("fireTasData", JSON.stringify(newValue));
        this.$emit("update:formData", newValue);
      },
      deep: true,
    },
  },
});
</script>

<style scoped>
.toggle-header {
  cursor: pointer;
  user-select: none;
}
h1,
h2 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #2c3e50;
}
h1 {
  font-size: 24px;
}
h2 {
  font-size: 20px;
}

.form-section {
  min-width: 250px;
  padding: 20px;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
