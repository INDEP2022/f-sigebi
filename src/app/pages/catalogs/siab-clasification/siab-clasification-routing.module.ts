import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiabClasificationListComponent } from './siab-clasification-list/siab-clasification-list.component';

const routes: Routes = [
  {
    path: '',
    component: SiabClasificationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiabClasificationRoutingModule {}
