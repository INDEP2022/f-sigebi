import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponsibilityLettersReportComponent } from './responsibility-letters-report.component';

const routes: Routes = [
  { path: '', component: ResponsibilityLettersReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResponsibilityLettersReportRoutingModule {}
