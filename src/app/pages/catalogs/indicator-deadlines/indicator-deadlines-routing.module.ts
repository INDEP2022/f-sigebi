import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorDeadlinesListComponent } from './indicator-deadlines-list/indicator-deadlines-list.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorDeadlinesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorDeadlinesRoutingModule {}
