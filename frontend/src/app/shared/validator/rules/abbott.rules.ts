import { ValidationTargets } from '../validation.service';

export const abbottRules = {
  target: 'ABBOTT',
  rules: [
    {
      subject: 'Vl Plasma VIH1',
      field_list: [263, 269, 265, 267, 253, 254, 255, 256, 257, 304, 'Vl Plasma VIH1'],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Pending (last week) + Received + Adjustment >= Tested',
          content: {
            left: [
              {
                field: '263',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '269',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: 'Vl Plasma VIH1',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '265',
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
                field: '265',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '267',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '304',
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
            'Pending (current week) = Pending (last week) + Received + Adjustment - Tested + Pending retest',
          content: {
            left: [
              {
                field: '269',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '263',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '269',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: 'Vl Plasma VIH1',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '265',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '267',
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
      field_list: [271, 274, 272, 273, 278, 279, 280, 281, 282, 316, 'EID Sample'],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Pending (last week) + Received + Adjustment >= Tested',
          content: {
            left: [
              {
                field: '271',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '274',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: 'EID Sample',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '272',
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
                field: '272',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '273',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '316',
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
            'Pending (current week) = Pending (last week) + Received + Adjustment - Tested + Pending retest',
          content: {
            left: [
              {
                field: '274',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '271',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '274',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: 'EID Sample',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '272',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '273',
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
      field_list: [264, 270, 266, 268, 258, 259, 260, 261, 262, 305, 'Vl PSC'],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Pending (last week) + Received + Adjustment >= Tested',
          content: {
            left: [
              {
                field: '264',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '270',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: 'Vl PSC',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '266',
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
                field: '266',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '268',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '305',
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
            'Pending (current week) = Pending (last week) + Received + Adjustment - Tested + Pending retest',
          content: {
            left: [
              {
                field: '270',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '264',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '270',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: 'Vl PSC',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '266',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '268',
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
