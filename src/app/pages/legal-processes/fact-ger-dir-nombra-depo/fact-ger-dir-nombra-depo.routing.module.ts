import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactGerDirNombraDepoComponent } from './fact-ger-dir-nombra-depo/fact-ger-dir-nombra-depo.component';

const routes: Routes = [
  {  
    path: '', component: FactGerDirNombraDepoComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactGerDirNombraDepoRoutingModule { }
