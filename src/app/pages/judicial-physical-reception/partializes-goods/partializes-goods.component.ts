import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { ITreeItem } from 'src/app/core/interfaces/menu.interface';
import { IPartializedGoodList } from 'src/app/core/models/ms-partialize-goods/partialize-good.model';
import { GoodPartializeService } from 'src/app/core/services/ms-partialize/partialize.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';

@Component({
  selector: 'app-partializes-goods',
  templateUrl: './partializes-goods.component.html',
  styleUrls: ['partializes-goods.component.scss'],
})
export class PartializesGoodsComponent
  extends BasePageWidhtDinamicFiltersExtra<IPartializedGoodList>
  implements OnInit
{
  elementToExport: any[];
  form: FormGroup;
  itemsTree: ITreeItem[] = [];
  loadingTree = false;
  loadingExcel = false;
  flagDownload = false;
  @ViewChild('sideMenu') sideMenu: ElementRef;
  constructor(
    private fb: FormBuilder,

    private goodPartializeService: GoodPartializeService
  ) {
    super();
    this.service = this.goodPartializeService;
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        goodNumber: {
          title: 'No. Bien',
          type: 'string',
          sort: false,
        },
        description: {
          title: 'Descripción',
          type: 'string',
          sort: false,
        },
      },
    };
    this.ilikeFilters.push('goodNumber');
    this.prepareForm();
  }

  exportExcel() {
    this.loadingExcel = true;
    this.elementToExport = [];
    const arrayDetails: any[] = [];
    this.items.forEach(item => {
      arrayDetails.push({
        PARCIALIZACION: item.partializedId,
        BIEN: item.goodNumber,
        DESCRIPCION: item.description,
      });
    });
    this.elementToExport = [...arrayDetails];
    this.flagDownload = !this.flagDownload;
    // console.log(x);
    this.loadingExcel = false;
    // this.service.getExcel(this.filterParams).subscribe(x => {

    // });
    // console.log(this.table);
  }

  override getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.service) {
      this.service.getAll(params).subscribe({
        next: (response: any) => {
          if (response) {
            if (
              this.columnFilters['filter.goodNumber'] &&
              response.data &&
              response.data.length > 0
            ) {
              this.select(response.data[0].goodNumber);
            }
            this.totalItems = response.count || 0;
            this.items = response.data;
            this.data.load(response.data);
            this.data.refresh();
            this.loading = false;
          }
        },
        error: err => {
          this.totalItems = 0;
          this.data.load([]);
          this.data.refresh();
          this.loading = false;
        },
      });
    } else {
      this.totalItems = 0;
      this.data.load([]);
      this.data.refresh();
      this.loading = false;
    }
  }

  select(goodNumber: number) {
    // console.log(row);
    this.loadingTree = true;
    this.goodPartializeService
      .getTreePartialize(goodNumber)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);
          if (response[0].subItems.length === 0) {
            this.onLoadToast(
              'error',
              'Bien ' + goodNumber,
              'No tiene bienes parcializados'
            );
          }
          this.itemsTree = response;
          this.loadingTree = false;
        },
        error: err => {
          console.log(err);
        },
      });
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
    });
  }
}

const EXAMPLE_DATA = [
  {
    noBien: 1953379,
    descripcion:
      'BIEN(ES) GENERADO(S): 1987808, 1987809; 1- MUÑECOS DE PELUCHE;MYM',
  },
  {
    noBien: 1990,
    descripcion: 'DISCOS COMPACTOS',
  },
  {
    noBien: 733964,
    descripcion:
      'BIEN(ES) GENERADOS(S): 753481, 753482; PIEZA, PINZAS-CEPILLOS PARA CABELLO MARCA REVLON',
  },
  {
    noBien: 1109314,
    descripcion: 'BIEN(ES) GENERADO(S): 1132297, 1132298; PIEZA, COBIJAS.',
  },
  {
    noBien: 785939,
    descripcion:
      'BIEN(ES) GENERADO(S): 921866, 921867, 921868, PIEZA, MUÑECOS Y JUGUETES DIVERSOS',
  },
  {
    noBien: 710337,
    descripcion:
      'BIEN(ES) GENERADOS(S): 729857, 729858; PIEZA, SUDADERA PARA HOMBRE, EN REGULAR ESTADO FISICO',
  },
  {
    noBien: 488145,
    descripcion:
      'BIEN(ES) GENERADOS(S): 713186, 713187; FICHA DE DEPOSITO POR $96.50 M.N.',
  },
  {
    noBien: 754766,
    descripcion:
      'BIEN(ES) GENERADO(S): 1363030, 1363032; FICHA DE DEPOSITO POR LA CANTIDAD DE 1,041,061.00 DOLARES AMERICANOS',
  },
  {
    noBien: 1236400,
    descripcion:
      'BIEN(ES) GENERADOS(S): 1289477, 1289478, 1289479, 1289480, 1289481, 1289482, 1289483, 1289484, 1289485, 1289486, 1289487, 1289488, 1289489, 1289490, 1289491, 1289492, 1289493, 1289494, 1289495, 1289496, 1289497, 1289498, 1289499, 1289500, 1289501, 1289502, 1289503, 1289504, 1289505, 1289506, 1289507, 1289508, 1289509, 1289510;AGRUPADO PARA DESTINO DE ROPA DIVERSA',
  },
  {
    noBien: 855829,
    descripcion:
      'BIEN(ES) GENERADO(S): 1008033, 1008034; 15880 PIEZAS DE PANTS; OCUPA CONTENEDOR CAXU7161269.',
  },
  {
    noBien: 1152682,
    descripcion:
      'BIEN(ES) GENERADO(S): 1226373, 1226374, 1226375, 1226376, 1226377, 1226378, 1226379, 1226380, 1226381, 1226382, 1226383, 1226384, 1226385, 1226386, 1226387, 1226388, 1226390, 1226391, 1226392, 1226393, 1226394, 1226395, 1226396, 1226397, 1226398, 1226399, 1226400, 1226401, 1226402, 1226403, 1226404, 1226405, 1226406, 1226407, 1226408, 1226409, 1226410, 1226411, JUGUETES',
  },
];
