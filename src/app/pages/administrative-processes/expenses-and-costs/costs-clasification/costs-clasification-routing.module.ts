import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostsClasificationComponent } from './costs-clasification/costs-clasification.component';

const routes: Routes = [
  {
    path: '',
    component: CostsClasificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CostsClasificationRoutingModule {}
