import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatIdentifierUniDbsComponent } from './cat-identifier-uni-dbs/cat-identifier-uni-dbs.component';

const routes: Routes = [
  {
    path: '',
    component: CatIdentifierUniDbsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatIdentifierUniDbsRoutingModule {}
