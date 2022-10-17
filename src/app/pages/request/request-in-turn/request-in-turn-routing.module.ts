import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestInTurnListComponent } from './request-in-turn-list/request-in-turn-list.component';

const routes: Routes = [
  {
    path: '',
    component: RequestInTurnListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestInTurnRoutingModule {}
