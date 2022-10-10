import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactJurBienesXAmpComponent } from './fact-jur-bienes-x-amp/fact-jur-bienes-x-amp.component';

const routes: Routes = [
  {  
    path: '', component: FactJurBienesXAmpComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactJurBienesXAmpRoutingModule { }
