<template>
  <div class="money-value-optimizer">
    <h1>Money Value Optimizer</h1>

    <button class="toggle-button" @click="toggleAllSections">
      {{ isExpanded ? "Hide Input Fields" : "Show Input Fields" }}
    </button>

    <div class="sections-container" v-show="isExpanded">
      <!-- General Section -->
      <section class="form-section">
        <h2>General</h2>
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
          <label>Auszahlungsquote (%)</label>
          <input
            type="number"
            v-model="formData.household.payoutRate"
            step="0.1"
          />
        </div>
      </section>
    </div>

    <div class="table-container">
      <div class="column-toggles">
        <button
          v-for="(col, key) in columns"
          :key="key"
          class="column-toggle-button"
          :class="{ active: col.visible }"
          @click="toggleColumn(key.toString())"
        >
          {{ col.label }}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th v-for="(col, key) in columns" :key="key" v-show="col.visible">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in yearlyData" :key="row.year">
            <td v-show="columns.index.visible">{{ row.index }}</td>
            <td v-show="columns.year.visible">{{ row.year }}</td>
            <td v-show="columns.ageA.visible">{{ row.ageA }}</td>
            <td v-show="columns.ageB.visible">{{ row.ageB }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { FormData, Columns, YearlyDataRow } from "@/types";

export default defineComponent({
  name: "MoneyValueOptimizer",

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
        },
      } as FormData,
      columns: {
        index: { visible: true, label: "#" },
        year: { visible: true, label: "Year" },
        ageA: { visible: true, label: "Age A" },
        ageB: { visible: true, label: "Age B" },
      } as Columns,
    };
  },

  methods: {
    toggleAllSections(): void {
      this.isExpanded = !this.isExpanded;
      localStorage.setItem("inputSectionsExpanded", String(this.isExpanded));
    },

    toggleColumn(columnKey: string): void {
      if (this.columns[columnKey]) {
        this.columns[columnKey].visible = !this.columns[columnKey].visible;
        localStorage.setItem("tableColumnState", JSON.stringify(this.columns));
      }
    },
  },

  computed: {
    yearlyData(): YearlyDataRow[] {
      const currentYear = new Date().getFullYear();
      const birthYearA = this.formData.personA.birthYear;
      const birthYearB = this.formData.personB.birthYear;

      const maxYear = Math.max(birthYearA + 100, birthYearB + 100);

      const data: YearlyDataRow[] = [];
      let index = 1;

      for (let year = currentYear; year <= maxYear; year++) {
        data.push({
          index,
          year,
          ageA: year - birthYearA,
          ageB: year - birthYearB,
        });
        index++;
      }

      return data;
    },
  },

  mounted(): void {
    const savedExpandedState = localStorage.getItem("inputSectionsExpanded");
    if (savedExpandedState !== null) {
      this.isExpanded = savedExpandedState === "true";
    }

    const savedData = localStorage.getItem("moneyValueOptimizerData");
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
        localStorage.setItem(
          "moneyValueOptimizerData",
          JSON.stringify(newValue)
        );
      },
      deep: true,
    },
  },
});
</script>

<style scoped>
.money-value-optimizer {
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
.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
  max-width: 1400px;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f5f5f5;
}

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
.table-container {
  margin-top: 20px;
  overflow-x: auto;
  max-width: 1400px;
  margin: 0 auto;
}

.column-toggles {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-left: 12px;
  margin-top: 16px;
}

.column-toggle-button {
  padding: 8px 16px;
  border: 1px solid #2c3e50;
  background-color: white;
  color: #2c3e50;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.column-toggle-button:hover {
  background-color: #f5f5f5;
}

.column-toggle-button.active {
  background-color: #2c3e50;
  color: white;
}
</style>
