<template>
  <div class="view-toggles">
    <button
      v-for="view in views"
      :key="view.name"
      @click="activateView(view.name)"
      :class="{ active: currentView === view.name }"
    >
      {{ view.name }}
    </button>
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
        <tr
          v-for="row in yearlyData.filter((row) => row.year > 2000)"
          :key="row.year"
          :class="{
            deficit:
              Math.round(row.income) < Math.round(row.expenses) ||
              row.totalInvested < 0,
          }"
        >
          <td v-show="columns.index.visible">{{ row.index }}</td>
          <td v-show="columns.year.visible">{{ row.year }}</td>
          <td v-show="columns.ageA.visible">{{ row.ageA }}</td>
          <td v-show="columns.ageB.visible">{{ row.ageB }}</td>
          <td v-show="columns.inflationFactor.visible">
            {{ row.inflationFactor.toFixed(2) }}
          </td>
          <td v-show="columns.medianSalaryIncreaseFactor.visible">
            {{ row.medianSalaryIncreaseFactor.toFixed(2) }}
          </td>
          <td v-show="columns.salaryIncreaseFactor.visible">
            {{ row.salaryIncreaseFactor.toFixed(2) }}
          </td>
          <td v-show="columns.earnings.visible">
            {{ formatCurrency(row.earnings) }}
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
          <td v-show="columns.netPayout.visible">
            {{ formatCurrency(row.netPayout) }}
          </td>
          <td v-show="columns.medianSalary.visible">
            {{ formatCurrency(row.medianSalary) }}
          </td>
          <td v-show="columns.grossA.visible">
            {{ formatCurrency(row.grossA) }}
          </td>
          <td v-show="columns.grossB.visible">
            {{ formatCurrency(row.grossB) }}
          </td>
          <td v-show="columns.retirementPointsA.visible">
            {{ row.retirementPointsA.toFixed(2) }}
          </td>
          <td v-show="columns.retirementPointsB.visible">
            {{ row.retirementPointsB.toFixed(2) }}
          </td>
          <td v-show="columns.retirementPoints.visible">
            {{ row.retirementPoints.toFixed(2) }}
          </td>
          <td v-show="columns.retirementPointsTotalA.visible">
            {{ row.retirementPointsTotalA.toFixed(2) }}
          </td>
          <td v-show="columns.retirementPointsTotalB.visible">
            {{ row.retirementPointsTotalB.toFixed(2) }}
          </td>
          <td v-show="columns.retirementPointsTotal.visible">
            {{ row.retirementPointsTotal.toFixed(2) }}
          </td>
          <td v-show="columns.retirementPointValue.visible">
            {{ formatCurrency(row.retirementPointValue) }}
          </td>
          <td v-show="columns.retirementGross.visible">
            {{ formatCurrency(row.retirementGross) }}
          </td>
          <td v-show="columns.retirementNet.visible">
            {{ formatCurrency(row.retirementNet) }}
          </td>
          <td v-show="columns.income.visible">
            {{ formatCurrency(row.income) }}
          </td>
          <td v-show="columns.expenses.visible">
            {{ formatCurrency(row.expenses) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import type {
  FormData,
  Columns,
  YearlyDataRow,
  ColumnVisibility,
} from "@/types";
import { calculateTaxableRate, grossToNetRetired } from "./taxes";

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
      currentView: "Zeit",
      views: [
        {
          name: "Zeit",
          columns: [
            "index",
            "year",
            "ageA",
            "ageB",
            "inflationFactor",
            "medianSalaryIncreaseFactor",
            "salaryIncreaseFactor",
          ],
        },
        {
          name: "Investieren",
          columns: [
            "index",
            "year",
            "earnings",
            "investment",
            "totalInvested",
            "grossPayout",
            "netPayout",
          ],
        },
        {
          name: "Rentenpunkte",
          columns: [
            "index",
            "year",
            "medianSalary",
            "grossA",
            "grossB",
            "retirementPointsA",
            "retirementPointsB",
            "retirementPoints",
            "retirementPointsTotalA",
            "retirementPointsTotalB",
            "retirementPointsTotal",
          ],
        },
        {
          name: "Altersrente",
          columns: [
            "index",
            "year",
            "retirementPointsTotal",
            "retirementPointValue",
            "retirementGross",
            "retirementNet",
          ],
        },
        {
          name: "Cashflow",
          columns: [
            "index",
            "year",
            "year",
            "earnings",
            "netPayout",
            "retirementNet",
            "income",
            "expenses",
          ],
        },
      ],
      columnVisibility: {
        index: true,
        year: true,
        ageA: true,
        ageB: true,
        inflationFactor: true,
        medianSalaryIncreaseFactor: true,
        salaryIncreaseFactor: true,
        earnings: true,
        investment: true,
        totalInvested: true,
        grossPayout: true,
        netPayout: true,
        medianSalary: true,
        grossA: true,
        grossB: true,
        retirementPointsA: true,
        retirementPointsB: true,
        retirementPoints: true,
        retirementPointsTotalA: true,
        retirementPointsTotalB: true,
        retirementPointsTotal: true,
        retirementPointValue: true,
        retirementGross: true,
        retirementNet: true,
        income: true,
        expenses: true,
      } as ColumnVisibility,
    };
  },

  methods: {
    activateView(viewName: string): void {
      const view = this.views.find((v) => v.name === viewName);
      if (view) {
        this.currentView = viewName;
        Object.keys(this.columnVisibility).forEach((key) => {
          this.columnVisibility[key] = view.columns.includes(key);
        });
        localStorage.setItem(
          "tableColumnVisibility",
          JSON.stringify(this.columnVisibility),
        );
        localStorage.setItem("tableViewName", viewName);
      }
    },
    toggleColumn(columnKey: string): void {
      if (this.columnVisibility[columnKey] !== undefined) {
        this.columnVisibility[columnKey] = !this.columnVisibility[columnKey];
        localStorage.setItem(
          "tableColumnVisibility",
          JSON.stringify(this.columnVisibility),
        );
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
    columns(): Columns {
      return {
        index: { visible: this.columnVisibility.index, label: "#" },
        year: { visible: this.columnVisibility.year, label: "Jahr" },
        ageA: {
          visible: this.columnVisibility.ageA,
          label: "Alter " + this.formData.personA.name,
        },
        ageB: {
          visible: this.columnVisibility.ageB,
          label: "Alter " + this.formData.personB.name,
        },
        inflationFactor: {
          visible: this.columnVisibility.inflationFactor,
          label: "Inflationsfaktor",
        },
        medianSalaryIncreaseFactor: {
          visible: this.columnVisibility.medianSalaryIncreaseFactor,
          label: "Medianeinkommensfaktor",
        },
        salaryIncreaseFactor: {
          visible: this.columnVisibility.salaryIncreaseFactor,
          label: "Einkommensfaktor",
        },
        earnings: {
          visible: this.columnVisibility.earnings,
          label: "Einkommen",
        },
        investment: {
          visible: this.columnVisibility.investment,
          label: "Investieren",
        },
        totalInvested: {
          visible: this.columnVisibility.totalInvested,
          label: "Aktiendepot",
        },
        grossPayout: {
          visible: this.columnVisibility.grossPayout,
          label: "Auszahlungen Brutto",
        },
        netPayout: {
          visible: this.columnVisibility.netPayout,
          label: "Auszahlungen",
        },
        medianSalary: {
          visible: this.columnVisibility.medianSalary,
          label: "Mediangehalt",
        },
        grossA: {
          visible: this.columnVisibility.grossA,
          label: "Brutto " + this.formData.personA.name,
        },
        grossB: {
          visible: this.columnVisibility.grossB,
          label: "Brutto " + this.formData.personB.name,
        },
        retirementPointsA: {
          visible: this.columnVisibility.retirementPointsA,
          label: "Rentenpunkte " + this.formData.personA.name,
        },
        retirementPointsB: {
          visible: this.columnVisibility.retirementPointsB,
          label: "Rentenpunkte " + this.formData.personB.name,
        },
        retirementPoints: {
          visible: this.columnVisibility.retirementPoints,
          label: "Rentenpunkte",
        },
        retirementPointsTotalA: {
          visible: this.columnVisibility.retirementPointsTotalA,
          label: "Rentenpunkte Gesamt " + this.formData.personA.name,
        },
        retirementPointsTotalB: {
          visible: this.columnVisibility.retirementPointsTotalB,
          label: "Rentenpunkte Gesamt " + this.formData.personB.name,
        },
        retirementPointsTotal: {
          visible: this.columnVisibility.retirementPointsTotal,
          label: "Rentenpunkte Gesamt",
        },
        retirementPointValue: {
          visible: this.columnVisibility.retirementPointValue,
          label: "Rentenpunktewert",
        },
        retirementGross: {
          visible: this.columnVisibility.retirementGross,
          label: "Altersrente Brutto",
        },
        retirementNet: {
          visible: this.columnVisibility.retirementNet,
          label: "Altersrente Netto",
        },
        income: { visible: this.columnVisibility.income, label: "Einnahmen" },
        expenses: {
          visible: this.columnVisibility.expenses,
          label: "Ausgaben",
        },
      };
    },
    yearlyData(): YearlyDataRow[] {
      const currentYear = new Date().getFullYear();
      const birthYearA = this.formData.personA.birthYear;
      const birthYearB = this.formData.personB.birthYear;
      const retirementAge = this.formData.general.retirementAge;

      const maxYear = Math.max(birthYearA + 100, birthYearB + 100);
      const coastYear = Math.min(
        birthYearA + this.formData.household.coastAge,
        birthYearB + this.formData.household.coastAge,
      );
      let fireYear = Math.min(
        birthYearA + this.formData.household.fireAge,
        birthYearB + this.formData.household.fireAge,
      );
      const retirementYear = Math.min(
        birthYearA + this.formData.general.retirementAge,
        birthYearB + this.formData.general.retirementAge,
      );
      if (fireYear > retirementYear) {
        fireYear = retirementYear;
      }
      const taxableRate = calculateTaxableRate(retirementYear);

      let totalInvested = this.formData.household.currentInvestments;
      const data: YearlyDataRow[] = [];
      let index = 1;

      let retirementPointsTotalA = this.formData.personA.pensionPoints;
      let retirementPointsTotalB = this.formData.personB.pensionPoints;

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
        const medianSalaryIncreaseFactor = Math.pow(
          1 + this.formData.general.medianSalaryIncrease / 100,
          yearsSinceStart,
        );

        let earnings = 0;
        if (fireYear > year) {
          earnings =
            (this.formData.personA.net +
              this.formData.personB.net +
              this.formData.household.numberOfChildren * 250 * 12) *
            salaryIncreaseFactor;
        }

        const expenses = this.formData.household.expenses * inflationFactor;

        const currentMonth = new Date().getMonth() + 1;
        const remainingYearFactor = (12 - currentMonth) / 12;
        let investment = earnings - expenses;
        // if (index === 1) {
        //	investment = investment * remainingYearFactor;
        //}
        if (year >= coastYear) {
          investment = 0;
        }

        const medianSalary =
          this.formData.general.medianSalary * medianSalaryIncreaseFactor;

        let grossA = this.formData.personA.gross * salaryIncreaseFactor;
        if (ageA >= retirementAge || year >= fireYear) {
          grossA = 0;
        }
        let grossB = this.formData.personB.gross * salaryIncreaseFactor;
        if (ageB >= retirementAge || year >= fireYear) {
          grossB = 0;
        }

        const retirementPointsA = grossA / medianSalary;
        const retirementPointsB = grossB / medianSalary;
        const retirementPoints = retirementPointsA + retirementPointsB;

        retirementPointsTotalA += retirementPointsA;
        retirementPointsTotalB += retirementPointsB;
        const retirementPointsTotal =
          retirementPointsTotalA + retirementPointsTotalB;

        const retirementPointValue =
          this.formData.general.pensionPointValue * medianSalaryIncreaseFactor;
        let retirementGross = 0;
        if (ageA >= retirementAge) {
          retirementGross += retirementPointValue * retirementPointsTotalA * 12;
        }
        if (ageB >= retirementAge) {
          retirementGross += retirementPointValue * retirementPointsTotalB * 12;
        }
        const retirementNet = grossToNetRetired(
          retirementGross,
          taxableRate,
        ).netPension;

        let netPayout = 0;
        let grossPayout = 0;
        if (expenses - retirementNet - earnings > 0) {
          netPayout = expenses - retirementNet + earnings - investment;
          grossPayout = netPayout / (1 - this.formData.general.returnTax / 100);

          const sequenceOrReturnRiskPremiumFactor =
            1 + this.formData.household.sequenceOrReturnRiskPremium / 100;
          totalInvested -= sequenceOrReturnRiskPremiumFactor * netPayout;
        }

        const income = netPayout + retirementNet + earnings - investment;

        data.push({
          index,
          year,
          ageA,
          ageB,
          inflationFactor,
          medianSalaryIncreaseFactor,
          salaryIncreaseFactor,
          expenses,
          earnings,
          investment,
          totalInvested,
          grossPayout,
          netPayout,
          medianSalary,
          grossA,
          grossB,
          retirementPointsA,
          retirementPointsB,
          retirementPoints,
          retirementPointsTotalA,
          retirementPointsTotalB,
          retirementPointsTotal,
          retirementPointValue,
          retirementGross,
          retirementNet,
          income,
        });

        let investmentReturn =
          (totalInvested * this.formData.general.expectedReturn) / 100;
        if (index === 1) {
          investmentReturn = investmentReturn * remainingYearFactor;
        }
        totalInvested += investment + investmentReturn;

        index++;
      }

      return data;
    },
  },

  mounted() {
    const savedView = localStorage.getItem("tableViewName");
    if (savedView) {
      this.currentView = savedView;
    }
    const savedVisibility = localStorage.getItem("tableColumnVisibility");
    if (savedVisibility) {
      this.columnVisibility = {
        ...this.columnVisibility,
        ...JSON.parse(savedVisibility),
      };
    }
  },
});
</script>

<style scoped>
.view-toggles {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.view-toggles button {
  padding: 8px 16px;
  border: 1px solid #2c3e50;
  background-color: white;
  color: #2c3e50;
  border-radius: 4px;
  cursor: pointer;
}

.view-toggles button.active {
  background-color: #2c3e50;
  color: white;
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

tr.deficit {
  background-color: #ffcdd2;
}

tr.deficit:hover {
  background-color: #ffebee;
}
</style>
