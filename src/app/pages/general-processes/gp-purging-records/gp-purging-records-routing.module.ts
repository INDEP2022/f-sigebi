import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpPurgingRecordsComponent } from './gp-purging-records/gp-purging-records.component';

const routes: Routes = [
  {
    path: '',
    component: GpPurgingRecordsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpPurgingRecordsRoutingModule {}
