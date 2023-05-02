import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DictateAssetsComponent } from './dictate-assets/dictate-assets.component';

const routes: Routes = [
  {
    path: '',
    component: DictateAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DictateAssetsStudyRoutingModule {}
