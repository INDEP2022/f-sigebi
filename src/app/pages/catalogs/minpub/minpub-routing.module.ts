import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MinpubListComponent } from './minpub-list/minpub-list.component';

const routes: Routes = [
  {
    path: '',
    component: MinpubListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinpubRoutingModule {}
