import { ValidationTargets } from '../validation.service';

export const mpimaRules = {
  target: 'MPIMA',
  rules: [
    {
      subject: 'EID',
      field_list: [1, 4, 2, 3, 18, 19, 20, 21, 22, 317, 'EID Sample'],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Pending (last week) + Received + Adjustment >= Tested',
          content: {
            left: [
              {
                field: '1',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '4',
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
                field: '2',
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
                field: '2',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '3',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '317',
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
                field: '4',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '1',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '4',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: 'EID Sample',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '2',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '3',
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
