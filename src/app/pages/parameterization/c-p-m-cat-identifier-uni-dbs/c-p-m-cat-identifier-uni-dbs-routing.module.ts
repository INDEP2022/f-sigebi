import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCCatIdentifierUniDbsComponent } from './c-p-c-cat-identifier-uni-dbs/c-p-c-cat-identifier-uni-dbs.component';

const routes: Routes = [
  {
    path: '',
    component: CPCCatIdentifierUniDbsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatIdentifierUniDbsRoutingModule {}
