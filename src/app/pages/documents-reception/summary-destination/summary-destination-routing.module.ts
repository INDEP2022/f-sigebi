import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryDestinationComponent } from './summary-destination/summary-destination.component';

const routes: Routes = [{ path: '', component: SummaryDestinationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummaryDestinationRoutingModule {}
