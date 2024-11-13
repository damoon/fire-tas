// https://chatgpt.com/share/6734773f-c744-8006-86cf-6e737128fc33

type SalaryBreakdown = {
  gross: number;
  net: number;
  incomeTax: number;
  healthInsurance: number;
  pensionInsurance: number;
  unemploymentInsurance: number;
  longTermCareInsurance: number;
};

function grossToNet(gross: number): SalaryBreakdown {
  // Constants for 2024 social security rates
  const healthInsuranceRate = 0.073; // Employee rate
  const pensionInsuranceRate = 0.093; // Employee rate
  const unemploymentInsuranceRate = 0.012; // Employee rate
  const longTermCareInsuranceRate = 0.01525; // Employee rate (without additional rate)

  // Social Insurance Contributions
  const healthInsurance = gross * healthInsuranceRate;
  const pensionInsurance = gross * pensionInsuranceRate;
  const unemploymentInsurance = gross * unemploymentInsuranceRate;
  const longTermCareInsurance = gross * longTermCareInsuranceRate;

  // Taxable Income (after social contributions)
  const taxableIncome =
    gross -
    healthInsurance -
    pensionInsurance -
    unemploymentInsurance -
    longTermCareInsurance;

  // Income Tax Calculation (example progressive tax calculation)
  let incomeTax = 0;
  if (taxableIncome > 9744) {
    // 2024 tax-free allowance
    incomeTax = // Apply progressive rate calculation here, simplified as:
      taxableIncome <= 14254
        ? (taxableIncome - 9744) * 0.14
        : taxableIncome <= 57918
        ? (taxableIncome - 14254) * 0.3 + 970.58
        : taxableIncome * 0.42 - 9336.45;
  }

  // Net Salary
  const net =
    gross -
    incomeTax -
    healthInsurance -
    pensionInsurance -
    unemploymentInsurance -
    longTermCareInsurance;

  return {
    gross,
    net,
    incomeTax,
    healthInsurance,
    pensionInsurance,
    unemploymentInsurance,
    longTermCareInsurance,
  };
}

export type RetiredSalaryBreakdown = {
  grossPension: number;
  netPension: number;
  incomeTax: number;
  healthInsurance: number;
  longTermCareInsurance: number;
};

export function grossToNetRetired(
  grossPension: number,
  taxableRate: number, // Portion of the pension that is taxable (e.g., 0.8 for 80%)
  healthInsuranceRate: number = 0.073, // Default health insurance rate for retirees
  longTermCareInsuranceRate: number = 0.0305 // Default long-term care rate for retirees
): RetiredSalaryBreakdown {
  // Calculate health and long-term care insurance contributions
  const healthInsurance = grossPension * healthInsuranceRate;
  const longTermCareInsurance = grossPension * longTermCareInsuranceRate;

  // Calculate taxable income portion of the pension
  const taxableIncome =
    (grossPension - healthInsurance - longTermCareInsurance) * taxableRate;

  // Example progressive tax calculation (you may adjust this for real tax brackets)
  let incomeTax = 0;
  if (taxableIncome > 9744) {
    // Adjust for the tax-free allowance
    incomeTax =
      taxableIncome <= 14254
        ? (taxableIncome - 9744) * 0.14
        : taxableIncome <= 57918
        ? (taxableIncome - 14254) * 0.3 + 970.58
        : taxableIncome * 0.42 - 9336.45;
  }

  // Calculate net pension
  const netPension =
    grossPension - incomeTax - healthInsurance - longTermCareInsurance;

  return {
    grossPension,
    netPension,
    incomeTax,
    healthInsurance,
    longTermCareInsurance,
  };
}

// https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Allgemeine-Informationen/Besteuerung-der-Rente/besteuerung-der-rente_node.html#:~:text=Jahr%20f%C3%BCr%20Jahr%20steigt%20der,1%20Prozentpunkt%20Steigerung%20pro%20Jahr.
export function calculateTaxableRate(retirementYear: number): number {
  const baseYear = 2005;
  const twoPercentIncreaseEndYear = 2020;
  const onePercentIncreaseEndYear = 2022;
  const halfPercentIncreaseEndYear = 2057;

  // Check if retirement year is before the base year
  if (retirementYear < baseYear) {
    throw new Error("Retirement year must be 2005 or later.");
  }

  // Determine the taxable rate based on the retirement year
  if (retirementYear <= twoPercentIncreaseEndYear) {
    // 2005-2020: 50% initial rate, increasing by 2% each year
    return 0.5 + (retirementYear - baseYear) * 0.02;
  }

  if (retirementYear <= onePercentIncreaseEndYear) {
    // 2021-2022: Start from 80% in 2020, increasing by 1% each year
    return 0.8 + (retirementYear - twoPercentIncreaseEndYear) * 0.01;
  }

  if (retirementYear <= halfPercentIncreaseEndYear) {
    // 2022-2057: Start from 100% in 2040, increasing by 0.5% each year
    return 0.82 + (retirementYear - onePercentIncreaseEndYear) * 0.005;
  }
  // 2058 and beyond: 100% taxable
  return 1.0;
}
