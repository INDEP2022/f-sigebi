import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalSupportListComponent } from './legal-support-list/legal-support-list.component';

const routes: Routes = [{ path: '', component: LegalSupportListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalSupportRoutingModule {}
