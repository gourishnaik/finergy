function FutureValue(amount, interest, years): number {
    if (!amount)
        return 0;
    const x = (1 + interest / 100)
    const FV = amount * (Math.pow(x, years))
    return Math.round(FV);
}


const INFLATION = 5;
const HOLIDAY_INFLATION = 7;
const LOAN_INFLATION = -8;

export type GOALTYPE = "retirement" | "trip" | "child-education" | "loan-free" | "earn-rent" | "marriage";

export const FEES: { [profession: string]: { normal: number, premier: number } } = {
    "doctor": { normal: 1500000, premier: 3500000 },
    "engineer": { normal: 500000, premier: 1200000 },
    "mba": { normal: 400000, premier: 2000000 },
    "architect": { normal: 500000, premier: 3000000 },
    "ca": { normal: 600000, premier: 600000 },
}

export function FutureValueInflation(amount, years): number {
    return FutureValue(amount, INFLATION, years);
}

export function FutureValueHoliday(amount, years): number {
    return FutureValue(amount, HOLIDAY_INFLATION, years);
}

export function FutureValueLoan(amount, years): number {
    return FutureValue(amount, LOAN_INFLATION, years);
}