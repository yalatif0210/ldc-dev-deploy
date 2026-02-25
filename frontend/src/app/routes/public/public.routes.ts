import { Routes } from '@angular/router';
import { PublicHome } from './report/home/home';
import { LabReport } from './report/lab-report/lab-report';
import { HistoryHome } from './histrory/home/history-home';
import { ReportHistory } from './histrory/report/report-history';
import { Synthesis } from './synthesis/synthesis';
import { PublicSettings } from './settings/settings';



export const routes: Routes = [
  { path: 'report/init', component: PublicHome },
  { path: 'report/history/overview', component: HistoryHome },
  { path: 'report/fill/laboratory', component: LabReport },
  { path: 'report/history', component: ReportHistory },
  {path: 'synthesis', component: Synthesis},
  {path: 'settings', component: PublicSettings}
];
