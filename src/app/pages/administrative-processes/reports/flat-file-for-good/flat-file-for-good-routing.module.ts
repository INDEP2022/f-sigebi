import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlatFileForGoodComponent } from './flat-file-for-good/flat-file-for-good.component';

const routes: Routes = [
  {
    path: '',
    component: FlatFileForGoodComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlatFileForGoodRoutingModule {}
