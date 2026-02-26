import { ValidationTargets } from '../validation.service';

export const oppBrukerRules = {
  target: 'OPP (BRUKER)',
  rules: [
    {
      subject: 'VL Plasma VIH1',
      field_list: [218, 224, 220, 222, 208, 209, 210, 211, 212, 302],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '218',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '224',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '220',
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
                field: '220',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '222',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '302',
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
                field: '224',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '218',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '224',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '220',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '222',
                operator: '+',
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
      field_list: [226, 229, 227, 228, 233, 234, 235, 236, 237],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '226',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '229',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '227',
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
                field: '227',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '228',
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
                field: '229',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '226',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '229',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '227',
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
                field: '228',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '233',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '234',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '235',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '236',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '237',
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
      subject: 'Vl Plasma VIH2',
      field_list: [219, 225, 221, 223, 213, 214, 215, 216, 217, 303],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '219',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '225',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '221',
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
                field: '221',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '223',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '303',
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
                field: '225',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '219',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '225',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '221',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '223',
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
