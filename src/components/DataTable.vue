<template>
  <div class="table-container">
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
          v-for="row in yearlyData"
          :key="row.index"
          :class="{
            declining: row.declining,
            deficit: row.deficit,
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
          <td v-show="columns.yearlyReturn.visible">
            {{ formatCurrency(row.yearlyReturn) }}
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
          <td v-show="columns.savingsRate.visible">
            {{
              row.earnings > 0
                ? ((row.investment / row.earnings) * 100).toFixed(1)
                : "0"
            }}
          </td>
          <td v-show="columns.fourPercentRule.visible">
            {{ formatCurrency(row.fourPercentRule) }}
          </td>
          <td v-show="columns.withdrawalRate.visible">
            {{ row.withdrawalRate.toFixed(2) }}
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
          <td v-show="columns.companyPensionA.visible">
            {{ formatCurrency(row.companyPensionA) }}
          </td>
          <td v-show="columns.companyPensionB.visible">
            {{ formatCurrency(row.companyPensionB) }}
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
          <td v-show="columns.additionalExpenses.visible">
            <input
              type="number"
              :value="additionalExpenses[row.year] || 0"
              @input="updateAdditionalExpenses(row.year, $event)"
              class="additional-expenses-input"
              step="1000"
            />
          </td>
          <td v-show="columns.events.visible" class="events">
            <div
              v-for="event in Object.entries(row.events)
                .filter(([key, value]) => value)
                .map(([key]) => key)"
              :key="event"
              :title="getEventTitle(event)"
            >
              {{ getEventEmoji(event) }}
            </div>
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
  Events,
  AdditionalExpenses,
} from "@/types";
import { calculateTaxableRate, grossToNetRetired } from "./taxes";
import { getLifeExpectancy } from "./lifeExpectancy";

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
      additionalExpenses: {} as AdditionalExpenses,
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
            "yearlyReturn",
            "savingsRate",
            "fourPercentRule",
            "withdrawalRate",
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
            "companyPensionA",
            "companyPensionB",
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
            "additionalExpenses",
            "events",
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
        savingsRate: true,
        fourPercentRule: true,
        withdrawalRate: true,
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
        companyPensionA: true,
        companyPensionB: true,
        retirementNet: true,
        income: true,
        expenses: true,
        events: true,
        yearlyReturn: true,
        additionalExpenses: true,
      } as ColumnVisibility,
    };
  },
  methods: {
    updateAdditionalExpenses(year: number, event: Event): void {
      const value = Number((event.target as HTMLInputElement).value) || 0;
      this.additionalExpenses[year] = value;
      localStorage.setItem(
        "additionalExpenses",
        JSON.stringify(this.additionalExpenses),
      );
    },
    getTotalExpenses(baseExpenses: number, year: number): number {
      const additionalExpense = this.additionalExpenses[year] || 0;
      return baseExpenses + additionalExpense;
    },
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
        if (this.formData?.display?.minimizeTable) {
          // Ensure events column is visible when table is minimized
          this.columnVisibility.events = true;
          // only make additional expenses visible if any additional expense exists
          if (
            Object.values(this.additionalExpenses).some(
              (expense) => expense > 0,
            )
          ) {
            this.columnVisibility.additionalExpenses = true;
          }
        }
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
    getEventEmoji(eventName: string): string {
      const emojiMap: { [key: string]: string } = {
        coastFire: "☕",
        retire: "🏖️",
        retiredA: "🧔‍♂️",
        retiredB: "👩",
        oneMillion: "💰",
        twoMillion: "💰💰",
        averageDeathA: "⚰️",
        averageDeathB: "👻",
        leanFire: "🔥",
        fire: "🔥🔥",
        fatFire: "🔥🔥🔥",
        returnsSupersedeInvestments: "🚀",
        returnsSupersedeInvestmentsDouble: "🚀🚀",
      };
      return emojiMap[eventName] || "❓";
    },
    getEventTitle(eventName: string): string {
      const titleMap: { [key: string]: string } = {
        coastFire: "Coast FIRE erreicht",
        retire: "Ruhestand erreicht",
        retiredA: "Person A im Ruhestand",
        retiredB: "Person B im Ruhestand",
        oneMillion: "1 Million € Vermögen erreicht",
        twoMillion: "2 Millionen € Vermögen erreicht",
        averageDeathA: `Durchschnittliche Lebenserwartung von ${this.formData.personA.name}`,
        averageDeathB: `Durchschnittliche Lebenserwartung von ${this.formData.personB.name}`,
        leanFire: "Lean FIRE erreicht",
        fire: "FIRE erreicht",
        fatFire: "Fat FIRE erreicht",
        returnsSupersedeInvestments: "Rendite übersteigt Sparrate",
        returnsSupersedeInvestmentsDouble:
          "Rendite übersteigt doppelte Sparrate",
      };
      return titleMap[eventName] || "Unbekanntes Ereignis";
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
        yearlyReturn: {
          visible: this.columnVisibility.yearlyReturn,
          label: "Rendite",
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
        savingsRate: {
          visible: this.columnVisibility.savingsRate,
          label: "Sparquote (%)",
        },
        fourPercentRule: {
          visible: this.columnVisibility.fourPercentRule,
          label: "4% Regel",
        },
        withdrawalRate: {
          visible: this.columnVisibility.withdrawalRate,
          label: "Entnahmequote (%)",
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
        companyPensionA: {
          visible: this.columnVisibility.companyPensionA,
          label: "BaV " + this.formData.personA.name,
        },
        companyPensionB: {
          visible: this.columnVisibility.companyPensionB,
          label: "BaV " + this.formData.personB.name,
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
        additionalExpenses: {
          visible: this.columnVisibility.additionalExpenses,
          label: "Zusätzliche Ausgaben",
        },
        events: { visible: this.columnVisibility.events, label: "Events" },
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
      // if (fireYear > retirementYear) {
      //   fireYear = retirementYear;
      // }
      const taxableRate = calculateTaxableRate(retirementYear);

      let totalInvested =
        this.formData.household.currentInvestments *
        (15 / this.formData.general.globalPE);
      const data: YearlyDataRow[] = [];
      let index = 1;

      let retirementPointsTotalA = this.formData.personA.pensionPoints;
      let retirementPointsTotalB = this.formData.personB.pensionPoints;

      let companyPensionA = this.formData.personA.currentCompanyPension;
      let companyPensionB = this.formData.personB.currentCompanyPension;
      const ageA = currentYear - birthYearA;
      const ageB = currentYear - birthYearB;
      const companyPensionGrowthA =
        (this.formData.personA.companyPension -
          this.formData.personA.currentCompanyPension) /
        (this.formData.general.retirementAge - ageA);
      const companyPensionGrowthB =
        (this.formData.personB.companyPension -
          this.formData.personB.currentCompanyPension) /
        (this.formData.general.retirementAge - ageB);

      const currentAgeA = currentYear - birthYearA;
      const currentAgeB = currentYear - birthYearB;

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
        if (index + this.formData.household.childsAge <= 18) {
          earnings +=
            this.formData.household.numberOfChildren *
            250 *
            12 *
            salaryIncreaseFactor;
        }
        if (ageA < retirementAge && year < fireYear) {
          earnings += this.formData.personA.net * salaryIncreaseFactor;
        }
        if (ageB < retirementAge && year < fireYear) {
          earnings += this.formData.personB.net * salaryIncreaseFactor;
        }

        const additionalExpense = this.additionalExpenses[year] || 0;
        const expenses =
          this.formData.household.expenses * inflationFactor +
          additionalExpense * inflationFactor;

        let investment = earnings - expenses;
        if (year >= coastYear || investment < 0) {
          investment = 0;
        }
        if (index === 1) {
          const currentMonth = new Date().getMonth() + 1;
          const remainingYearFactor = currentMonth / 12;
          totalInvested -= remainingYearFactor * investment;
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

        let retirementPointsA = grossA / medianSalary;
        let retirementPointsB = grossB / medianSalary;
        if (year >= coastYear) {
          retirementPointsA = Math.min(retirementPointsA / 2, 0.5);
          retirementPointsB = Math.min(retirementPointsB / 2, 0.5);
        }
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

        if (ageA < retirementAge) {
          if (year < coastYear) {
            companyPensionA += companyPensionGrowthA;
          } else {
            companyPensionA += 0.5 * companyPensionGrowthA;
          }
        }
        if (ageB < retirementAge) {
          if (year < coastYear) {
            companyPensionB += companyPensionGrowthB;
          } else {
            companyPensionB += 0.5 * companyPensionGrowthB;
          }
        }

        let retirementNet = 0;
        if (year >= retirementYear) {
          retirementNet =
            grossToNetRetired(
              retirementGross + companyPensionA + companyPensionB,
              taxableRate,
            ).netPension *
            (this.formData.general.pensionRiskAdjustment / 100);
        }

        let netPayout = 0;
        let grossPayout = 0;
        const higherExpenses =
          year >= fireYear && year < retirementYear ? expenses * 1.5 : expenses;
        if (higherExpenses - retirementNet - earnings > 0) {
          netPayout = higherExpenses - retirementNet - earnings - investment;
          grossPayout = netPayout / (1 - this.formData.general.returnTax / 100);

          const sequenceOrReturnRiskPremiumFactor =
            1 + this.formData.household.sequenceOrReturnRiskPremium / 100;
          totalInvested -= sequenceOrReturnRiskPremiumFactor * netPayout;
        }

        const income = netPayout + retirementNet + earnings - investment;

        const fourPercentRule =
          totalInvested * 0.04 * (1 - this.formData.general.returnTax / 100);

        const withdrawalRate =
          totalInvested > 0 ? (grossPayout / totalInvested) * 100 : 0;
        const savingsRate = earnings > 0 ? (investment / earnings) * 100 : 0;

        let remainingYearFactor = 1;
        if (index === 1) {
          const currentMonth = new Date().getMonth() + 1;
          remainingYearFactor = 1 - currentMonth / 12;
        }
        const yearlyReturn =
          (remainingYearFactor *
            totalInvested *
            this.formData.general.expectedReturn) /
          100;

        const events: Events = {
          coastFire: false,
          retire: false,
          retiredA: false,
          retiredB: false,
          oneMillion: false,
          twoMillion: false,
          averageDeathA: false,
          averageDeathB: false,
          leanFire: false,
          fire: false,
          fatFire: false,
          returnsSupersedeInvestments: false,
          returnsSupersedeInvestmentsDouble: false,
        };
        if (
          totalInvested > 1_000_000 &&
          !data.some((d) => d.events.oneMillion)
        ) {
          events.oneMillion = true;
        }
        if (
          totalInvested > 2_000_000 &&
          !data.some((d) => d.events.twoMillion)
        ) {
          events.twoMillion = true;
        }
        if (year == coastYear) {
          events.coastFire = true;
        }
        if (year == fireYear) {
          events.retire = true;
        }
        if (ageA == retirementAge) {
          events.retiredA = true;
        }
        if (ageB == retirementAge) {
          events.retiredB = true;
        }
        if (
          fourPercentRule + retirementNet >= higherExpenses &&
          !data.some((d) => d.events.leanFire)
        ) {
          events.leanFire = true;
        }
        if (
          fourPercentRule + retirementNet >= higherExpenses * 2 &&
          !data.some((d) => d.events.fire)
        ) {
          events.fire = true;
        }
        if (
          fourPercentRule + retirementNet >= higherExpenses * 4 &&
          !data.some((d) => d.events.fatFire)
        ) {
          events.fatFire = true;
        }
        if (
          yearlyReturn >= investment &&
          investment > 0 &&
          !data.some((d) => d.events.returnsSupersedeInvestments)
        ) {
          events.returnsSupersedeInvestments = true;
        }
        if (
          yearlyReturn >= investment * 2 &&
          investment > 0 &&
          !data.some((d) => d.events.returnsSupersedeInvestmentsDouble)
        ) {
          events.returnsSupersedeInvestmentsDouble = true;
        }

        if (
          ageA ===
            getLifeExpectancy(this.formData.personA.gender, currentAgeA) &&
          !data.some((d) => d.events.averageDeathA)
        ) {
          events.averageDeathA = true;
        }
        if (
          ageB ===
            getLifeExpectancy(this.formData.personB.gender, currentAgeB) &&
          !data.some((d) => d.events.averageDeathB)
        ) {
          events.averageDeathB = true;
        }

        const declining =
          index > 1 &&
          totalInvested <
            data[data.length - 1]?.totalInvested *
              (1 + this.formData.general.inflation / 100);

        const deficit =
          Math.round(income) < Math.round(higherExpenses) || totalInvested < 0;

        data.push({
          index,
          year,
          ageA,
          ageB,
          inflationFactor,
          medianSalaryIncreaseFactor,
          salaryIncreaseFactor,
          expenses: higherExpenses,
          earnings,
          investment,
          totalInvested,
          savingsRate,
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
          companyPensionA,
          companyPensionB,
          income,
          additionalExpenses: this.additionalExpenses[year] || 0,
          withdrawalRate,
          fourPercentRule,
          yearlyReturn,
          declining,
          deficit,
          events,
        });

        totalInvested += investment + yearlyReturn;

        index++;
      }

      if (this.formData?.display?.minimizeTable) {
        // Ensure events column is visible when table is minimized
        this.columnVisibility.events = true;
        // only make additional expenses visible if any additional expense exists
        if (
          Object.values(this.additionalExpenses).some((expense) => expense > 0)
        ) {
          this.columnVisibility.additionalExpenses = true;
        }

        return data
          .filter((row) => row.year > 2000)
          .filter(
            (row, index) =>
              index === 0 || // First row
              Object.values(row.events).some((event) => event) || // Rows with events
              row.additionalExpenses > 0, // Rows with additional expenses
          );
      }

      return data;
    },
  },

  created() {
    if (!localStorage.getItem("tableViewName")) {
      this.currentView = "Cashflow";
      this.activateView("Cashflow");
    }
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
    const savedAdditionalExpenses = localStorage.getItem("additionalExpenses");
    if (savedAdditionalExpenses) {
      this.additionalExpenses = JSON.parse(savedAdditionalExpenses);
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
  margin: 20px auto;
  max-width: 1400px;
  position: relative;
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
  border-collapse: separate;
  border-spacing: 0;
  margin: 0 auto;
  max-width: 1400px;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: white;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 2;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f5f5f5;
}

tr.declining {
  background-color: #ffcdd2;
}

tr.deficit {
  background-color: #ffb9b9;
}

tr.deficit:hover {
  background-color: #ffebee;
}
.additional-expenses-input {
  width: 100px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: right;
}

.additional-expenses-input:focus {
  outline: none;
  border-color: #2c3e50;
}

/* Event cell styling */
.events div {
  line-height: 1.5;
}
.events span {
  white-space: nowrap;
}
</style>
