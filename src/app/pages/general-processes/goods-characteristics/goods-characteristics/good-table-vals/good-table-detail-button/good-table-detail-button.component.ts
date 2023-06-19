import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_GOOD } from './columns-good';
import { GoodValueEditWebCar } from './good-value-edit-web-car/good-value-edit-web-car.component';

@Component({
  selector: 'app-good-table-detail-button',
  templateUrl: './good-table-detail-button.component.html',
  styleUrls: ['./good-table-detail-button.component.scss'],
})
export class GoodTableDetailButtonComponent extends BasePage implements OnInit {
  valor: string;
  dato: string;
  cadena: string[];
  tableCd: string;
  noClasif: number;
  disabled: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number;
  pageSizeOptions = [5, 10, 15];
  limit: FormControl = new FormControl(5);
  searchFilter: SearchBarFilter; // Input requerido al llamar el modal
  service: any;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private dynamicTablesService: DynamicTablesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      mode: 'inline',
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'left',
      },
      columns: { ...COLUMNS_GOOD },
      hideSubHeader: true,
    };
    this.params.value.limit = 5;
  }

  get data(): any[] {
    return this.service.dataDetails;
  }

  set data(value: any[]) {
    this.service.dataDetails = value;
  }

  private pupValidaNumero(indexRow: number) {
    const cadena = this.data[indexRow].info
      ? +(this.data[indexRow].info + '')
      : null;
    if (
      [
        'HABITACIONES',
        'BAÑOS',
        'COCINA',
        'COMEDOR',
        'SALA',
        'ESTUDIO',
        'CUARTO DE SERVICIO',
        'NÚMERO DE SALAS',
        'NÚMERO DE LOCALES',
        'NÚMERO DE PISOS',
        'NÚMERO DE DEPARTAMENTOS',
        'ESPACIOS DE ESTACIONAMIENTO',
      ].includes(this.valor)
    ) {
      if (!cadena) {
        if (cadena + ''.length > 2) {
          this.data[indexRow].info = (cadena + '').substring(0, 1);
        } else {
          this.data[indexRow].info = cadena;
        }
      }
    }
  }

  private fillInfo() {
    this.cadena.forEach(item => {
      this.data.forEach((row, index) => {
        const datosColumna = item.trim() != '' ? item.split(':') : [];
        if (row.abreviatura === datosColumna[0]) {
          this.data[index].info = datosColumna[1];
          this.pupValidaNumero(index);
        }
      });
    });
    this.data = [...this.data];
  }

  getData() {
    console.log(this.valor);
    this.cadena = this.valor
      ? this.valor.trim() !== ''
        ? this.valor.split('|')
        : []
      : [];
    console.log(this.cadena);
    // const params = this.params.getValue();
    // params['filter.nmtable'] = 428;
    // this.dynamicTablesService.getAllTvalTable1(params).subscribe({
    //   next: response => {
    //     if (response && response.data && response.data.length > 0) {
    //       this.data = response.data;
    //       this.totalItems = response.count ?? 0;
    //       this.fillInfo();
    //     } else {
    //       this.data = [];
    //       this.totalItems = 0;
    //     }
    //   },
    // });
    this.dynamicTablesService
      .getAllOtkey(this.noClasif, this.tableCd, this.params.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          if (response && response.data && response.data.length > 0) {
            this.data = response.data;
            this.totalItems = response.count ?? 0;
            this.fillInfo();
          } else {
            this.data = [];
            this.totalItems = 0;
          }
        },
      });
  }

  ngOnInit() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: resp => {
        this.getData();
      },
    });
  }

  openForm(row?: any) {
    let config: ModalOptions = {
      initialState: {
        info: row.data.info,
        otvalor: row.data.otvalor,
        callback: (data: any) => {
          console.log(data);
          this.data[row.index].info = data.info;
          this.data = [...this.data];
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodValueEditWebCar, config);
  }

  showDeleteAlert(event?: any) {}

  confirm() {
    let cadena = '';
    let campoValor = '';
    this.data.forEach(row => {
      if (row.otvalor && row.info) {
        if (campoValor.length === 0) {
          campoValor =
            (row.abreviatura ? row.abreviatura : '') + ':' + row.info;
          cadena = campoValor;
        } else {
          campoValor =
            (row.abreviatura ? row.abreviatura : '') + ':' + row.info;
          cadena = cadena + '|' + campoValor;
        }
      }
    });
    console.log(cadena);

    this.modalRef.content.callback(cadena);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
