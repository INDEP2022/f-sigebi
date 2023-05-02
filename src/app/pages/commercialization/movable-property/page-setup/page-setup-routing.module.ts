import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageSetupComponent } from './page-setup/page-setup.component';

const routes: Routes = [
  {
    path: '',
    component: PageSetupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSetupRoutingModule {}
