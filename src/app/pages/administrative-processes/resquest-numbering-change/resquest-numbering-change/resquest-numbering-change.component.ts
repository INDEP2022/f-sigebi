import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

export interface Example {
  number: number;
  description: string;
}

export interface ExampleData {
  numberGood: number;
  description: string;
  quantity: number;
  status: string;
  appraisedVig: string;
  amount: number;
  totalExpenses: number;
  numberFile: string;
  preliminaryInquiry: string;
  causePenal: string;
}

export interface ExampleData1 {
  nuberGood: number;
  legalstatus: string;
  reason: string;
}

@Component({
  selector: 'app-resquest-numbering-change',
  templateUrl: './resquest-numbering-change.component.html',
  styles: [],
})
export class ResquestNumberingChangeComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  columnFilters: any = [];
  //params = new BehaviorSubject<ListParams>(new ListParams());
  params: any = new BehaviorSubject<ListParams>(new ListParams());

  itemsBoveda = new DefaultSelect();
  itemsDelegation = new DefaultSelect();
  itemsAlmacen = new DefaultSelect();
  columnFilters4: any = [];
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  tiposData = new DefaultSelect();

  //Data Table

  //Data Table final
  settings2 = {
    ...this.settings,
    actions: false,
    columns: {
      numberGood: {
        title: 'Tipo',
        width: '10%',
        sort: false,
      },
      Subtipo: {
        title: 'Subtipo',
        width: '30%',
        sort: false,
      },
      Ssubtipo: {
        title: 'Ssubtipo',
        width: '30%',
        sort: false,
      },
      Sssubtipo: {
        title: 'Sssubtipo',
        width: '30%',
        sort: false,
      },
    },
  };
  settings1 = {
    ...this.settings,
    columns: {
      numberGood: {
        title: 'No Bien',
        width: '10%',
        sort: false,
      },
      legalstatus: {
        title: 'Sit. Juridica',
        width: '30%',
        sort: false,
      },
      reason: {
        title: 'Motivo',
        width: '30%',
        sort: false,
      },
    },
  };

  data1: ExampleData1[] = [
    {
      nuberGood: 1,
      legalstatus: 'Situacion juridica 1',
      reason: 'Motivo 1',
    },
  ];

  // data: ExampleData[] = [
  //   {
  //     numberGood: 1,
  //     description: 'Descripcion 1',
  //     quantity: 2,
  //     status: 'Estatus 1',
  //     appraisedVig: 'Avaluó 1',
  //     amount: 1,
  //     totalExpenses: 245000,
  //     numberFile: 'Expediente 1',
  //     preliminaryInquiry: 'Averiguacion previa 1 ',
  //     causePenal: 'Causa Penal 1',
  //   },
  // ];
  //Array para las delegaciones
  delegationArray: Example[] = [
    {
      number: 1,
      description: 'Delegación numero 1',
    },
    {
      number: 2,
      description: 'Delegación numero 2',
    },
    {
      number: 3,
      description: 'Delegación numero 3',
    },
    {
      number: 4,
      description: 'Delegación numero 4',
    },
  ];
  //Array para los almacenes
  warehouseArray: Example[] = [
    {
      number: 1,
      description: 'Almacen numero 1',
    },
    {
      number: 2,
      description: 'Almacen numero 2',
    },
    {
      number: 3,
      description: 'Almacen numero 3',
    },
    {
      number: 4,
      description: 'Almacen numero 4',
    },
  ];
  //Array para los bovedas
  vaultArray: Example[] = [
    {
      number: 1,
      description: 'Bóveda numero 1',
    },
    {
      number: 2,
      description: 'Bóveda numero 2',
    },
    {
      number: 3,
      description: 'Bóveda numero 3',
    },
    {
      number: 4,
      description: 'Bóveda numero 4',
    },
  ];

  //Reactive Forms
  form: FormGroup;

  get legalStatus() {
    return this.form.get('legalStatus');
  }
  get delegation() {
    return this.form.get('delegation');
  }
  get warehouse() {
    return this.form.get('warehouse');
  }
  get vault() {
    return this.form.get('vault');
  }

  //Reactive Forms
  formaplicationData: FormGroup;
  get dateRequest() {
    return this.formaplicationData.get('dateRequest');
  }
  get numberRequest() {
    return this.formaplicationData.get('numberRequest');
  }
  get usrRequest() {
    return this.formaplicationData.get('usrRequest');
  }
  get nameRequest() {
    return this.formaplicationData.get('nameRequest');
  }
  get charge() {
    return this.formaplicationData.get('charge');
  }
  get proposedProcedure() {
    return this.formaplicationData.get('proposedProcedure');
  }
  get usrAuthorized() {
    return this.formaplicationData.get('usrAuthorized');
  }
  get nameAuthorized() {
    return this.formaplicationData.get('nameAuthorized');
  }
  get causeAuthorized() {
    return this.formaplicationData.get('causeAuthorized');
  }
  get dateAutorized() {
    return this.formaplicationData.get('dateAutorized');
  }

  constructor(
    private fb: FormBuilder,
    private safeService: SafeService,
    private delegationService: DelegationService,
    private warehouseService: WarehouseService,
    private goodprocessService: GoodprocessService,
    private readonly goodServices: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        id: {
          title: 'No Bien',
          width: '10%',
          sort: false,
        },
        description: {
          title: 'description',
          width: '30%',
          sort: false,
        },
        quantity: {
          title: 'Cantidad',
          width: '10%',
          sort: false,
        },
        status: {
          title: 'Estatus',
          width: '10%',
          sort: false,
        },
        appraisedValue: {
          title: 'Avaluó Vig',
          width: '10%',
          sort: false,
        },
        armor: {
          title: 'Mon.',
          width: '10%',
          sort: false,
        },
        totalExpenses: {
          title: 'Total Gastos',
          width: '20%',
          sort: false,
        },
        'expediente.id': {
          title: 'No Exp.',
          width: '10%',
          sort: false,
          valuePrepareFunction: (
            cell: any,
            row: { expediente: { id: any } }
          ) => {
            return row.expediente.id;
          },
        },

        'expediente.preliminaryInquiry': {
          title: 'Averiguacion prev.',
          width: '10%',
          sort: false,
          valuePrepareFunction: (
            cell: any,
            row: { expediente: { preliminaryInquiry: any } }
          ) => {
            return row.expediente.preliminaryInquiry;
          },
        },
        'expediente.criminalCase': {
          title: 'Causa Penal',
          width: '40%',
          sort: false,
          valuePrepareFunction: (
            cell: any,
            row: { expediente: { criminalCase: any } }
          ) => {
            return row.expediente.criminalCase;
          },
        },
      },
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.buildFormaplicationData();
    this.getBoveda(new ListParams());
    this.getDelegations(new ListParams());
    this.getAlmacen(new ListParams());
    this.getTodos(new ListParams());
    this.getDataTable();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  getBoveda(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.safeService.getAll(params).subscribe((data: any) => {
      this.itemsBoveda = new DefaultSelect(data.data, data.count);
    });
  }
  getDelegations(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.delegationService.getAllPaginated(params).subscribe((data: any) => {
      this.itemsDelegation = new DefaultSelect(data.data, data.count);
    });
  }
  getAlmacen(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.warehouseService.getAll(params).subscribe((data: any) => {
      this.itemsAlmacen = new DefaultSelect(data.data, data.count);
    });
  }
  getTodos(params: ListParams, id?: string) {
    this.loading = true;

    this.goodprocessService.getGoodType(params).subscribe(
      (response: any) => {
        console.log('AQUI', response);
        let result = response.data.map(async (item: any) => {
          item['tipoSupbtipoDescription'] =
            item.typeDesc +
            ' - ' +
            item.subTypeDesc +
            ' - ' +
            item.ssubTypeDesc +
            ' - ' +
            item.sssubTypeDesc;
        });
        Promise.all(result).then((resp: any) => {
          this.tiposData = new DefaultSelect(response.data, response.count);
          this.loading = false;
        });
      },
      error => (console.log('ERR', error), (this.loading = false))
    );
  }

  getDataTable() {
    let params = {
      ...this.params.getValue(),
    };
    params['filter.fileNumber'] = `272`;
    params['filter.status'] = `$in:ADM,DXV,PRP,CPV,DEP`;
    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: async (response: any) => {
        console.log('GOODS OBTENIDOS', response);

        //this.paragraphs = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: err => {},
    });
    this.loading = false;
  }
  /////////////////////

  private buildForm() {
    this.form = this.fb.group({
      legalStatus: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      warehouse: [null, [Validators.required]],
      vault: [null, [Validators.required]],
    });
  }

  private buildFormaplicationData() {
    this.formaplicationData = this.fb.group({
      dateRequest: [null, [Validators.required]],
      numberRequest: [null, [Validators.required]],
      usrRequest: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      nameRequest: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      proposedProcedure: [null, [Validators.required]],
      usrAuthorized: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      nameAuthorized: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causeAuthorized: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dateAutorized: [null, [Validators.required]],
    });
  }
}
