import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactJurAbonadosComponent } from './fact-jur-abandonos/fact-jur-abandonos.component';

const routes: Routes = [
  {  
    path: '', component: FactJurAbonadosComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactJurAbonadosRoutingModule { }
