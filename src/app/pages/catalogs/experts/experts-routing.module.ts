import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpertListComponent } from './expert-list/expert-list.component';

const routes: Routes = [{ path: '', component: ExpertListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpertsRoutingModule {}
