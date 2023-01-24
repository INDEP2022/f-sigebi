import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsConfigurationComponent } from './layouts-configuration.component';

const routes: Routes = [{ path: '', component: LayoutsConfigurationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutsConfigurationRoutingModule {}
