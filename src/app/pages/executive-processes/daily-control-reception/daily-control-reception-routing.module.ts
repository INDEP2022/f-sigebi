import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyControlReceptionComponent } from './daily-control-reception/daily-control-reception.component';

const routes: Routes = [
  {
    path: '',
    component: DailyControlReceptionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyControlReceptionRoutingModule {}
