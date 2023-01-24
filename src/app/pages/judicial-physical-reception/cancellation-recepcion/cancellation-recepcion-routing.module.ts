import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CancellationRecepcionComponent } from './cancellation-recepcion.component';

const routes: Routes = [
  { path: '', component: CancellationRecepcionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancellationRecepcionRoutingModule {}
