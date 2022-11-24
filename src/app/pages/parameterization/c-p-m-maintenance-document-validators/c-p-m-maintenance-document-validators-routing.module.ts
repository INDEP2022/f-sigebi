import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMMaintenanceDocumentValidatorsComponent } from './c-p-m-maintenance-document-validators/c-p-m-maintenance-document-validators.component';

const routes: Routes = [
  {
    path: '',
    component: CPMMaintenanceDocumentValidatorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMMaintenanceDocumentValidatorsRoutingModule {}
