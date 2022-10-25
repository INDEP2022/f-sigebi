import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaRclCReturnsConficationsListComponent } from './returns-confications-list/pa-rcl-c-returns-confications-list.component';

const routes: Routes = [
  {
    path: '',
    component: PaRclCReturnsConficationsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaRcMReturnsConficationsRoutingModule { }
