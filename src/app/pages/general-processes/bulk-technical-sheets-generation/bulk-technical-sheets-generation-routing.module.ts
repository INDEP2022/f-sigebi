import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkTechnicalSheetsGenerationComponent } from './bulk-technical-sheets-generation/bulk-technical-sheets-generation.component';

const routes: Routes = [
  {
    path: '',
    component: BulkTechnicalSheetsGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkTechnicalSheetsGenerationRoutingModule {}
