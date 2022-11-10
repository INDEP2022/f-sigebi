import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JprSaleCancellationComponent } from './jpr-sale-cancellation.component';

const routes: Routes = [{ path: '', component: JprSaleCancellationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JprSaleCancellationRoutingModule {}
