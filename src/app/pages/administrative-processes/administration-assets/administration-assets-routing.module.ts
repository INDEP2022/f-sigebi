import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationAssetsComponent } from './administration-assets.component';

const routes: Routes = [{ path: '', component: AdministrationAssetsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationAssetsRoutingModule {}
