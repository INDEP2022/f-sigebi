import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaRRCRecordDetailsComponent } from './record-details/pa-r-r-c-record-details.component';

const routes: Routes = [
  {
    path: '',
    component: PaRRCRecordDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaRRMRecordRoutingModule {}
