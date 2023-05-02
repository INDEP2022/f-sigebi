import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommercialFileComponent } from './commercial-file/commercial-file.component';

const routes: Routes = [
  {
    path: '',
    component: CommercialFileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercialFileRoutingModule {}
