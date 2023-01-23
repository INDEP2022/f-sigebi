import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordAccountStatementsComponent } from './record-account-statements/record-account-statements.component';

const routes: Routes = [
  {
    path: '',
    component: RecordAccountStatementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordAccountStatementsRoutingModule {}
