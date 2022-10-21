import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMRelatedEventsListComponent } from './c-m-related-events-list/c-m-related-events-list.component';

const routes: Routes = [
  {
    path: '',
    component: CMRelatedEventsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMRelatedEventsRoutingModule {}
