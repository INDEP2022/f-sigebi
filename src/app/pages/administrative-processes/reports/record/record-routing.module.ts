import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { RecordDetailsComponent } from './record-details/record-details.component';

const routes: Routes = [
  {
    path: '',
    component: RecordDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordRoutingModule {}
