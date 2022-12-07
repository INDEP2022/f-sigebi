import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechnicalDatasheetComponent } from './technical-datasheet/technical-datasheet.component';

const routes: Routes = [
  {
    path: '',
    component: TechnicalDatasheetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechnicalDatasheetRoutingModule {}
