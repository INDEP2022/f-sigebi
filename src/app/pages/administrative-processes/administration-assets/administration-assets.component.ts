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
            <tab heading="Datos busqueda">
              <app-search-tab (dataSearch)="chargeData($event)"></app-search-tab
            ></tab>
            <tab heading="Datos generales del bien" *ngIf="dataSearch">
              <app-general-data-goods [goodId]="data"></app-general-data-goods>
            </tab>
            <tab heading="Datos inventario" *ngIf="dataSearch">
              <app-inventory-data></app-inventory-data>
            </tab>
            <tab heading="Datos avaluos" *ngIf="dataSearch">
              <app-data-valuations></app-data-valuations>
            </tab>
            <tab heading="Datos seguro" *ngIf="dataSearch">
              <app-secure-data></app-secure-data>
            </tab>
            <tab heading="Registro servicios" *ngIf="dataSearch">
              <app-registry-services></app-registry-services>
            </tab>
            <tab heading="Menaje" *ngIf="dataSearch">
              <app-household></app-household>
            </tab>
            <tab heading="Ingresos por bien" *ngIf="dataSearch">
              <app-income-per-asset></app-income-per-asset>
            </tab>
            <tab heading="Informe depositaria" *ngIf="dataSearch">
              <app-depositary-report></app-depositary-report>
            </tab>
          </tabset>
        </div>
      </div>
    </app-card>
  `,
})
export class AdministrationAssetsComponent {
  dataSearch: boolean;
  data: any;
  chargeData(event: any) {
    this.dataSearch = event.exist;
    this.data = event.data;
  }
}
