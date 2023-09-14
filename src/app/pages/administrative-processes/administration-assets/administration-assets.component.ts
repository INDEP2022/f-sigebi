import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared';

@Component({
  template: `
    <app-card [header]="true">
      <div class="ch-content" header>
        <h5 class="title">Administración Bienes</h5>
      </div>
      <div body>
        <div class="row" *ngIf="origin">
          <div class="col-md-12">
            <button class="btn btn-primary active btn-sm" (click)="goBack()">
              Regresar
              <i class="fas fa-arrow-circle-left"></i>
            </button>
          </div>
        </div>
        <div class="md-tabs">
          <tabset>
            <tab heading="Datos Búsqueda">
              <app-search-tab (dataSearch)="chargeData($event)"></app-search-tab
            ></tab>
            <tab heading="Datos Generales Del Bien" *ngIf="dataSearch">
              <app-general-data-goods [goodId]="data"></app-general-data-goods>
            </tab>
            <tab heading="Datos Inventario" *ngIf="dataSearch">
              <app-inventory-data [goodId]="data"></app-inventory-data>
            </tab>
            <tab heading="Datos Avalúos" *ngIf="dataSearch">
              <app-data-valuations [goodId]="data"></app-data-valuations>
            </tab>
            <tab heading="Datos Seguro" *ngIf="dataSearch">
              <app-secure-data [goodId]="data"></app-secure-data>
            </tab>
            <tab heading="Datos Nombramientos" *ngIf="dataSearch">
              <app-appointment-data [goodId]="data"></app-appointment-data>
            </tab>
            <tab heading="Almacenes Asignados" *ngIf="dataSearch">
              <app-warehouses-assigned
                [goodId]="data"></app-warehouses-assigned>
            </tab>
            <tab heading="Bóvedas Asignadas" *ngIf="dataSearch">
              <app-assigned-vaults [goodId]="data"></app-assigned-vaults>
            </tab>
            <tab heading="Registro Servicios" *ngIf="dataSearch">
              <app-registry-services [goodId]="data"></app-registry-services>
            </tab>
            <tab heading="Menaje" *ngIf="dataSearch">
              <app-household [goodId]="data"></app-household>
            </tab>
            <tab heading="Ingresos Por Bien" *ngIf="dataSearch">
              <app-income-per-asset [goodId]="data"></app-income-per-asset>
            </tab>
            <tab heading="Informe Depositaria" *ngIf="dataSearch">
              <app-depositary-report [goodId]="data"></app-depositary-report>
            </tab>
          </tabset>
        </div>
      </div>
    </app-card>
  `,
})
export class AdministrationAssetsComponent extends BasePage {
  dataSearch: boolean;
  data: any;
  chargeData(event: any) {
    this.dataSearch = event.exist;
    this.data = event.data;
  }
  origin: string = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    super();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.origin = params['origin'];
      });
  }
  goBack() {
    //FCONGENRASTREADOR
    if (this.origin == 'FCONGENRASTREADOR') {
      this.router.navigate([`/pages/general-processes/goods-tracker`]);
    }
  }
}
