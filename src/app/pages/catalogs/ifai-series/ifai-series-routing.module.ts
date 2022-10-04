import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IfaiSeriesListComponent } from './ifai-series-list/ifai-series-list.component';

const routes: Routes = [{ path: '', component: IfaiSeriesListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IfaiSeriesRoutingModule {}
