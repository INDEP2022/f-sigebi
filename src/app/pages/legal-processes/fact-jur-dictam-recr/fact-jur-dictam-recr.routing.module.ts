import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactJurDictamRecrComponent } from './fact-jur-dictam-recr/fact-jur-dictam-recr.component';

const routes: Routes = [
  {  
    path: '', component: FactJurDictamRecrComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactJurDictamRecrRoutingModule { }
