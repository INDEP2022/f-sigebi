import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SamplingAssetsFormComponent } from './sampling-assets-form/sampling-assets-form.component';

const routes: Routes = [
  {
    path: '',
    component: SamplingAssetsFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SamplingAssetsRoutingModule {}
