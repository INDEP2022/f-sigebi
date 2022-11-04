import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpRecordsTrackerComponent } from './gp-records-tracker/gp-records-tracker.component';

const routes: Routes = [
  {
    path: '',
    component: GpRecordsTrackerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpRecordsTrackerRoutingModule {}
