import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { ValidStatusesComponent } from './valid-statuses/valid-statuses.component';
const routes: Routes = [
  {
    path: '',
    component: ValidStatusesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormLoaderComponent],
  exports: [RouterModule],
})
export class ValidStatusesRoutingModule {}
