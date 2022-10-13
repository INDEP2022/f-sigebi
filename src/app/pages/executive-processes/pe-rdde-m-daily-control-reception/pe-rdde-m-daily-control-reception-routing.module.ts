import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeRddeCDailyControlReceptionComponent } from './pe-rdde-c-daily-control-reception/pe-rdde-c-daily-control-reception.component';

const routes: Routes = [
  {
    path:'',
    component: PeRddeCDailyControlReceptionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeRddeMDailyControlReceptionRoutingModule { }
