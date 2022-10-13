import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeRddxdeesCReceptionAreaSeraComponent } from './pe-rddxdees-c-reception-area-sera/pe-rddxdees-c-reception-area-sera.component';

const routes: Routes = [
  {
    path: '',
    component: PeRddxdeesCReceptionAreaSeraComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeRddxdeesMReceptionAreaSeraRoutingModule {}
