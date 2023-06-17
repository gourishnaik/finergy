

export class Constants {
    public constant: {
        assets: { value: string, isSelected: boolean }[],
        graphValues: { icon: string, text: string }[],
    };

    constructor() {
        this.constant = {
            "assets": [{
                value: "Commercial",
                isSelected: false,
            },
            {
                value: "Plot",
                isSelected: false,
            },
            {
                value: "Apartment",
                isSelected: false,
            },
            {
                value: "None",
                isSelected: false,
            }],
            "graphValues": [
                {
                    icon: 'emoji1',
                    text: 'text1'
                },
                {
                    icon: 'glassesFace',
                    text: 'text2'
                },
                {
                    icon: 'emoji3',
                    text: 'text3'
                },
                {
                    icon: 'glassesFace',
                    text: 'text4'
                },
                {
                    icon: 'emoji5',
                    text: 'text4'
                },
            ]
        }
    }

}