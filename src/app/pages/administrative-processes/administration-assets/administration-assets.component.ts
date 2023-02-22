import { Component } from '@angular/core';

@Component({
  template: `
    <app-card [header]="true">
      <div class="ch-content" header>
        <h5 class="title">Administracion Bienes</h5>
      </div>
      <div body>
        <div class="md-tabs">
          <tabset>
            <tab heading="Datos busqueda"
              ><app-search-tab></app-search-tab
            ></tab>
            <tab heading="Datos generales del bien">
              <app-general-data-goods></app-general-data-goods>
            </tab>
            <tab heading="Datos inventario">
              <app-inventory-data></app-inventory-data>
            </tab>
            <tab heading="Datos avaluos">
              <app-data-valuations></app-data-valuations>
            </tab>
            <tab heading="Datos seguro">
              <app-secure-data></app-secure-data>
            </tab>
            <tab heading="Registro servicios">
              <app-registry-services></app-registry-services>
            </tab>
            <tab heading="Menaje">
              <app-household></app-household>
            </tab>
            <tab heading="Ingresos por bien">
              <app-income-per-asset></app-income-per-asset>
            </tab>
            <tab heading="Informe depositaria">
              <app-depositary-report></app-depositary-report>
            </tab>
          </tabset>
        </div>
      </div>
    </app-card>
  `,
})
export class AdministrationAssetsComponent {}
