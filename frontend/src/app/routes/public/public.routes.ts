import { Routes } from '@angular/router';
import { PublicHome } from './report/home/home';
import { LabReport } from './report/lab-report/lab-report';
import { HistoryHome } from './histrory/home/history-home';
import { ReportHistory } from './histrory/report/report-history';
import { Synthesis } from './synthesis/synthesis';
import { SynthesisClaude } from './synthesis-claude/synthesis-claude';
import { PublicSettings } from './settings/settings';
import { publicUserGuard } from '@core/authentication/role-guard';
import { synthesisGuard } from '@core/authentication/role-guard';

export const routes: Routes = [
  { path: 'report/init', component: PublicHome, canActivate: [publicUserGuard] },
  { path: 'report/history/overview', component: HistoryHome, canActivate: [publicUserGuard] },
  { path: 'report/fill/laboratory', component: LabReport, canActivate: [publicUserGuard] },
  { path: 'report/history', component: ReportHistory, canActivate: [publicUserGuard] },
  { path: 'synthesis', component: Synthesis, canActivate: [synthesisGuard] },
  { path: 'synthesis-claude', component: SynthesisClaude, canActivate: [synthesisGuard] },
  { path: 'settings', component: PublicSettings, canActivate: [publicUserGuard] },
];
