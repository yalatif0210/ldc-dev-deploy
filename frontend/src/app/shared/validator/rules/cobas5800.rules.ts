import { ValidationTargets } from '../validation.service';

export const cobas5800Rules = {
  target: 'COBAS 5800',
  rules: [
    {
      subject: 'Vl Plasma VIH1',
      field_list: [83, 89, 85, 87, 73, 74, 75, 76, 77, 309],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '83',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '89',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '85',
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
                field: '85',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '87',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '309',
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
            'Pending = Received + Pending (last week) - Tested + Pending retest',
          content: {
            left: [
              {
                field: '89',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '83',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '89',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '85',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '87',
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
      field_list: [91, 94, 92, 93, 98, 99, 100, 101, 102, 312],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '91',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '94',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '92',
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
                field: '92',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '93',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '312',
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
            'Pending = Received + Pending (last week) - Tested + Pending retest',
          content: {
            left: [
              {
                field: '94',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '91',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '94',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '92',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '93',
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
      field_list: [84, 90, 86, 88, 78, 79, 80, 81, 82, 310],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '84',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '90',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '86',
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
                field: '86',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '88',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '310',
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
            'Pending = Received + Pending (last week) - Tested + Pending retest',
          content: {
            left: [
              {
                field: '90',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '84',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '90',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '86',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '88',
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
