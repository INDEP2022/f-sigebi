import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatServicesListComponent } from './cat-services-list/cat-services-list.component';

const routes: Routes = [{ path: '', component: CatServicesListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatServicesRoutingModule {}
