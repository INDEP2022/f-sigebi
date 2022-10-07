import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'request-in-turn',
    loadChildren: async () =>
      (await import("./request-in-turn/request-in-turn.module"))
      .RequestInTurnModule,
      data: {title: "Solicitudes a turno"}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule { }
