import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMLayoutsConfigurationComponent } from './c-m-layouts-configuration.component';

const routes: Routes = [
  { path: '', component: CMLayoutsConfigurationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMLayoutsConfigurationRoutingModule {}
