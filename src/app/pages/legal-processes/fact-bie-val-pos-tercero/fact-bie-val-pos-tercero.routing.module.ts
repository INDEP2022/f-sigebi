import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactBieValPosTerceroComponent } from './fact-bie-val-pos-tercero/fact-bie-val-pos-tercero.component';

const routes: Routes = [
  {  
    path: '', component: FactBieValPosTerceroComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactBieValPosTerceroRoutingModule { }
