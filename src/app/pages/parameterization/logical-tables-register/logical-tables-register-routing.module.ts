import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogicalTablesRegisterComponent } from './logical-tables-register/logical-tables-register.component';

const routes: Routes = [
  {
    path: '',
    component: LogicalTablesRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogicalTablesRegisterRoutingModule {}
