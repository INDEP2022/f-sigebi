import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CBMrCMarketingRecordsComponent } from './marketing-records/c-b-mr-c-marketing-records.component';

const routes: Routes = [
  {
    path: '',
    component: CBMrCMarketingRecordsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBMrMMarketingRecordsRoutingModule { }
