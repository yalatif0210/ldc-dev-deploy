import { ValidationTargets } from '../validation.service';

export const cobas6800Rules = {
  target: 'OPP (BRUKER)',
  rules: [
    {
      subject: 'Vl Plasma VIH1',
      field_list: [128, 134, 130, 132, 118, 119, 120, 121, 122, 298],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '128',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '134',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '130',
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
                field: '130',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '132',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '298',
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
                field: '134',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '128',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '134',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '130',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '132',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '298',
                operator: '-',
                isPassDataNeeded: false,
              },
            ],
            operator: '=',
          },
        },
      ],
    },
    /*{
      subject: 'EID',
      field_list: [136, 139, 137, 138, 143, 144, 145, 146, 147],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '136',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '139',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '137',
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
                field: '137',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '138',
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
                field: '139',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '136',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '139',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '137',
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
                field: '138',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '143',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '144',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '145',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '146',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '147',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '=',
          },
        },
      ],
    },*/
    {
      subject: 'VL PSC',
      field_list: [129, 135, 131, 133, 123, 124, 125, 126, 127, 299],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '129',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '135',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '131',
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
                field: '131',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '133',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '299',
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
                field: '135',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '129',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '135',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '131',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '133',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '299',
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
