export interface IGOALMETA {
    year: number,
    yearsLeft: number,
    current: number,
    future: number
}

export interface IRETGOALMETA {
    age: number,
    yearsLeft: number,
    current: number,
    future: number
}

export interface ITRIPGOALMETA {
    year: number,
    yearsLeft: number,
    current: { min: number, max: number },
    future: { min: number, max: number }
}

export interface IKIDGOALMETA {
    insurance: boolean,
    kids: {
        yearsLeft: number,
        age: number,
        profession: string,
        normal: number,
        premier: number
    }[]
}

export interface IBASIC {
    birthDate: string,
    kidCount: number,
    rented: boolean,
    familyIncome: number
}
export interface IBUDGET {
    household: boolean,
    transport: boolean,
    rent: boolean,
    loan: boolean,
    personal: boolean,
    entertainment: boolean,
    food: boolean,
}

export interface IRISK {
    emergency: boolean,
    accident: boolean,
    term: boolean,
    health: boolean,
    retirement: boolean,
}

export interface IWEALTH {
    monthly: boolean,
    ppf: boolean,
    sip: boolean,
    rent: boolean,
    assets: string[],
}
export interface IMETAPARENT {
    "child-education"?: IKIDGOALMETA,
    "earn-rent"?: IGOALMETA,
    "retirement"?: IRETGOALMETA,
    "trip"?: ITRIPGOALMETA,
    "marriage"?: IGOALMETA,
    "loan-free"?: IGOALMETA,
}
export interface IQuizAnswer {
    id: string,
    customer: string,
    goals: string[],
    goal_meta: IMETAPARENT,
    basic: IBASIC,
    budget: IBUDGET,
    risk_funds: IRISK
    wealth: IWEALTH,
    created: string,
    updated: string,
    deleted: boolean,
    phone:string,
    email:string,
}