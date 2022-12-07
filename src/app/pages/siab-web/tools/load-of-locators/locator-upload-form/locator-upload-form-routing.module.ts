import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocatorUploadFormComponent } from './locator-upload-form/locator-upload-form.component';

const routes: Routes = [
  {
    path: '',
    component: LocatorUploadFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocatorUploadFormRoutingModule {}
