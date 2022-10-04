import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocResarcimientoSatXmlFormComponent } from './doc-resarcimiento-sat-xml-form/doc-resarcimiento-sat-xml-form.component';
import { DocResarcimientoSatXmlListComponent } from './doc-resarcimiento-sat-xml-list/doc-resarcimiento-sat-xml-list.component';

const routes: Routes = [
  {
    path: '', 
    component: DocResarcimientoSatXmlListComponent 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocResarcimientoSatXmlRoutingModule { }
