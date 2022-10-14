import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactJurDictAmasComponent } from './fact-jur-dict-amas/fact-jur-dict-amas.component';

const routes: Routes = [
  {
    path: '',
    component: FactJurDictAmasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactJurDictAmasRoutingModule {}
