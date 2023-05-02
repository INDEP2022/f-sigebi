import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayloadComponent } from './payload/payload.component';

const routes: Routes = [
  {
    path: '',
    component: PayloadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayloadRoutingModule {}
