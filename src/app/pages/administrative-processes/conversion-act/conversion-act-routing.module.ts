import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversionActDetailComponent } from './conversion-act-detail/conversion-act-detail.component';
import { ConversionActComponent } from './conversion-act/conversion-act.component';

const routes: Routes = [
  {
    path:'',
    component: ConversionActComponent
  },
  {
    path: 'act-detail',
    component: ConversionActDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversionActRoutingModule { }
