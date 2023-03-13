import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelatedEventsListComponent } from './related-events-list/related-events-list.component';

const routes: Routes = [
  {
    path: '',
    component: RelatedEventsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatedEventsRoutingModule {}
