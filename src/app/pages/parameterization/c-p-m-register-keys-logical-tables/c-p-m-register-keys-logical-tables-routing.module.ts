import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCRegisterKeysLogicalTablesComponent } from './c-p-c-register-keys-logical-tables/c-p-c-register-keys-logical-tables.component';

const routes: Routes = [
  {
    path: '',
    component: CPCRegisterKeysLogicalTablesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMRegisterKeysLogicalTablesRoutingModule {}
