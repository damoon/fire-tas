<template>
  <div class="fire-tas">
    <h1>FIRE TAS</h1>

    <button class="toggle-button" @click="toggleAllSections">
      {{ isExpanded ? "Eingabefelder ausblenden" : "Eingabefelder anzeigen" }}
    </button>

    <div class="sections-container" v-show="isExpanded">
      <!-- General Section -->
      <section class="form-section">
        <h2>Allgemein</h2>
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
          <input
            type="number"
            v-model="formData.general.returnTax"
            step="0.1"
          />
        </div>
      </section>

      <!-- Person A Section -->
      <section class="form-section">
        <h2>Person A</h2>
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
          <input
            type="number"
            v-model="formData.personA.currentCompanyPension"
          />
        </div>
        <div class="input-group">
          <label>BaV bei Rente</label>
          <input type="number" v-model="formData.personA.companyPension" />
        </div>
      </section>

      <!-- Person B Section -->
      <section class="form-section">
        <h2>Person B</h2>
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
          <input
            type="number"
            v-model="formData.personB.currentCompanyPension"
          />
        </div>
        <div class="input-group">
          <label>BaV bei Rente</label>
          <input type="number" v-model="formData.personB.companyPension" />
        </div>
      </section>

      <!-- Household Section -->
      <section class="form-section">
        <h2>Haushalt</h2>
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
          <label>Ausgaben</label>
          <input type="number" v-model="formData.household.expenses" />
        </div>
        <div class="input-group">
          <label>Rentenwunschalter</label>
          <input
            type="number"
            v-model="formData.household.desiredRetirementAge"
          />
        </div>
        <div class="input-group">
          <label>Aktiendepot</label>
          <input
            type="number"
            v-model="formData.household.currentInvestments"
          />
        </div>
        <div class="input-group">
          <label>Auszahlungsquote (%)</label>
          <input
            type="number"
            v-model="formData.household.payoutRate"
            step="0.1"
          />
        </div>
      </section>
    </div>

    <DataTable :form-data="formData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DataTable from "./DataTable.vue";
import type { FormData, Columns } from "@/types";

export default defineComponent({
  name: "FireTas",
  components: {
    DataTable,
  },

  data() {
    return {
      isExpanded: true,
      formData: {
        general: {
          inflation: 3.0,
          salaryIncrease: 2.0,
          medianSalary: 43142,
          pensionPointValue: 39.32,
          retirementAge: 67,
          expectedReturn: 7,
          returnTax: 18.375,
        },
        personA: {
          birthYear: 1985,
          gross: 43142,
          net: 28774.5,
          pensionPoints: 20,
          currentCompanyPension: 0,
          companyPension: 0,
        },
        personB: {
          birthYear: 1980,
          gross: 43142,
          net: 28774.5,
          pensionPoints: 20,
          currentCompanyPension: 450,
          companyPension: 900,
        },
        household: {
          expenses: 36000,
          desiredRetirementAge: 60,
          payoutRate: 2.7,
          numberOfChildren: 1,
          currentInvestments: 50000,
        },
      } as FormData,
    };
  },

  methods: {
    toggleAllSections(): void {
      this.isExpanded = !this.isExpanded;
      localStorage.setItem("inputSectionsExpanded", String(this.isExpanded));
    },
  },

  mounted(): void {
    const savedExpandedState = localStorage.getItem("inputSectionsExpanded");
    if (savedExpandedState !== null) {
      this.isExpanded = savedExpandedState === "true";
    }

    const savedData = localStorage.getItem("fireTasData");
    if (savedData) {
      this.formData = JSON.parse(savedData);
    }

    const savedColumnState = localStorage.getItem("tableColumnState");
    if (savedColumnState) {
      this.columns = JSON.parse(savedColumnState);
    }
  },

  watch: {
    formData: {
      handler(newValue: FormData): void {
        localStorage.setItem("fireTasData", JSON.stringify(newValue));
      },
      deep: true,
    },
  },
});
</script>

<style scoped>
.toggle-button {
  margin: 20px 0;
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}
.toggle-button:hover {
  background-color: #34495e;
}

.fire-tas {
  padding: 5px;
}

.sections-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: 1400px;
}

.form-section {
  flex: 1;
  min-width: 250px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

h2 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #2c3e50;
}
</style>
