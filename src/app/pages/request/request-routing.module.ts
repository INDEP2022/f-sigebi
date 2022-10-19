import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestFormComponent } from './transfer-request/request-form/request-form.component';

import { RequestListComponent } from './transfer-request/request-list/request-list.component';

const routes: Routes = [
  {
    path: 'request-in-turn',
    loadChildren: async () =>
      (await import("./request-in-turn/request-in-turn.module"))
      .RequestInTurnModule,
      data: {title: "Solicitudes a turno"}
  },
  {
    path: 'list',
    loadChildren: async () =>
      (await import("./transfer-request/transfer-request.module"))
      .TransferRequestModule,
      data: {title: "Solicitudes de transferencia"}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule { }
