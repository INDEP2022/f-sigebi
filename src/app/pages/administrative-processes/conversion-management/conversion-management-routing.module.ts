import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversionManagementComponent } from './conversion-management/conversion-management.component';

const routes: Routes = [
  {
    path: '',
    component: ConversionManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversionManagementRoutingModule {}
