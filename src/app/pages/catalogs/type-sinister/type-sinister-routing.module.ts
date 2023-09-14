import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeSinisterListComponent } from '../type-sinister/type-sinister-list/type-sinister-list.component';

const routes: Routes = [
  {
    path: '',
    component: TypeSinisterListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeSinisterRoutingModule {}
