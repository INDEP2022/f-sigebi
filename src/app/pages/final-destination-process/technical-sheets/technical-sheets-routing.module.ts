import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechnicalSheetsComponent } from './technical-sheets/technical-sheets.component';

const routes: Routes = [
  {
    path: '',
    component: TechnicalSheetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechnicalSheetsRoutingModule {}
