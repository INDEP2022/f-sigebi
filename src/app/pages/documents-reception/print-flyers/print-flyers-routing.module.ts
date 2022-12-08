import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintFlyersComponent } from './print-flyers/print-flyers.component';

const routes: Routes = [{ path: '', component: PrintFlyersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintFlyersRoutingModule {}
