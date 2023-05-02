import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReleaseLetterReportComponent } from './release-letter-report.component';

const routes: Routes = [{ path: '', component: ReleaseLetterReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReleaseLetterReportRoutingModule {}
