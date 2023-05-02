import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TesofeMovementsComponent } from './tesofe-movements/tesofe-movements.component';

const routes: Routes = [
  {
    path: '',
    component: TesofeMovementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TesofeMovementsRoutingModule {}
