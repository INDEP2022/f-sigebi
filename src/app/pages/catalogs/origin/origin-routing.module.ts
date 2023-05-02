import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OriginListComponent } from './origin-list/origin-list.component';

const routes: Routes = [{ path: '', component: OriginListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OriginRoutingModule {}
