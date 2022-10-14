import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocCompensationSatXmlFormComponent } from './doc-compensation-sat-xml-form/doc-compensation-sat-xml-form.component';
import { DocCompensationSatXmlListComponent } from './doc-compensation-sat-xml-list/doc-compensation-sat-xml-list.component';

const routes: Routes = [
  {
    path: '',
    component: DocCompensationSatXmlListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocCompensationSatXmlRoutingModule {}
