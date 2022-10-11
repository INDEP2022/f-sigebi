import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactConDepoDisPagosComponent } from './fact-con-depo-dis-pagos/fact-con-depo-dis-pagos.component';

const routes: Routes = [
  {  
    path: '', component: FactConDepoDisPagosComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactConDepoDisPagosRoutingModule { }
