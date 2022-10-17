import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RackListComponent } from './rack-list/rack-list.component';

const routes: Routes = [{ path: '', component: RackListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RackRoutingModule {}
