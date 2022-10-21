import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnTypeComponent } from './turn-type/turn-type.component';

const routes: Routes = [
  {
    path: '',
    component: TurnTypeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TurnTypeRoutingModule {}
