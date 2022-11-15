import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpBulkTechnicalSheetsGenerationComponent } from './gp-bulk-technical-sheets-generation/gp-bulk-technical-sheets-generation.component';

const routes: Routes = [
  {
    path: '',
    component: GpBulkTechnicalSheetsGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpBulkTechnicalSheetsGenerationRoutingModule {}
