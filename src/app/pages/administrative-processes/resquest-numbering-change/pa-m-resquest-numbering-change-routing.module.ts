import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaRncCResquestNumberingChangeComponent } from './pa-rnc-c-resquest-numbering-change/pa-rnc-c-resquest-numbering-change.component';

const routes: Routes = [
  {
    path: '',
    component: PaRncCResquestNumberingChangeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaMResquestNumberingChangeRoutingModule { }
