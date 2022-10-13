import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeDoctoListComponent } from './type-docto-list/type-docto-list.component';

const routes: Routes = [
  {
    path: '',
    component: TypeDoctoListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeDoctoRoutingModule {}
