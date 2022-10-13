import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotaryListComponent } from './notary-list/notary-list.component';

const routes: Routes = [
  {
    path: '',
    component: NotaryListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotaryRoutingModule {}
