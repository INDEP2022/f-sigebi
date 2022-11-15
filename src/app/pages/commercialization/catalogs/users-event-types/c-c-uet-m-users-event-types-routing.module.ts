import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CCUetCUsersEventTypesComponent } from './users-event-types/c-c-uet-c-users-event-types.component';

const routes: Routes = [
  {
    path: '',
    component: CCUetCUsersEventTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCUetMUsersEventTypesRoutingModule {}
