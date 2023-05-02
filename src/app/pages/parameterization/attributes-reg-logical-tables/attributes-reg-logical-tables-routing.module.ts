import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributesRegLogicalTablesComponent } from './attributes-reg-logical-tables/attributes-reg-logical-tables.component';

const routes: Routes = [
  {
    path: '',
    component: AttributesRegLogicalTablesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ttributesRegLogicalTablesRoutingModule {}
