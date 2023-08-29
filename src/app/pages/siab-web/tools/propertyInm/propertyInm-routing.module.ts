import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyInmComponent } from './propertyInm/propertyInm.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyInmComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyInmRoutingModule {}
