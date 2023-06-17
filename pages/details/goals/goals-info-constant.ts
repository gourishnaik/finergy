import { GOALTYPE } from "src/app/helpers";

export interface IFINCONSTANTS {
    futureGoals: Array<{
        label: string,
        value: GOALTYPE,
        isSelected: boolean,
        helpText: {
            icon: string,
            text: string
        },
    }>,
    eductionDegree: Array<string>,
    childsAge: Array<number>,
    retirementAge: Array<string>,
    travelCostRanges: Array<{ min: number, max: number }>,
}

export class Constants {
    public constant: IFINCONSTANTS;

    constructor() {
        this.constant = {
            "futureGoals": [
                {
                    'label': 'Build fund for retirement',
                    // 'value': 'retirementFunds',
                    'value': 'retirement',
                    'isSelected': false,
                    'helpText': {
                        'icon': 'money',
                        "text": ' Almost half of the parents surveyed use their retirement fund for funding their children’s education'
                    },
                    // 'goals': 1
                },
                {
                    'label': 'Trip abroad with family',
                    // 'value': 'tripWithFamily',
                    'value': 'trip',
                    'isSelected': false,
                    'helpText': {
                        'icon': 'aeroplane',
                        "text": 'Singapore is the most popular tourist destination for Indians, followed by Dubai and the UK'
                    },
                },
                {
                    'label': 'Invest in child’s education',
                    // 'value': 'childsEducation',
                    'value': 'child-education',
                    'isSelected': false,
                    'helpText': {
                        'icon': 'student',
                        "text": 'Most people select this as their top priority financial goal'
                    },
                },
                {
                    'label': 'Pay off loans',
                    // 'value': 'payOffLoans',
                    'value': 'loan-free',
                    'isSelected': false,
                    'helpText': {
                        'icon': 'creditcard',
                        "text": '30% of people spend more than 40% of their income to pay EMI/loans'
                    },
                },
                {
                    'label': 'Generate rental income',
                    'value': 'earn-rent',
                    'isSelected': false,
                    'helpText': {
                        'icon': 'money-bag',
                        "text": 'Experts say those who have rental income live a better retired life'
                    },
                },
                {
                    'label': 'Save for marriage',
                    'value': 'marriage',
                    'isSelected': false,
                    'helpText': {
                        'icon': 'marriage',
                        "text": 'Wedding loans among youth have seen an 11% rise post-pandemic'
                    },
                }
            ],
            "eductionDegree": ['Doctor', 'Engineer', 'MBA', 'Architect', 'CA'],
            "retirementAge": ['55 Years', '60 Years'],
            "childsAge": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            "travelCostRanges": [
                { min: 100000, max: 400000, },
                { min: 500000, max: 800000, },
                { min: 900000, max: 1200000, },
                { min: 1300000, max: 1500000, },
            ],

            //"travelCost": ['1,00,000 - 4,00,000', '5,00,000 - 8,00,000', '9,00,000 - 12,00,000', '13,00,000 - 15,00,000']
        }
    }

}