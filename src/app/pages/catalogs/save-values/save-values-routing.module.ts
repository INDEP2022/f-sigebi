import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaveValuesListComponent } from './save-values-list/save-values-list.component';

const routes: Routes = [
  {
    path: '',
    component: SaveValuesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaveValuesRoutingModule {}
