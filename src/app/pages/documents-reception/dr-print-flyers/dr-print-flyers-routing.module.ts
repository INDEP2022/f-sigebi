import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrPrintFlyersComponent } from './dr-print-flyers/dr-print-flyers.component';

const routes: Routes = [{ path: '', component: DrPrintFlyersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrPrintFlyersRoutingModule {}
