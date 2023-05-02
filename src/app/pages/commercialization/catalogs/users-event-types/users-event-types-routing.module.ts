import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { UsersEventTypesComponent } from './users-event-types/users-event-types.component';

const routes: Routes = [
  {
    path: '',
    component: UsersEventTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersEventTypesRoutingModule {}
