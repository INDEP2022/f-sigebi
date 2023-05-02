import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SatClassificationListComponent } from './sat-classification-list/sat-classification-list.component';

const routes: Routes = [
  { path: '', component: SatClassificationListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SatClassificationRoutingModule {}
