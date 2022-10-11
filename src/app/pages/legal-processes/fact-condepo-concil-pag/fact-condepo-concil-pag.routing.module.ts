import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactCondepoConcilPagComponent } from './fact-condepo-concil-pag/fact-condepo-concil-pag.component';

const routes: Routes = [
  {  
    path: '', component: FactCondepoConcilPagComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactCondepoConcilPagRoutingModule { }
