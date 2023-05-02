import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsTendersComponent } from './goods-tenders/goods-tenders.component';
const routes: Routes = [
  {
    path: '',
    component: GoodsTendersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), DelegationSharedComponent],
  exports: [RouterModule],
})
export class GoodsTendersRoutingModule {}
