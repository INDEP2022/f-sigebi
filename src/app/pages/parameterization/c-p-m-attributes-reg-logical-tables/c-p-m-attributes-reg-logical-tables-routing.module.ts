import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCAttributesRegLogicalTablesComponent } from './c-p-c-attributes-reg-logical-tables/c-p-c-attributes-reg-logical-tables.component';

const routes: Routes = [
  {
    path: '',
    component: CPCAttributesRegLogicalTablesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMAttributesRegLogicalTablesRoutingModule {}
