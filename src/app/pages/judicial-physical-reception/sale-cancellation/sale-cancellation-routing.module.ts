import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleCancellationComponent } from './sale-cancellation.component';

const routes: Routes = [{ path: '', component: SaleCancellationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleCancellationRoutingModule {}
