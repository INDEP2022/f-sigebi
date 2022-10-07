import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactGerJurrecDerevComponent } from './fact-ger-jurrec-derev/fact-ger-jurrec-derev.component';

const routes: Routes = [
  {  
    path: '', component: FactGerJurrecDerevComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactGerJurrecDerevRoutingModule { }
