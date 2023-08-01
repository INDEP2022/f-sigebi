import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import {
  ALLOTMENT_COLUMNS,
  BANK_COLUMNS,
  COLUMNS,
  RECEIVED_COLUMNS,
} from './columns';

import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ILot } from 'src/app/core/models/ms-lot/lot.model';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { ComerGoodsRejectedService } from 'src/app/core/services/ms-prepareevent/comer-goods-rejected.service';
import { SpentService } from 'src/app/core/services/ms-spent/spent.service';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-payment-dispersion-validation',
  templateUrl: './payment-dispersion-validation.component.html',
  styles: [],
})
export class PaymentDispersionValidationComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  totalItems4: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  params4 = new BehaviorSubject<ListParams>(new ListParams());

  lotByEvent: LocalDataSource = new LocalDataSource();
  dataBienes_: LocalDataSource = new LocalDataSource();
  dataPagosBanco_: LocalDataSource = new LocalDataSource();
  dataCompos_: LocalDataSource = new LocalDataSource();
  lote: ILot;

  goodList: IGood[] = [];

  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

  settingsLotes = {
    ...this.settings,
    actions: false,
  };
  settingsBienes = {
    ...this.settings,
    actions: false,
  };
  settingsPagosBanco = {
    ...this.settings,
    actions: false,
  };
  settingsCompos = {
    ...this.settings,
    actions: false,
  };
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});
  show = false;
  eventSelected: any = null;
  comerEventSelect = new DefaultSelect();

  acordionOpen: boolean = false;
  acordionOpen2: boolean = false;
  acordionOpen3: boolean = false;
  acordionOpen4: boolean = false;

  disabledBtnCerrar: boolean = false;
  disabledBtnCerrar2: boolean = false;

  columnFilters: any = [];
  columnFilters2: any = [];
  columnFilters3: any = [];
  columnFilters4: any = [];

  disabledTabs: boolean = false;

  loading2: boolean = false;
  loading3: boolean = false;
  loading4: boolean = false;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('scrollContainer2') scrollContainer2!: ElementRef;

  layout: any = null;
  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private comerEventosService: ComerEventosService,
    private lotService: LotService,
    private goodService: GoodService,
    private comerEventService: ComerEventService,
    private comerGoodsRejectedService: ComerGoodsRejectedService,
    private paymentService: PaymentService,
    private spentService: SpentService,
    private eventAppService: EventAppService,
    private route: ActivatedRoute
  ) {
    super();

    this.settingsLotes = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...COLUMNS },
    };

    this.settingsBienes = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...ALLOTMENT_COLUMNS },
    };

    this.settingsPagosBanco = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...BANK_COLUMNS },
    };
    this.settingsCompos = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...RECEIVED_COLUMNS },
    };

    // this.settingsBienes.columns = ALLOTMENT_COLUMNS;
    // this.settingsPagosBanco.columns = BANK_COLUMNS;
    // this.settingsCompos.columns = RECEIVED_COLUMNS;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('goodType')) {
        console.log(params.get('goodType'));
        // if (this.navigateCount > 0) {
        //   this.form.reset();
        //   this.clientRows = [];
        //   window.location.reload();
        // }
        this.layout = params.get('goodType');

        // this.navigateCount += 1;
      }
    });

    this.prepareForm();

    // PREPARE FILTERS //
    this.prepareFilterLotes();
    this.prepareFilterBienes();
    this.prepareFilterPagosRecibidos();
    this.prepareFilterComposicion();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      processKey: ['', []],
      address: ['', []],
    });

    this.form2 = this.fb.group({
      montoDevolucion: [''],
      montoPenalizacion: [''],
      listaNegra: [''],
    });
  }

  // FILTRADO DE LA TABLA 1 - LOTES //
  prepareFilterLotes() {
    this.lotByEvent
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              lotPublic: () => (searchFilter = SearchFilter.EQ),
              rfc: () => (searchFilter = SearchFilter.ILIKE),
              description: () => (searchFilter = SearchFilter.ILIKE),
              finalPrice: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getLotes('no');
        }
      });

    this.params
      .pipe(
        skip(1),
        tap(() => {
          this.getLotes('no');
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }
  // FILTRADO DE LA TABLA 2 - BIENES //
  prepareFilterBienes() {
    this.dataBienes_
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              finalPrice: () => (searchFilter = SearchFilter.EQ),
              finalVat: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          //Su respectivo metodo de busqueda de datos
          this.getGoodByLotes();
        }
      });

    this.params2
      .pipe(
        skip(1),
        tap(() => {
          this.getGoodByLotes();
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }
  // FILTRADO DE LA TABLA 3 - PAGOS RECIBIDOS //
  prepareFilterPagosRecibidos() {
    this.dataPagosBanco_
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              movementNumber: () => (searchFilter = SearchFilter.EQ),
              bankKey: () => (searchFilter = SearchFilter.ILIKE),
              date: () => (searchFilter = SearchFilter.EQ),
              finalPrice: () => (searchFilter = SearchFilter.EQ),
              reference: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
              entryOrderId: () => (searchFilter = SearchFilter.EQ),
              paymentId: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters3[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters3[field];
            }
          });
          this.params3 = this.pageFilter(this.params3);
          //Su respectivo metodo de busqueda de datos
          this.getPayments();
        }
      });

    this.params3
      .pipe(
        skip(1),
        tap(() => {
          this.getPayments();
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }
  // FILTRADO DE LA TABLA 4 - COMPOSICIÓN DE PAGOS //
  prepareFilterComposicion() {
    this.dataCompos_
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              reference: () => (searchFilter = SearchFilter.ILIKE),
              amountAppVat: () => (searchFilter = SearchFilter.EQ),
              vat: () => (searchFilter = SearchFilter.EQ),
              amountNoAppVat: () => (searchFilter = SearchFilter.EQ),
              transference: () => (searchFilter = SearchFilter.ILIKE),
              type: () => (searchFilter = SearchFilter.EQ),
              paymentId: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters4[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters4[field];
            }
          });
          this.params4 = this.pageFilter(this.params4);
          //Su respectivo metodo de busqueda de datos
          this.getCompos();
        }
      });

    this.params4
      .pipe(
        skip(1),
        tap(() => {
          this.getCompos();
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }

  loteSelected: any = null;
  rowsSelected(event: any) {
    if (event.client) {
      if (event.client.rfc) {
        console.log('SI', event);
        this.llenarInputs(event);
      } else {
        this.form2.patchValue({
          montoDevolucion: '',
          montoPenalizacion: '',
          listaNegra: '',
        });
      }
    } else {
      this.form2.patchValue({
        montoDevolucion: '',
        montoPenalizacion: '',
        listaNegra: '',
      });
    }

    this.loteSelected = event.data;
    this.disabledTabs = true;
    this.acordionOpen2 = true;
    this.acordionOpen3 = true;
    this.acordionOpen4 = true;
    this.disabledBtnCerrar2 = true;

    this.totalItems2 = 0;
    this.totalItems3 = 0;
    this.totalItems4 = 0;

    this.params2.getValue().page = 1;
    this.params2.getValue().limit = 10;

    this.params3.getValue().page = 1;
    this.params3.getValue().limit = 10;

    this.params4.getValue().page = 1;
    this.params4.getValue().limit = 10;

    // Obtener COMER_BIENESXLOTE //
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodByLotes());

    // Obtener COMER_BIENESXLOTE //
    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPayments());

    // Obtener COMER_BIENESXLOTE //
    this.params4
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCompos());

    setTimeout(() => {
      this.performScroll2();
    }, 500);
  }

  async llenarInputs(lote: any) {
    let obj = {
      idEvento: this.eventSelected.id,
      rfc: lote.client.rfc,
    };

    const SPD = await this.getVal1(obj);
    const SPP = await this.getVal2(obj);

    // VALIDAMOS LISTA NEGRA //
    if (lote.client.blackList == 'S') {
      this.form2
        .get('listaNegra')
        .setValue(
          'El Cliente ' + lote.client.nomRazon + ' está en Lista Negra'
        );
    } else {
      this.form2
        .get('listaNegra')
        .setValue('El Cliente ' + lote.client.nomRazon + ' no Tiene Problemas');
    }

    this.form2.get('montoDevolucion').setValue(SPD);
    this.form2.get('montoPenalizacion').setValue(SPP);
  }
  getVal1(params: any) {
    return new Promise((resolve, reject) => {
      this.lotService.getPagosRefMonto(params).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  getVal2(params: any) {
    return new Promise((resolve, reject) => {
      this.lotService.getPagosRefMontoTipod(params).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  filterField() {
    let idLote = this.lote.id;
    console.log(idLote);
    this.filterParams.getValue().addFilter('lotNumber', idLote);
  }

  async getLotsPayment(id: any) {
    return new Promise((resolve, reject) => {
      this.comerEventosService.getPaymentLots(id).subscribe({
        next: data => {
          console.log('data', data);
          resolve(data.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // -------------- EXPORTACIÓN DE EXCEL -------------- //
  async exportarExcel1(body: any) {
    return new Promise((resolve, reject) => {
      this.comerEventosService.pupExpExcel(body).subscribe({
        next: async data => {
          const base64 = data.base64File;
          // const base64 = await this.decompressBase64ToString(response.data.base64File)
          await this.downloadExcel(base64, 'Detalle_de_los_Pagos.csv');
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async exportarExcel2(body: any) {
    return new Promise((resolve, reject) => {
      this.comerEventosService.pupExpxcVenvspag(body).subscribe({
        next: async data => {
          const base64 = data.base64File;
          // const base64 = await this.decompressBase64ToString(response.data.base64File)
          await this.downloadExcel(base64, 'Ventas_vs_pagos.csv');
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async exportarExcel3(body: any) {
    return new Promise((resolve, reject) => {
      this.comerEventosService.pupExpPayModest(body).subscribe({
        next: async data => {
          const base64 = data.base64File;
          // const base64 = await this.decompressBase64ToString(response.data.base64File)
          await this.downloadExcel(base64, 'Pagos_s/m_estatus.csv');
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async exportarExcel4(body: any) {
    return new Promise((resolve, reject) => {
      this.comerEventosService.pupExportDetpayments(body).subscribe({
        next: async data => {
          const base64 = data.base64File;
          // const base64 = await this.decompressBase64ToString(response.data.base64File)
          await this.downloadExcel(base64, 'Pagos_vs_lotes.csv');
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  async downloadExcel(base64String: any, name: any) {
    const mediaType =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
    const link = document.createElement('a');
    link.href = mediaType + base64String;
    link.download = name;
    link.click();
    link.remove();
    this.alert('success', 'Archivo Descargado Correctamente', '');
  }

  // -------------- EXPORTACIÓN DE EXCEL -------------- //

  async exportAsXLSXLotes() {
    if (!this.eventSelected) {
      this.alert('warning', `Debe Especificar un Evento`, '');
      return;
    }
    const lots: any = await this.getLotsPayment(this.eventSelected.id);
    if (!lots) {
      this.alert('error', 'Ocurrió un Error', '');
    } else {
      if (lots.lotes == 0) {
        this.alert(
          'warning',
          `No se han Procesado Pagos en el Evento: ${this.eventSelected.id}.`,
          ''
        );
      } else if (lots.lotes > 0) {
        this.alert(
          'success',
          `El Evento : ${this.eventSelected.id} Cuenta con ${lots.pagos} Pago(s) de ${lots.lotes} Lote(s).`,
          ''
        );

        let obj = {
          pEventKey: this.eventSelected.id,
          pDirection: this.layout,
        };
        await this.exportarExcel1(obj);
      }
    }
  }

  async exportAsXLSXBienes() {
    if (!this.eventSelected) {
      this.alert('warning', `Debe Especificar un Evento`, '');
      return;
    }

    let obj = {
      pEventKey: this.eventSelected.id,
    };
    await this.exportarExcel2(obj);
  }

  async exportAsXLSXPagosBanco() {
    if (!this.eventSelected) {
      this.alert('warning', `Debe Especificar un Evento`, '');
      return;
    }
    let obj = {
      pEventKey: this.eventSelected.id,
    };
    await this.exportarExcel3(obj);
  }

  async exportAsXLSXCompos() {
    if (!this.eventSelected) {
      this.alert('warning', `Debe Especificar un Evento`, '');
      return;
    }

    let obj = {
      pEventKey: this.eventSelected.id,
      pType: 1,
    };
    await this.exportarExcel4(obj);
  }

  // ------------------------- WILMER -------------------------- //

  // COMER_EVENTOS
  getComerEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.addFilter('id', lparams.text, SearchFilter.EQ);

    params.addFilter('address', `M`, SearchFilter.EQ);
    // params.addFilter('eventTpId', `6,7`, SearchFilter.NOTIN);
    // params.addFilter('statusVtaId', `CONT`, SearchFilter.NOT);

    this.comerEventService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        this.comerEventSelect = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.comerEventSelect = new DefaultSelect();
      },
    });
  }

  // COMER_LOTES
  async getLotes(filter: any) {
    this.totalItems = 0;
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (params['filter.rfc']) {
      params['filter.client.rfc'] = params['filter.rfc'];
      delete params['filter.rfc'];
    }

    params['filter.idEvent'] = `$eq:${this.eventSelected.id}`;
    params['sortBy'] = 'lotPublic:ASC';
    this.lotService.getLotbyEvent_(params).subscribe({
      next: data => {
        console.log('LOTES', data);
        let result = data.data.map(async (item: any) => {
          item['rfc'] = item.client ? item.client.rfc : null;
        });

        Promise.all(result).then(resp => {
          this.lotByEvent.load(data.data);
          this.lotByEvent.refresh();
          this.totalItems = data.count;
          this.loading = false;
        });
      },
      error: err => {
        if (filter == 'si') {
          this.alert('warning', 'No hay Lotes Asociados a este Evento', '');
        }
        this.lotByEvent.load([]);
        this.lotByEvent.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  // COMER_BIENESXLOTE
  getGoodByLotes(): void {
    let params2 = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };

    if (params2['filter.description']) {
      params2['filter.good.description'] = params2['filter.description'];
      delete params2['filter.description'];
    }

    params2['filter.lotId'] = `$eq:${this.loteSelected.idLot}`;
    this.comerGoodsRejectedService.getComerGoodXLote(params2).subscribe({
      next: response => {
        console.log(response);
        this.dataBienes_.load(response.data);
        this.dataBienes_.refresh();
        this.totalItems2 = response.count;
        this.loading2 = false;
      },
      error: error => {
        this.loading2 = false;
      },
    });
  }

  // COMER_PAGOREF
  getPayments() {
    this.loading3 = true;
    this.totalItems3 = 0;
    let params3 = {
      ...this.params3.getValue(),
      ...this.columnFilters3,
    };

    if (params3['filter.date']) {
      var fecha = new Date(params3['filter.date']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params3['filter.date'] = `$eq:${fechaFormateada}`;
      // delete params['filter.date'];
    }

    params3['filter.validSistem'] = `$not:$in:R,D`;
    params3['filter.lotId'] = `$eq:${this.loteSelected.idLot}`;
    params3['sortBy'] = `paymentId:ASC`;
    this.paymentService.getComerPaymentRefGetAllV2(params3).subscribe({
      next: response => {
        console.log('PAYMENTS', response);
        let result = response.data.map(async (item: any) => {});
        Promise.all(result).then(resp => {
          this.dataPagosBanco_.load(response.data);
          this.dataPagosBanco_.refresh();
          this.totalItems3 = response.count;
          this.loading3 = false;
        });
      },
      error: error => {
        this.dataPagosBanco_.load([]);
        this.dataPagosBanco_.refresh();
        this.totalItems3 = 0;
        this.loading3 = false;
        console.log(error);
      },
    });
  }

  // COMER_PAGOSREFGENS
  getCompos() {
    this.loading4 = true;
    this.totalItems4 = 0;
    let params4 = {
      ...this.params4.getValue(),
      ...this.columnFilters4,
    };

    params4['filter.lotId'] = `$eq:${this.loteSelected.idLot}`;
    params4['sortBy'] = `paymentId:ASC`;
    this.spentService.getComerPaymentRefGens(params4).subscribe({
      next: response => {
        console.log('PAYMENTS', response);
        let result = response.data.map(async (item: any) => {});
        Promise.all(result).then(resp => {
          this.dataCompos_.load(response.data);
          this.dataCompos_.refresh();
          this.totalItems4 = response.count;
          this.loading4 = false;
        });
      },
      error: error => {
        this.dataCompos_.load([]);
        this.dataCompos_.refresh();
        this.totalItems4 = 0;
        this.loading4 = false;
        console.log(error);
      },
    });
  }
  clear() {
    this.form.reset();
    this.form2.reset();

    this.getComerEvents(new ListParams());

    this.lotByEvent.load([]);
    this.lotByEvent.refresh();
    this.dataBienes_.load([]);
    this.dataBienes_.refresh();
    this.dataPagosBanco_.load([]);
    this.dataPagosBanco_.refresh();
    this.dataCompos_.load([]);
    this.dataCompos_.refresh();

    this.totalItems = 0;
    this.totalItems2 = 0;
    this.totalItems3 = 0;
    this.totalItems4 = 0;

    this.disabledBtnCerrar = false;
    this.disabledBtnCerrar2 = false;

    this.acordionOpen = false;
    this.acordionOpen2 = false;
    this.acordionOpen3 = false;
    this.acordionOpen4 = false;

    this.eventSelected = null;
    this.disabledTabs = false;

    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;

    this.params2.getValue().page = 1;
    this.params2.getValue().limit = 10;

    this.params3.getValue().page = 1;
    this.params3.getValue().limit = 10;

    this.params4.getValue().page = 1;
    this.params4.getValue().limit = 10;
  }

  async search() {
    this.disabledBtnCerrar = true;
    this.acordionOpen = true;
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;

    this.params2.getValue().page = 1;
    this.params2.getValue().limit = 10;

    this.params3.getValue().page = 1;
    this.params3.getValue().limit = 10;

    this.params4.getValue().page = 1;
    this.params4.getValue().limit = 10;

    await this.getLotes('si');
    setTimeout(() => {
      this.performScroll();
    }, 500);
  }

  selectEvent(event: any) {
    console.log(event);
    this.eventSelected = event;
    if (event) {
      this.form.patchValue({
        processKey: event.processKey,
        address: event.address,
      });
      // this.form.get('processKey').setValue(event.processKey);
    }
  }

  edit($event: any) {}

  performScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  performScroll2() {
    if (this.scrollContainer2) {
      this.scrollContainer2.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
