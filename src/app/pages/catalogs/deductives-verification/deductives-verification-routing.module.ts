import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeductivesVerificationListComponent } from './deductives-verification-list/deductives-verification-list.component';

const routes: Routes = [
  {
    path: '',
    component: DeductivesVerificationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeductivesVerificationRoutingModule {}
