import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurgingRecordsComponent } from './purging-records/purging-records.component';

const routes: Routes = [
  {
    path: '',
    component: PurgingRecordsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurgingRecordsRoutingModule {}
