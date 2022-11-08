import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateExcelFileComponent } from './generate-excel-file/generate-excel-file.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateExcelFileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateExcelFileRoutingModule {}
