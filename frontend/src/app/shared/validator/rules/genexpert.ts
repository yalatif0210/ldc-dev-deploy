import { ValidationTargets } from '../validation.service';

export const genexpertRules = {
  target: 'GENEXPERT',
  rules: [
    {
      subject: 'Vl Plasma VIH1',
      field_list: [173, 179, 175, 177, 163, 164, 165, 166, 167, 300],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '173',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '179',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '175',
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
                field: '175',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '177',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '300',
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
                field: '179',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '173',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '179',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '175',
                operator: '-',
                isPassDataNeeded: false,
              },
              {
                field: '177',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '300',
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
      field_list: [181, 184, 182, 183, 188, 189, 190, 191, 192],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '181',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '184',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '182',
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
                field: '182',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '183',
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
                field: '184',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '181',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '184',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '182',
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
                field: '183',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '188',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '189',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '190',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '191',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '192',
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
      field_list: [174, 180, 176, 178, 168, 169, 170, 171, 172],
      checks: [
        {
          name: ValidationTargets.CHECK1,
          description: 'Received + Pending (last week) >= Tested',
          content: {
            left: [
              {
                field: '174',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '180',
                operator: '+',
                isPassDataNeeded: true,
              },
            ],
            right: [
              {
                field: '176',
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
                field: '176',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '178',
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
                field: '180',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '174',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '180',
                operator: '+',
                isPassDataNeeded: true,
              },
              {
                field: '176',
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
                field: '178',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            right: [
              {
                field: '168',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '169',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '170',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '171',
                operator: '+',
                isPassDataNeeded: false,
              },
              {
                field: '172',
                operator: '+',
                isPassDataNeeded: false,
              },
            ],
            operator: '=',
          },
        },
      ],
    },*/
  ],
};
