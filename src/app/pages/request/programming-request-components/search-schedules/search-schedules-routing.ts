import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchSchedulesFormComponent } from './search-schedules-form/search-schedules-form.component';

const routes: Routes = [
  {
    path: '',
    component: SearchSchedulesFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchSchedulesRoutingModule {}
