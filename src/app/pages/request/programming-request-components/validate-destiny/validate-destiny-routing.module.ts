import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateDestinyPhysicalAssetComponent } from './validate-destiny-physical-asset/validate-destiny-physical-asset.component';

const routes: Routes = [
  {
    path: '',
    component: ValidateDestinyPhysicalAssetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateDestinyRoutingModule {}
