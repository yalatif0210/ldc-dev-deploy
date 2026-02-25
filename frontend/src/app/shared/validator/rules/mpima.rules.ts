import { ValidationTargets } from '../validation.service';


export const mpimaRules = {
  target: 'MPIMA',
  rules: [
    {
      subject: 'EID',
      field_list: [1, 4, 2, 3, 18, 19, 20, 21, 22],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
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
          description: 'Tested >= Failed',
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
                field: '2',
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
                field: '3',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '18',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '19',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '20',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '21',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '22',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '=',
          },
        },
      ],
    }
  ],
};
