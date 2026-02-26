import { ValidationTargets } from '../validation.service';

export const cobas4800Rules = {
  target: 'COBAS 4800',
  rules: [
    {
      subject: 'Vl Plasma VIH1',
      field_list: [8, 9, 10, 11, 12, 38, 40, 42, 44, 306],
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
          description: 'Tested >= Failed (Pending retest + Rejected)',
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
              {
                field: '306',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '>=',
          },
        },
        {
          name: ValidationTargets.CHECK3,
          description:
            'Pending = Received + Pending (last week) - Tested + Pending retest - Rejected',
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
              {
                field: '42',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '306',
                operator: '-',
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
      field_list: [53, 54, 55, 56, 57, 46, 47, 48, 49, 311],
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
          description: 'Tested >= Failed (Pending retest + Rejected)',
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
              {
                field: '311',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '>=',
          },
        },
        {
          name: ValidationTargets.CHECK3,
          description:
            'Pending = Received + Pending (last week) - Tested + Pending retest - Rejected',
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
              {
                field: '48',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '311',
                operator: '-',
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
      field_list: [13, 14, 15, 16, 17, 39, 41, 43, 45, 307],
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
          description: 'Tested >= Failed (Pending retest + Rejected)',
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
              {
                field: '307',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '>=',
          },
        },
        {
          name: ValidationTargets.CHECK3,
          description:
            'Pending = Received + Pending (last week) - Tested + Pending retest - Rejected',
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
              {
                field: '43',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '307',
                operator: '-',
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
