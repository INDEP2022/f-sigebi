import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumeraryRequestComponent } from './numerary-request/numerary-request.component';

const routes: Routes = [
  {
    path: '',
    component: NumeraryRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraryRequestRoutingModule {}
