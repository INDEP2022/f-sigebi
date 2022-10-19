import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMLcsMassiveConversionMainComponent } from './c-m-lcs-massive-conversion-main/c-m-lcs-massive-conversion-main.component';

const routes: Routes = [
  {
    path: '',
    component: CMLcsMassiveConversionMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMLcsMassiveConversionRoutingModule {}
