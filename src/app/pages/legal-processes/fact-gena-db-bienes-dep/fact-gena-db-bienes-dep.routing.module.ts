import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactGenaDBBienesXDepComponent } from './fact-gena-db-bienes-dep/fact-gena-db-bienes-dep.component';

const routes: Routes = [
  {  
    path: '', component: FactGenaDBBienesXDepComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactGenaDBBienesXDepRoutingModule { }
