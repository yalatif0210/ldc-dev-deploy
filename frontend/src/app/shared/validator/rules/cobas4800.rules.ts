import { ValidationTargets } from '../validation.service';

export const cobas4800Rules = {
  target: 'COBAS 4800',
  rules: [
    {
      subject: 'Vl Plasma VIH1',
      field_list: [8, 9, 10, 11, 12, 38, 40, 42, 44],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '38',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '44',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '40',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '>=',
          },
        },
        {
          name: ValidationTargets.CHECK2,
          description: 'Tested >= Failed',
          content: {
            left: [
              {
                field: '40',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '42',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '>=',
          },
        },
        {
          name: ValidationTargets.CHECK3,
          description: 'Pending = Received + Pending (last week) - Tested',
          content: {
            left: [
              {
                field: '44',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '38',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '44',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '40',
                operator: '-',
                isPassDataNeeded: false,
              },
            ],
            operator: '=',
          },
        },
        {
          name: ValidationTargets.CHECK4,
          description: 'Failed = ∑Rejection',
          content: {
            left: [
              {
                field: '42',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '8',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '9',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '10',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '11',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '12',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '=',
          },
        },
      ],
    },
    {
      subject: 'EID',
      field_list: [53, 54, 55, 56, 57, 46, 47, 48, 49],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '46',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '49',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '47',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '>=',
          },
        },
        {
          name: ValidationTargets.CHECK2,
          description: 'Tested >= Failed',
          content: {
            left: [
              {
                field: '47',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '48',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '>=',
          },
        },
        {
          name: ValidationTargets.CHECK3,
          description: 'Pending = Received + Pending (last week) - Tested',
          content: {
            left: [
              {
                field: '49',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '46',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '49',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '47',
                operator: '-',
                isPassDataNeeded: false,
              },
            ],
            operator: '=',
          },
        },
        {
          name: ValidationTargets.CHECK4,
          description: 'Failed = ∑Rejection',
          content: {
            left: [
              {
                field: '48',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '53',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '54',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '55',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '56',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '57',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '=',
          },
        },
      ],
    },
    {
      subject: 'VL PSC',
      field_list: [13, 14, 15, 16, 17, 39, 41, 43, 45],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '39',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '45',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '41',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '>=',
          },
        },
        {
          name: ValidationTargets.CHECK2,
          description: 'Tested >= Failed',
          content: {
            left: [
              {
                field: '41',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '43',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '>=',
          },
        },
        {
          name: ValidationTargets.CHECK3,
          description: 'Pending = Received + Pending (last week) - Tested',
          content: {
            left: [
              {
                field: '45',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '39',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '45',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '41',
                operator: '-',
                isPassDataNeeded: false,
              },
            ],
            operator: '=',
          },
        },
        {
          name: ValidationTargets.CHECK4,
          description: 'Failed = ∑Rejection',
          content: {
            left: [
              {
                field: '43',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '13',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '14',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '15',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '16',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '17',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '=',
          },
        },
      ],
    },
  ],
};
