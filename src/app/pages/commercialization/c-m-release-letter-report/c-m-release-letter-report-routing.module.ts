import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMReleaseLetterReportComponent } from './c-m-release-letter-report.component';

const routes: Routes = [
  { path: '', component: CMReleaseLetterReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMReleaseLetterReportRoutingModule {}
