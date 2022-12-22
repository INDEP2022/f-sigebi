import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { reportOiComponent } from './report-oi/report-oi.component';

const routes: Routes = [
  {
    path: '',
    component: reportOiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class reportOiRoutingModule {}
