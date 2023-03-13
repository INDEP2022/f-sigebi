import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'penalty-types',
    loadChildren: async () =>
      (await import('./penalty-types/penalty-types.module')).PenaltyTypesModule,
    data: { title: 'Tipos de Penalización', screen: 'FCOMERTIPOPENALIZA' },
  },
  {
    path: 'authorization-keys-ois',
    loadChildren: async () =>
      (await import('./authorization-keys/authorization-keys.module'))
        .AuthorizationKeysModule,
    data: {
      title: 'Claves de Autorización Envío Ext. OIs',
      screen: 'FCOMERCVEAUTOI',
    },
  },
  {
    path: 'capture-lines',
    loadChildren: async () =>
      (await import('./capture-lines/capture-lines.module')).CaptureLinesModule,
    data: { title: 'Líneas de Captura', screen: 'FCOMER065' },
  },
  {
    path: 'customers',
    loadChildren: async () =>
      (await import('./customers/customers.module')).CustomersModule,
    data: { title: 'Clientes', screen: 'FCOMER060' },
  },
  {
    path: 'providers',
    loadChildren: async () =>
      (await import('./provider-catalogs/provider-catalogs.module'))
        .ProviderCatalogsModule,
    data: { title: 'Proveedores', screen: 'FCOMER082' },
  },
  {
    path: 'customers-penalties',
    loadChildren: async () =>
      (await import('./customers-penalties/customers-penalties.module'))
        .CustomersPenaltiesModule,
    data: { title: 'Penalización de Clientes' },
  },
  {
    path: 'event-types',
    loadChildren: async () =>
      (await import('./event-types/event-types.module')).EventTypesModule,
    data: { title: 'Tipos de Eventos' },
  },
  {
    path: 'sale-status',
    loadChildren: async () =>
      (await import('./sale-status/sale-status.module')).SaleStatusModule,
    data: { title: 'Estatus de Venta' },
  },
  {
    path: 'goods-available-sale-status',
    loadChildren: async () =>
      (await import('./goods-available-sale/goods-available-sale.module'))
        .GoodsAvailableSaleModule,
    data: { title: 'Est. Bienes Disponibles para Comercializar' },
  },
  {
    path: 'bank-movements-types',
    loadChildren: async () =>
      (await import('./bank-movements-types/bank-movements-types.module'))
        .BankMovementsTypesModule,
    data: { title: 'Tipos Movimiento Banco' },
  },
  {
    path: 'parameters',
    loadChildren: async () =>
      (await import('./parameters/parameters.module')).ParametersModule,
    data: { title: 'Parámetros Comercialización' },
  },
  {
    path: 'users-event-types',
    loadChildren: async () =>
      (await import('./users-event-types/users-event-types.module'))
        .UsersEventTypesModule,
    data: { title: 'Usuarios por Tipo de Evento' },
  },
  {
    path: 'brands-sub-brands',
    loadChildren: async () =>
      (await import('./brands-sub-brands/brands-sub-brands.module'))
        .BrandsSubBrandsModule,
    data: { title: 'Marcas y Sub Marcas' },
  },
  {
    path: 'models',
    loadChildren: async () =>
      (await import('./models/models.module')).ModelsModule,
    data: { title: 'Modelos' },
  },
  {
    path: 'event-process',
    loadChildren: async () =>
      (await import('./event-process/event-process.module')).EventProcessModule,
    data: { title: 'Eventos por Proceso', screen: 'FCOMEREVENTPOPROCESO' },
  },
  {
    path: 'registration-of-interest',
    loadChildren: async () =>
      (
        await import(
          './registration-of-interest/registration-of-interest.module'
        )
      ).RegistrationOfInterestModule,
    data: { title: 'Registro de Intereses' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogsRoutingModule {}
