import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericsListComponent } from './generics-list/generics-list.component';

const routes: Routes = [
  {
    path: '',
    component: GenericsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericsRoutingModule {}
