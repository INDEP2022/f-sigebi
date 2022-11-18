import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMResponsibilityLettersReportComponent } from './c-m-responsibility-letters-report.component';

const routes: Routes = [
  { path: '', component: CMResponsibilityLettersReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMResponsibilityLettersReportRoutingModule {}
