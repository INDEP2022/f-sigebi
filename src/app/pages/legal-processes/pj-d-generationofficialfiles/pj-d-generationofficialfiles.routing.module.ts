import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PJDGenerationOfficialFilesComponent } from './pj-d-generationofficialfiles/pj-d-generationofficialfiles.component';

const routes: Routes = [
  {  
    path: '', component: PJDGenerationOfficialFilesComponent
  },
  

]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PJDGenerationOfficialFilesRoutingModule { }
