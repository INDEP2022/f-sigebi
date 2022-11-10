import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JprCancellationRecepcionComponent } from './jpr-cancellation-recepcion.component';

const routes: Routes = [
  { path: '', component: JprCancellationRecepcionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JprCancellationRecepcionRoutingModule {}
