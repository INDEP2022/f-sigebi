import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeRelevantListComponent } from './type-relevant-list/type-relevant-list.component';

const routes: Routes = [
  {
    path: '',
    component: TypeRelevantListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeRelevantRoutingModule {}
