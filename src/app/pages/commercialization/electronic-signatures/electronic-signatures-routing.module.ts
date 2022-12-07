import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectronicSignaturesMainComponent } from './electronic-signatures-main/electronic-signatures-main.component';

const routes: Routes = [
  {
    path: '',
    component: ElectronicSignaturesMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectronicSignaturesRoutingModule {}
