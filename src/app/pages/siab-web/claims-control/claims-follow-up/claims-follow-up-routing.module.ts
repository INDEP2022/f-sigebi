import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimsFollowUpComponent } from './claims-follow-up/claims-follow-up.component';

const routes: Routes = [
  {
    path: '',
    component: ClaimsFollowUpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsFollowUpRoutingModule {}
