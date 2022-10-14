import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactGenActDatexComponent } from './fact-gen-act-datex/fact-gen-act-datex.component';

const routes: Routes = [
  {
    path: '',
    component: FactGenActDatexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactGenActDatexRoutingModule {}
