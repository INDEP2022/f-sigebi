import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpITechnicalDatasheetComponent } from './gp-i-technical-datasheet/gp-i-technical-datasheet.component';

const routes: Routes = [
  {
    path: '',
    component: GpITechnicalDatasheetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpITechnicalDatasheetRoutingModule {}
