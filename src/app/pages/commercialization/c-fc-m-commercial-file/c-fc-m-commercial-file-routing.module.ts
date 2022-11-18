import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CFcCCommercialFileComponent } from './c-fc-c-commercial-file/c-fc-c-commercial-file.component';

const routes: Routes = [
  {
    path: '',
    component: CFcCCommercialFileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CFcMCommercialFileRoutingModule {}
