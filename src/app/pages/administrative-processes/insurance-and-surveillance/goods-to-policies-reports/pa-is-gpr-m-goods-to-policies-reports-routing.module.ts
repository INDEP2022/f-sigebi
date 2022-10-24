import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaIsGprCReportComponent } from './report/pa-is-gpr-c-report.component';

const routes: Routes = [
  {
    path: '',
    component: PaIsGprCReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaIsGprMGoodsToPoliciesReportsRoutingModule { }
