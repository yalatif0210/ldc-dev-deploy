import { cobas4800Rules } from './cobas4800.rules';
import { cobas5800Rules } from './cobas5800.rules';
import { cobas6800Rules } from './cobas6800.rules';
import { mpimaRules } from './mpima.rules';
import { oppBrukerRules } from './oppbruker.rules';
import { abbottRules } from './abbott.rules';
import { genexpertRules } from './genexpert';

export const validatorRules = {
  'ABBOTT': abbottRules,
  'COBAS 4800': cobas4800Rules,
  'COBAS 5800': cobas5800Rules,
  'COBAS 6800': cobas6800Rules,
  'MPIMA': mpimaRules,
  'OPP (BRUKER)': oppBrukerRules,
  'GENEXPERT': genexpertRules
};

export const compileTargets = {
  'ABBOTT': {
    tested: [265, 272, 266],
    pending: [269, 274, 270],
    failed: [],
    schema: ['vl_plasma_vih1', 'eid', 'vl_psc'],
  },
  'COBAS 4800': {
    tested: [40, 47, 41],
    pending: [44, 49, 45],
    failed: [],
    schema: ['vl_plasma_vih1', 'eid', 'vl_psc'],
  },
  'COBAS 5800': {
    tested: [85, 92, 86],
    pending: [89, 94, 90],
    failed: [],
    schema: ['vl_plasma_vih1', 'eid', 'vl_psc'],
  },
  'COBAS 6800': {
    tested: [130, 131],
    pending: [134, 135],
    failed: [],
    schema: ['vl_plasma_vih1', 'vl_psc'],
  },
  'MPIMA': {
    tested: [2],
    pending: [4],
    failed: [],
    schema: ['eid'],
  },
  'OPP (BRUKER)': {
    tested: [220, 221],
    pending: [224, 225],
    failed: [],
    schema: ['vl_plasma_vih1', 'vl_plasma_vih2'],
  },
  'GENEXPERT': {
    tested: [175],
    pending: [179],
    failed: [],
    schema: ['vl_plasma_vih1'],
  },
};
