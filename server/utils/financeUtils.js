// server/utils/financeUtils.js

/**
 * Calculates monthly lease payment
 * @param {number} principal - Total cost of the bike
 * @param {number} downPayment - Initial payment
 * @param {number} rate - Annual interest rate (e.g., 0.10 for 10%)
 * @param {number} months - Duration of lease
 */
exports.calculateMonthlyInstallment = (principal, downPayment, rate, months) => {
    const P = principal - downPayment;
    const i = rate / 12;
    const n = months;

    // Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
    const monthly = (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    return monthly.toFixed(2);
};