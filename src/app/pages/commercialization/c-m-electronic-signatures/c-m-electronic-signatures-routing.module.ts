import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMElectronicSignaturesMainComponent } from './c-m-electronic-signatures-main/c-m-electronic-signatures-main.component';

const routes: Routes = [
  {
    path: '',
    component: CMElectronicSignaturesMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class CMElectronicSignaturesRoutingModule { }
