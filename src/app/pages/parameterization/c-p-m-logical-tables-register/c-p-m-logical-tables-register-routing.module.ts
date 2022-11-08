import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCLogicalTablesRegisterComponent } from './c-p-c-logical-tables-register/c-p-c-logical-tables-register.component';

const routes: Routes = [
  {
    path: '',
    component: CPCLogicalTablesRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMLogicalTablesRegisterRoutingModule {}
