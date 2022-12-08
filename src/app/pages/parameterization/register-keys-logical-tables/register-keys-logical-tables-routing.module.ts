import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterKeysLogicalTablesComponent } from './register-keys-logical-tables/register-keys-logical-tables.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterKeysLogicalTablesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterKeysLogicalTablesRoutingModule {}
