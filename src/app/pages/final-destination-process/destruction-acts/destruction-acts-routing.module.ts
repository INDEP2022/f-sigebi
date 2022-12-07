import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestructionActsComponent } from './destruction-acts/destruction-acts.component';

const routes: Routes = [
  {
    path: '',
    component: DestructionActsComponent,
    data: { Title: 'Actas de destrucción' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DestructionActsRoutingModule {}
