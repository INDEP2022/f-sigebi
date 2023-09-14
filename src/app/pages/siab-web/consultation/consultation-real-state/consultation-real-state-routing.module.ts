import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationRealStateComponent } from './consultation-real-state/consultation-real-state.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultationRealStateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationRealStateRoutingModule {}
