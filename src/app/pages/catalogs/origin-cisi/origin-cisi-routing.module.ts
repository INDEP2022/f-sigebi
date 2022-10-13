import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OriginCisiListComponent } from './origin-cisi-list/origin-cisi-list.component';

const routes: Routes = [{ path: '', component: OriginCisiListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OriginCisiRoutingModule {}
