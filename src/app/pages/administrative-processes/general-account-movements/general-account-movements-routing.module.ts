import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralAccountMovementsComponent } from './general-account-movements/general-account-movements.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralAccountMovementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralAccountMovementsRoutingModule {}
