<template>
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
          <td v-show="columns.inflationFactor.visible">
            {{ row.inflationFactor.toFixed(2) }}
          </td>
          <td v-show="columns.expenses.visible">
            {{ formatCurrency(row.expenses) }}
          </td>
          <td v-show="columns.income.visible">
            {{ formatCurrency(row.income) }}
          </td>
          <td v-show="columns.investment.visible">
            {{ formatCurrency(row.investment) }}
          </td>
          <td v-show="columns.totalInvested.visible">
            {{ formatCurrency(row.totalInvested) }}
          </td>
          <td v-show="columns.grossPayout.visible">
            {{ formatCurrency(row.grossPayout) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import type { FormData, Columns, YearlyDataRow } from "@/types";

export default defineComponent({
  name: "DataTable",

  props: {
    formData: {
      type: Object as PropType<FormData>,
      required: true,
    },
  },

  data() {
    return {
      columns: {
        index: { visible: true, label: "#" },
        year: { visible: true, label: "Jahr" },
        ageA: { visible: true, label: "Alter A" },
        ageB: { visible: true, label: "Alter B" },
        inflationFactor: { visible: true, label: "Inflationsfaktor" },
        expenses: { visible: true, label: "Ausgaben" },
        income: { visible: true, label: "Einkommen" },
        investment: { visible: true, label: "Investieren" },
        totalInvested: { visible: true, label: "Aktiendepot" },
        grossPayout: { visible: true, label: "Auszahlungen Brutto" },
      } as Columns,
    };
  },

  methods: {
    toggleColumn(columnKey: string): void {
      if (this.columns[columnKey]) {
        this.columns[columnKey].visible = !this.columns[columnKey].visible;
        localStorage.setItem("tableColumnState", JSON.stringify(this.columns));
      }
    },
    formatCurrency(value: number): string {
      return value.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      });
    },
  },

  computed: {
    yearlyData(): YearlyDataRow[] {
      const currentYear = new Date().getFullYear();
      const birthYearA = this.formData.personA.birthYear;
      const birthYearB = this.formData.personB.birthYear;

      const maxYear = Math.max(birthYearA + 100, birthYearB + 100);

      let totalInvested = this.formData.household.currentInvestments;
      const data: YearlyDataRow[] = [];
      let index = 1;

      for (let year = currentYear; year <= maxYear; year++) {
        const ageA = year - birthYearA;
        const ageB = year - birthYearB;
        const yearsSinceStart = year - currentYear;
        const inflationFactor = Math.pow(
          1 + this.formData.general.inflation / 100,
          yearsSinceStart,
        );
        const salaryIncreaseFactor = Math.pow(
          1 + this.formData.general.salaryIncrease / 100,
          yearsSinceStart,
        );
        const expenses = this.formData.household.expenses * inflationFactor;
        const income =
          (this.formData.personA.net +
            this.formData.personB.net +
            this.formData.household.numberOfChildren * 250 * 12) *
          salaryIncreaseFactor;
        const investment = income - expenses;
        const grossPayout =
          totalInvested * (this.formData.household.payoutRate / 100);

        totalInvested *= 1 + this.formData.general.expectedReturn / 100;
        totalInvested += investment;
        data.push({
          index,
          year,
          ageA,
          ageB,
          inflationFactor,
          expenses,
          income,
          investment,
          totalInvested,
          grossPayout,
        });
        index++;
      }

      return data;
    },
  },

  mounted() {
    const savedColumnState = localStorage.getItem("tableColumnState");
    if (savedColumnState) {
      this.columns = JSON.parse(savedColumnState);
    }
  },
});
</script>

<style scoped>
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
</style>
