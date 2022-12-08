import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sw-avaluos-m-valuation-request',
    loadChildren: async () =>
      (
        await import(
          './sw-avaluos-m-valuation-request/sw-avaluos-m-valuation-request.module'
        )
      ).SwAvaluosMValuationRequestModule,
    data: { title: 'Solicitud valuacion' },
  },
  {
    path: 'sw-avaluos-m-res-cancel-valuation',
    loadChildren: async () =>
      (
        await import(
          './sw-avaluos-m-res-cancel-valuation/sw-avaluos-m-res-cancel-valuation.module'
        )
      ).SwAvaluosMResCancelValuationModule,
    data: { title: 'Res / cancel valuacion' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalsRoutingModule {}
