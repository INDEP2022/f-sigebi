import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodSsubtypesListComponent } from './good-ssubtypes-list/good-ssubtypes-list.component';

const routes: Routes = [{ path: '', component: GoodSsubtypesListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodSsubtypesRoutingModule {}
