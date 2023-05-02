import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsolidatedComponent } from './consolidated/consolidated.component';

const routes: Routes = [
  {
    path: '',
    component: ConsolidatedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsolidatedRoutingModule {}
