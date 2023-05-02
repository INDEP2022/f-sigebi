import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { MarketingRecordsComponent } from './marketing-records/marketing-records.component';

const routes: Routes = [
  {
    path: '',
    component: MarketingRecordsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingRecordsRoutingModule {}
