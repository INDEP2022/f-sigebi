import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectronicSignatureComponent } from './electronic-signature/electronic-signature.component';

const routes: Routes = [
  {
    path: '',
    component: ElectronicSignatureComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectronicSignatureRoutingModule {}
