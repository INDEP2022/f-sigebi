import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationOfRecordsComponent } from './consultation-of-records/consultation-of-records.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultationOfRecordsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationOfRecordsRoutingModule {}
