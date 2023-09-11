import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { ListDonationComponent } from '../list-donation/list-donation.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-registration-inventories-donation',
  templateUrl: './registration-inventories-donation.component.html',
  styles: [
    `
      .br-card {
        border: 1px solid #545b62 !important;
      }
    `,
  ],
})
export class RegistrationInventoriesDonationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  formTable: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  loadingGood: boolean = false;
  columnFilters: any = [];
  goods: any[] = [];

  selectedRows: any[] = [];
  flag: boolean = false;

  //butons y campos enabled
  PB_CONFIRMAR: boolean = true;
  PB_REGISTRAR: boolean = false;
  constructor(
    private fb: FormBuilder,
    private goodServ: GoodService,
    private goodprocessService: GoodprocessService,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private globalVarsService: GlobalVarsService,
    private router: Router
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      selectMode: 'multi',
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: COLUMNS,
    };
    //this.filterTable();
  }

  ngOnInit(): void {
    this.initForm();
    this.filterTable();
  }

  filterTable() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'goodId':
                field = 'filter.noBien';
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'quantity':
                searchFilter = SearchFilter.EQ;
                break;
              case 'associatedFileNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'unit':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'sssubType':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'delAdmin':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'storeNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.listGoods();
          let i = 0;
          console.log('entra ', i++);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.listGoods());
  }

  initForm() {
    this.form = this.fb.group({
      requestId: [null, [Validators.maxLength(11)]],
      doneeId: [null, [Validators.maxLength(11)]],
      donee: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(255)],
      ],
      justification: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(150)],
      ],
      state: [null, [Validators.pattern(STRING_PATTERN)]],
      municipality: [null, [Validators.pattern(STRING_PATTERN)]],
      direction: [null, [Validators.pattern(STRING_PATTERN)]],
      requestDate: [null, [Validators.pattern(STRING_PATTERN)]],
      requestTypeId: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(2)],
      ],
      authorizeCve: [
        null,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(40)],
      ],
      authorizeDate: [null, [Validators.pattern(STRING_PATTERN)]],
      clasifGoodId: [null, [Validators.pattern(STRING_PATTERN)]],
      authorizeType: [
        'T',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(2)],
      ],

      sunQuantity: [null, [Validators.pattern(STRING_PATTERN)]],
      sunStatus: [null, [Validators.pattern(STRING_PATTERN)]],
      representative: [null, [Validators.pattern(STRING_PATTERN)]],
      position: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.form.get('authorizeCve').disable();
    this.form.get('authorizeDate').disable();
    this.form.get('authorizeType').disable();

    this.form.get('authorizeDate').valueChanges.subscribe({
      next: () => this.validateDateAuthorize(),
    });

    this.form.get('requestDate').valueChanges.subscribe({
      next: () => this.validateDateRequest(),
    });

    this.formTable = this.fb.group({
      totalGoods: [null, [Validators.required]],
    });
  }

  validateDateAuthorize() {
    const dateInit = this.form.get('requestDate').value;
    const dateEnd = this.form.get('authorizeDate').value;

    if (!dateEnd || dateEnd == 'Invalid Date') return;

    const date1 =
      typeof dateInit == 'string'
        ? this.dateTimeTypeString(dateInit)
        : this.dateTimeTypeDate(dateInit);
    const date2 =
      typeof dateEnd == 'string'
        ? this.dateTimeTypeString(dateEnd)
        : this.dateTimeTypeDate(dateEnd);

    if (date2 < date1) {
      this.onLoadToast(
        'warning',
        'La Fecha de Autorización es menor a la Fecha de Solicitud.',
        ''
      );
    }
  }

  validateDateRequest() {
    const dateInit = this.form.get('requestDate').value;
    const dateEnd = this.form.get('authorizeDate').value;

    if (!dateEnd) return;
    if (!dateInit || dateInit == 'Invalid Date') return;

    const date1 =
      typeof dateInit == 'string'
        ? this.dateTimeTypeString(dateInit)
        : this.dateTimeTypeDate(dateInit);
    const date2 =
      typeof dateEnd == 'string'
        ? this.dateTimeTypeString(dateEnd)
        : this.dateTimeTypeDate(dateEnd);

    if (date1 > date2) {
      this.onLoadToast(
        'warning',
        'La Fecha de Solicitud no puede mayor a la de autorización.',
        ''
      );
    }
  }

  dateTimeTypeString(date: string): number {
    let time: string = date.split('T')[0].split('-').join('/');
    return new Date(time).getTime();
  }

  dateTimeTypeDate(date: Date): number {
    let time: string = this.datePipe.transform(date, 'yyyy/MM/dd');
    return new Date(time).getTime();
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  callFilterDonation() {
    window.open(
      './pages/parameterization/filters-of-goods-for-donation',
      '_blank'
    );
  }

  callRastreador() {
    window.open('./pages/general-processes/goods-tracker', '_blank');
  }

  authorize() {
    const { authorizeCve, authorizeDate, authorizeType } = this.form.value;
    const type = ['D', 'A'];
    if (!type.includes(authorizeType)) {
      this.onLoadToast('warning', 'Se Debe Especificar el Tipo de Trámite', '');
      return;
    }
    if (!authorizeCve || !authorizeDate) {
      this.onLoadToast(
        'warning',
        'Se Debe Ingresar la Clave y/o Fecha de Autorización.',
        ''
      );
      return;
    }

    this.form.get('sunStatus').patchValue('ADA');
  }

  getBienes() {
    this.loadingGood = true;
    // this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
    //   next: () => {
    //     this.listGoods();
    //   },
    // });
    this.listGoods();
  }

  listGoods() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log('Params Filter-> ', params);
    this.loading = true;
    this.goodprocessService.getAvailableGoods(params).subscribe({
      next: response => {
        console.log('getAvailableGoods-> ', response);
        for (let i = 0; i < response.data.length; i++) {
          if (response.data != null && response.data != undefined) {
            console.log('ingresa data -> ');
            let dataB = {
              noBien: response.data[i].noBien,
              description: response.data[i].description,
              cantidad: response.data[i].cantidad,
              noExpediente: response.data[i].noExpediente,
              unidad: response.data[i].unidad,
              sssubtipo: response.data[i].sssubtipo,
              delAdministra: response.data[i].delAdministra,
              almacen: response.data[i].almacen,
              estatus: response.data[i].estatus,
            };
            console.log('data ', dataB);
            this.goods.push(dataB);
            this.data.load(this.goods);
            this.data.refresh();
            this.totalItems = response.count;
            this.loading = false;
          }
        }
      },
      error: err => {
        this.loading = false;
      },
    });
    /*this.goodServ.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log('RespListGoods -> ', response);
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i] != null && response.data[i] != undefined) {
            let dataB = {
              goodId: response.data[i].goodId,
              description: response.data[i].description,
              quantity: response.data[i].quantity,
              associatedFileNumber: response.data[i].associatedFileNumber,
              unit: response.data[i].unit,
              sssubType: response.data[i].subTypeId,
              //delAdmin: ,
              storeNumber: response.data[i].storeNumber,
            };
          }
        }
        //this.goods.push(dataB);
        this.data.load(this.goods);
        this.data.refresh();
        console.log(response);
      },
      error: () => {
        this.loading = false;
        this.loadingGood = false;
      },
    });*/
  }

  resetForm() {
    this.form.reset();
    this.form.get('authorizeCve').disable();
    this.form.get('authorizeDate').disable();
    this.form.get('authorizeType').disable();
    this.form.get('authorizeType').patchValue('T');
  }

  openModal(context?: Partial<ListDonationComponent>) {
    let config: ModalOptions = {
      initialState: {
        ...context,
        callback: (next: boolean, data: any) => {
          if (next) {
            this.form.patchValue(data);
            if (data.requestId) {
              this.form.get('requestId').patchValue(data.requestId.id);
            }
            if (data.doneeId) {
              this.form.get('doneeId').patchValue(data.doneeId.id);
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListDonationComponent, config);
  }

  async loadFromGoods() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    // const selfState = await this.eventPreparationService.getState();
    // this.eventPreparationService.updateState({
    //   ...selfState,
    //   eventForm: this.eventForm,
    //   lastLot: Number(this.lotSelected.id) ?? -1,
    //   lastPublicLot: this.lotSelected.publicLot ?? 1,
    //   executionType: this.onlyBase ? 'base' : 'normal',
    // });

    localStorage.setItem('rastreador', '2');
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FDONAC_DIRECT',
      },
    });
  }

  selectRows(rows: any[]) {
    console.log('row ', rows);
    if (rows.length > 0) {
      this.selectedRows = rows;
      console.log('Rows Selected->', this.selectedRows);
      console.log('SelectRows', this.selectedRows[0].noBien);
      this.flag = true;
    } else {
      this.flag = false;
      this.selectedRows = [];
    }
  }

  generateRequest() {
    if (this.form.get('doneeId').value == null) {
      this.alert(
        'warning',
        '',
        'No se Puede Generar la Solicitud sin Bienes Seleccionados, ni Donatario Especificado.'
      );
    } else {
      //Falta por integrar
      this.ActualizacionInventario();
    }
  }

  ActualizacionInventario() {}
}
