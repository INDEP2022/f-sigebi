import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportDocumentLocationComponent } from './report-document-location/report-document-location.component';

const routes: Routes = [
  {
    path: '',
    component: ReportDocumentLocationComponent,
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class ReportDocumentLocationRoutingModule {}
