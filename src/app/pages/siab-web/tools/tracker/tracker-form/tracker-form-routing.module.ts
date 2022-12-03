import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackerFormComponent } from './tracker-form/tracker-form.component';

const routes: Routes = [
  {
    path: '',
    component: TrackerFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackerFormRoutingModule {}
