import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodSssubtypesListComponent } from './good-sssubtypes-list/good-sssubtypes-list.component';

const routes: Routes = [{ path: '', component: GoodSssubtypesListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodSssubtypesRoutingModule {}
