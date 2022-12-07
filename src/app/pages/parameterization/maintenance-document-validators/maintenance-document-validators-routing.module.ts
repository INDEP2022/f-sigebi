import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceDocumentValidatorsComponent } from './maintenance-document-validators/maintenance-document-validators.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceDocumentValidatorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceDocumentValidatorsRoutingModule {}
