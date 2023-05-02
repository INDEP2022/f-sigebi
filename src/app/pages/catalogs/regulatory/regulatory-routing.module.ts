import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegulatoryListComponent } from './regulatory-list/regulatory-list.component';

const routes: Routes = [{ path: '', component: RegulatoryListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegulatoryRoutingModule {}
