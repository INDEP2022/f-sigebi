import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodSituationListComponent } from './good-situation-list/good-situation-list.component';

const routes: Routes = [{ path: '', component: GoodSituationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodSituationRoutingModule {}
