import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'penalty-types',
    loadChildren: async () =>
      (await import('./c-c-m-penalty-types/c-c-m-penalty-types.module'))
        .CCMPenaltyTypesModule,
    data: { title: 'Tipos de Penalización' },
  },
  {
    path: 'authorization-keys-ois',
    loadChildren: async () =>
      (
        await import(
          './c-c-m-authorization-keys-ois/c-c-m-authorization-keys-ois.module'
        )
      ).CCMAuthorizationKeysOisModule,
    data: { title: 'Claves de Autorización Envío Ext. OIs' },
  },
  {
    path: 'capture-lines',
    loadChildren: async () =>
      (await import('./c-c-m-capture-lines/c-c-m-capture-lines.module'))
        .CCMCaptureLinesModule,
    data: { title: 'Líneas de Captura' },
  },
  {
    path: 'customers',
    loadChildren: async () =>
      (await import('./customers/c-c-c-m-customers.module'))
        .CCCMCustomersModule,
    data: { title: 'Clientes' },
  },
  {
    path: 'providers',
    loadChildren: async () =>
      (await import('./c-c-m-provider-catalogs/c-c-m-provider-catalogs.module'))
        .CCMProviderCatalogsModule,
    data: { title: 'Proveedores' },
  },
  {
    path: 'customers-penalties',
    loadChildren: async () =>
      (
        await import(
          './customers-penalties/c-c-cp-m-customers-penalties.module'
        )
      ).CCCpMCustomersPenaltiesModule,
    data: { title: 'Penalización de Clientes' },
  },
  {
    path: 'event-types',
    loadChildren: async () =>
      (await import('./event-types/c-c-et-m-event-types.module'))
        .CCEtMEventTypesModule,
    data: { title: 'Tipos de Eventos' },
  },
  {
    path: 'sale-status',
    loadChildren: async () =>
      (await import('./sale-status/c-c-ss-m-sale-status.module'))
        .CCSsMSaleStatusModule,
    data: { title: 'Estatus de Venta' },
  },
  {
    path: 'goods-available-sale-status',
    loadChildren: async () =>
      (
        await import(
          './goods-available-sale/c-c-gas-m-goods-available-sale.module'
        )
      ).CCGasMGoodsAvailableSaleModule,
    data: { title: 'Est. Bienes Disponibles para Comercializar' },
  },
  {
    path: 'bank-movements-types',
    loadChildren: async () =>
      (
        await import(
          './bank-movements-types/c-c-bmt-m-bank-movements-types.module'
        )
      ).CCBmtMBankMovementsTypesModule,
    data: { title: 'Tipos Movimiento Banco' },
  },
  {
    path: 'parameters',
    loadChildren: async () =>
      (await import('./parameters/c-c-p-m-parameters.module'))
        .CCPMParametersModule,
    data: { title: 'Parámetros Comercialización' },
  },
  {
    path: 'users-event-types',
    loadChildren: async () =>
      (await import('./users-event-types/c-c-uet-m-users-event-types.module'))
        .CCUetMUsersEventTypesModule,
    data: { title: 'Usuarios por Tipo de Evento' },
  },
  {
    path: 'brands-sub-brands',
    loadChildren: async () =>
      (await import('./brands-sub-brands/c-c-bsb-m-brands-sub-brands.module'))
        .CCBsbMBrandsSubBrandsModule,
    data: { title: 'Marcas y Sub Marcas' },
  },
  {
    path: 'models',
    loadChildren: async () =>
      (await import('./models/c-c-m-m-models.module')).CCMMModelsModule,
    data: { title: 'Modelos' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogsRoutingModule {}
