import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCTpCPenaltyTypesListComponent } from './c-c-tp-c-penalty-types-list/c-c-tp-c-penalty-types-list.component';

const routes: Routes = [
  {
    path: '',
    component: CCTpCPenaltyTypesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CCMPenaltyTypesRoutingModule { }
