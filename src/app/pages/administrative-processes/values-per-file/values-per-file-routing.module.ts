import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValuesPerFileComponent } from './values-per-file/values-per-file.component';

const routes: Routes = [
  {
    path: '',
    component: ValuesPerFileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValuesPerFileRoutingModule {}
