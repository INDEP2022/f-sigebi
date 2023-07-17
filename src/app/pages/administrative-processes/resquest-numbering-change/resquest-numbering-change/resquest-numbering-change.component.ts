import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodSpentService } from 'src/app/core/services/ms-expense/good-expense.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
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
  styles: [
    `
      .row-verde {
        background-color: green;
        font-weight: bold;
      }

      .row-negro {
        background-color: black;
        font-weight: bold;
      }
    `,
  ],
})
export class ResquestNumberingChangeComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  totalItems1: number = 0;
  totalItems2: number = 0;
  columnFilters: any = [];
  people$: Observable<any[]>;
  selectedPeople: any = [];

  esta: string;
  es: string;

  //params = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());

  itemsBoveda = new DefaultSelect();
  itemsDelegation = new DefaultSelect();
  itemsUser = new DefaultSelect();
  itemsUser1 = new DefaultSelect();
  itemName = new DefaultSelect();
  itemsAlmacen = new DefaultSelect();
  columnFilters4: any = [];
  idSolicitud: string = '';
  selectGood: any = [];
  selectCamNum: any = [];
  dataCamNum: any = [];
  dataGood: any = [];
  validate: boolean = false;
  selectedCars = [3];
  rowClass: string = 'verde';

  params4 = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  data3: LocalDataSource = new LocalDataSource();
  tiposData = new DefaultSelect();
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  loadingText = 'Cargando ...';
  @Input() formControlName: string = 'folioEscaneo';

  //Data Table

  //Data Table final
  settings2 = {
    ...this.settings,
    actions: false,
    columns: {
      numberGood: {
        title: 'Concepto',
        width: '10%',
        sort: false,
      },
      Subtipo: {
        title: 'Descripción',
        width: '30%',
        sort: false,
      },
      Ssubtipo: {
        title: 'Fecha',
        width: '30%',
        sort: false,
      },
      Sssubtipo: {
        title: 'Monto',
        width: '30%',
        sort: false,
      },
      SSSS: {
        title: 'Dir/Ind',
        width: '30%',
        sort: false,
      },
    },
  };
  settings1 = {
    ...this.settings,
    actions: false,
    hideSubHeader: false,
    columns: {
      goodNumber: {
        title: 'No. Bien',
        width: '10%',
        sort: false,
      },
      situationlegal: {
        title: 'Situación Jurídica',
        width: '30%',
        sort: false,
      },
      reasonApplication: {
        title: 'Motivo',
        width: '30%',
        sort: false,
      },
    },
  };

  // data3: ExampleData1[] = [
  //   {
  //     nuberGood: 1,
  //     legalstatus: 'Situacion juridica 1',
  //     reason: 'Motivo 1',
  //   },
  // ];

  //Reactive Forms
  form: FormGroup;
  authorizeDate: any;

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
  get type() {
    return this.form.get('type');
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
    private readonly goodServices: GoodService,
    private expenseService: GoodSpentService,
    private modalRef: BsModalRef,
    private numeraryService: NumeraryService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private securityService: SecurityService
  ) {
    super();
    this.esta = '';
    this.es = '';
    this.settings = {
      ...this.settings,
      rowClassFunction: (row: any) => {
        if (row.data.di_disponible == 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }

        // if (row.data.status === 'CNE') {
        //   return 'bg-success text-white';
        // } else if (
        //   row.data.status === 'RRE' ||
        //   row.data.status === 'VXR' ||
        //   row.data.status === 'DON'
        // ) {
        //   return 'bg-dark text-white';
        // } else {
        //   return 'bg-success text-white';
        // }
      },

      actions: {
        columnTitle: 'Visualizar',
        position: 'right',
        delete: false,
      },
      edit: {
        editButtonContent: '<i class="fa fa-eye text-white mx-2"></i>',
      },
      columns: {
        id: {
          title: 'No. Bien',
          width: '10%',
          sort: false,
        },
        description: {
          title: 'Descripción',
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
          title: 'Avalúo Vigente',
          width: '10%',
          sort: false,
        },
        armor: {
          title: 'Monto',
          width: '10%',
          sort: false,
        },
        totalExpenses: {
          title: 'Total Gastos',
          width: '20%',
          sort: false,
        },
        expedienteid: {
          title: 'Número de Expediente',
          width: '10%',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            if (row.expediente == null) {
              return '';
            } else {
              return row.expediente.id;
            }
          },
        },

        expedientepreliminaryInquiry: {
          title: 'Averiguación Previa',
          width: '10%',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            if (row.expediente == null) {
              return '';
            } else {
              return row.expediente.preliminaryInquiry;
            }
          },
        },
        expedientecriminalCase: {
          title: 'Causa Penal',
          width: '40%',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            if (row.expediente == null) {
              return '';
            } else {
              return row.expediente.criminalCase;
            }
          },
        },
      },
    };
    this.settings.hideSubHeader = false;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
  }

  ngOnInit(): void {
    this.buildForm();
    this.buildFormaplicationData();
    this.getBoveda(new ListParams());
    this.getDelegations(new ListParams());
    this.getAlmacen(new ListParams());
    this.getTodos(new ListParams());
    this.getUsuario(new ListParams());
    this.getDataTable();
    if (this.modal?.isShown) {
    }
    //this.people$ = this.goodprocessService.getTodos();
  }
  clearModel() {
    this.selectedPeople = [];
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  /*validationScreen(id: any) {
    //row.data.id ? 'bg-dark text-white' : 'bg-success text-white'
    this.loading = true;
    const payload = {
      pNumberGood: id,
      vcScreen: 'FACTADBSOLCAMNUME',
    };
    this.goodprocessService.getScreenGood(payload).subscribe({
      next: async (response: any) => {
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      },
    });
    this.loading = false;
  }*/

  async validationScreen(id: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.goodprocessService.getScreenGood2(id).subscribe({
        next: async (response: any) => {
          if (response.data) {
            console.log('di_dispo', response);
            resolve('S');
          } else {
            console.log('di_dispo', response);
            resolve('N');
          }
        },
        error: () => {
          resolve('N');
        },
      });
    });
  }

  onLegalStatusChange() {
    const legalStatus = this.form.get('legalStatus').value;

    if (legalStatus === 'AS') {
      this.esta = 'ADM';
      this.es = `ESTATUS = ${this.esta}`;
    } else if (legalStatus === 'DE') {
      this.esta = 'DEA,AXC';
      this.es = `ESTATUS IN (${this.esta})`;
    } else if (legalStatus === 'AB') {
      this.esta = 'CND,CNA';
      this.es = `ESTATUS IN (${this.esta})`;
    }
  }

  showReceipt(event: any) {
    this.modal.show();
    this.loading = true;

    this.expenseService.getGoodCosto(event.id).subscribe(
      (response: any) => {
        this.totalItems2 = response.count;
        this.data2.load(response.data);
        this.data2.refresh();
        this.loading = false;
      },
      error => (console.log('ERR', error), (this.loading = false))
    );
  }
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
      console.log('AQUI', params);
    }
    this.delegationService.getAllPaginated(params).subscribe((data: any) => {
      this.itemsDelegation = new DefaultSelect(data.data, data.count);
      console.log('AQUI', this.itemsDelegation);
      console.log('AQUI', data);
    });
  }

  public searchUsuario(data: any) {
    console.log(data);

    const params = new ListParams();
    params['filter.usuario'] = data.usuario;
    console.log(data.usuario);
    this.securityService.getAllUser(params).subscribe({
      next: (types: any) => {
        this.itemsUser = new DefaultSelect(types.data, types.count);
        console.log(types);
        this.formaplicationData.controls['postUserRequestCamnum'].setValue(
          types.data[0].otvalor
        );
        this.formaplicationData.controls['delegationRequestcamnum'].setValue(
          types.data[0].no_delegacion
        );
      },
    });
  }

  public searchUsuario1(dat: any) {
    console.log(dat);

    const params1 = new ListParams();
    params1['filter.usuario'] = dat.usuario;
    console.log(dat.usuario);
    this.securityService.getAllUser(params1).subscribe({
      next: (type: any) => {
        this.itemsUser1 = new DefaultSelect(type.data, type.count);
        console.log(type);
        this.formaplicationData.controls['authorizePostUser'].setValue(
          type.data[0].otvalor
        );
        this.formaplicationData.controls['authorizeDelegation'].setValue(
          type.data[0].no_delegacion
        );
      },
    });
  }

  getUsuario(params: ListParams, usuario?: string) {
    if (usuario) {
      params['filter.usuario'] = `$in:${usuario}`;
    }

    this.securityService.getAllUser(params).subscribe((data: any) => {
      const res: any = data.data.map((user: any) => {
        return user.usuario;
      });

      this.itemsUser = new DefaultSelect(res, data.count);
      console.log(this.itemsUser);
      console.log(data);
      //this.formaplicationData.controls['postUserRequestCamnum'].setValue(data.itemsUser.name);
      // Llamar a getNameUser solo si se proporcionó un usuario
    });
  }

  getUsuario1(params1: ListParams, usuario?: string) {
    if (usuario) {
      params1['filter.usuario'] = `$in:${usuario}`;
    }

    this.securityService.getAllUser(params1).subscribe((dat: any) => {
      const res: any = dat.data.map((userT: any) => {
        return userT.usuario;
      });

      this.itemsUser1 = new DefaultSelect(res, dat.count);
      console.log(this.itemsUser1);
      console.log(dat);
      //this.formaplicationData.controls['postUserRequestCamnum'].setValue(data.itemsUser.name);
      // Llamar a getNameUser solo si se proporcionó un usuario
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

  onOptionsSelected(options: any[]) {
    console.log('Opciones seleccionadas:', options);
  }

  getDataTable() {
    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
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
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataTableDos());
  }

  getDataTableDos() {
    //this.loading = true;
    this.dataGood = [];

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (this.form.get('type').value !== null)
      params['filter.goodClassNumber'] = `$eq:${this.form.get('type').value}`;
    console.log(params);
    const legalStatus = this.form.get('legalStatus').value;

    let estados: string[] = [];

    if (legalStatus === 'AS') {
      estados = ['ADM'];
    } else if (legalStatus === 'DE') {
      estados = ['DEA', 'AXC'];
    } else if (legalStatus === 'AB') {
      estados = ['CND', 'CNA'];
    }
    if (this.form.get('warehouse').value !== null)
      params['filter.storeNumber'] = `$eq:${this.form.get('warehouse').value}`;

    if (this.form.get('vault').value !== null)
      params['filter.vaultNumber'] = `$eq:${this.form.get('vault').value}`;

    if (this.form.get('delegation').value !== null)
      params['filter.delegationNumber'] = `$eq:${
        this.form.get('delegation').value
      }`;

    if (estados.length > 0) {
      params['filter.status'] = `$in:${estados.join(',')}`;
    } else {
      params['filter.status'] = '';
    }
    let alertShown = false;
    if (this.form.get('type').value != null)
      this.goodServices.getByExpedientAndParams__(params).subscribe({
        next: async (response: any) => {
          this.alert(
            'info',
            'Se mostraran los datos en la tabla BIENES X TIPO',
            ''
          );
          let result = response.data.map(async (item: any) => {
            let obj = {
              vcScreen: 'FACTADBSOLCAMNUME',
              goodNumber: item.id,
            };
            const di_dispo = await this.validationScreen(obj);
            item['di_disponible'] = di_dispo;

            // const acta = await this.getActaGood(item);
            //console.log('acta', acta);
            //item['acta'] = acta;
            //item.di_disponible = acta != null ? 'N' : di_dispo;
          });

          console.log('asaddasdasdasd', response.data);
          this.dataGood = response.data;
          this.totalItems = response.count;
          this.data.load(response.data);
          this.data.refresh();
          this.loading = false;
        },
        error: err => {
          console.log('error', err);
          if (!alertShown) {
            this.alert('error', 'No se Encontraron Registros', '');
            alertShown = true; // Marcar el flag como true después de mostrar el mensaje
          }
        },
      });
    //this.loading = false;
  }
  getDataTableNum() {
    this.totalItems1 = 0;
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'goodNumber':
                searchFilter = SearchFilter.EQ;
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
          this.params1 = this.pageFilter(this.params1);
          this.getDataTableNumDos();
        }
      });
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataTableNumDos());
  }

  getDataTableNumDos() {
    this.dataCamNum = [];
    this.loading = true;
    let params1 = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params1['filter.applicationChangeCashNumber'] = `$eq:${this.idSolicitud}`;
    this.numeraryService.getSolCamNum(params1).subscribe({
      next: async (response: any) => {
        this.dataCamNum = response.data;
        this.totalItems1 = response.count;
        this.data1.load(response.data);
        this.data1.refresh();
        this.loading = false;
      },
      error: err => {
        console.log('ERROR', err);
        this.alert('error', 'No se Encontraron Registros', '');
        this.loading = false;
      },
    });
    this.loading = false;
  }
  cerrarModal() {
    this.modal.hide();
  }
  selectData(event: any) {
    console.log('AQUI SELECT', event);
    this.selectGood = [];
    this.selectGood.push(event);
  }
  selectDataCamNum(event: any) {
    this.selectCamNum = [];
    this.selectCamNum.push(event);
  }

  pasar() {
    var situacionJuridica = '';
    var motivo = null;
    if (this.selectGood.length != 0) {
      this.validation(0);
      if (this.validate) {
        return;
      }
      if (this.selectGood[0].status == 'ADM') {
        situacionJuridica = 'ASEGURADO';
      }
      if (
        this.selectGood[0].status == 'DEA' ||
        this.selectGood[0].status == 'AXC'
      ) {
        situacionJuridica = 'DECOMISADO';
        motivo = 'BIEN DECOMISADO';
      }
      if (
        this.selectGood[0].status == 'CND' ||
        this.selectGood[0].status == 'CNA'
        //this.selectGood[0].status == 'ADE'
      ) {
        situacionJuridica = 'ABANDONADO';
        motivo = 'BIEN ABANDONADO';
      }
      if (
        this.selectGood[0].goodClassNumber == '316' ||
        this.selectGood[0].goodClassNumber == '317' ||
        this.selectGood[0].goodClassNumber == '1025' ||
        this.selectGood[0].goodClassNumber == '1038'
      ) {
        motivo = 'ASEGURADO PERECEDERO';
      }
      if (
        this.selectGood[0].goodClassNumber == '319' ||
        this.selectGood[0].goodClassNumber == '1078'
      ) {
        motivo = 'ASEGURADO SEMOVIENTE';
      }
      const payload = {
        goodNumber: this.selectGood[0].id,
        applicationChangeCashNumber: this.idSolicitud,
        ProceedingsNumber: this.selectGood[0].fileNumber,
        situationlegal: situacionJuridica,
        reasonApplication: motivo,
      };
      console.log('PAYLOAD', payload);
      this.loading = true;
      this.numeraryService.createSolCamNum(payload).subscribe({
        next: async (response: any) => {
          this.successAlert();
          this.getDataTableNum();
        },
        error: err => {
          this.loading = false;
          this.warningAlert('No se Creo el Registro');
        },
      });
    } else {
      this.warningAlert('Debe seleccionar un Registro en la tabla Bien x Tipo');
    }
  }
  pasarTodo() {
    var situacionJuridica = '';
    var motivo = null;
    if (this.dataGood.length != 0) {
      this.validation(1);
      if (this.validate) {
        return;
      }
      for (let index = 0; index < this.dataGood.length; index++) {
        const element = this.dataGood[index];
        if (this.dataGood[index].status == 'ADM') {
          situacionJuridica = 'ASEGURADO';
        }
        if (
          this.dataGood[index].status == 'DEA' ||
          this.dataGood[index].status == 'AXC'
        ) {
          situacionJuridica = 'DECOMISADO';
          motivo = 'BIEN DECOMISADO';
        }
        if (
          this.dataGood[index].status == 'CND' ||
          this.dataGood[index].status == 'CNA'
        ) {
          situacionJuridica = 'ABANDONADO';
          motivo = 'BIEN ABANDONADO';
        }
        if (
          this.dataGood[index].goodClassNumber == '316' ||
          this.dataGood[index].goodClassNumber == '317' ||
          this.dataGood[index].goodClassNumber == '1025' ||
          this.dataGood[index].goodClassNumber == '1038'
        ) {
          motivo = 'ASEGURADO PERECEDERO';
        }
        if (
          this.dataGood[index].goodClassNumber == '319' ||
          this.dataGood[index].goodClassNumber == '1078'
        ) {
          motivo = 'ASEGURADO SEMOVIENTE';
        }
        const payload = {
          goodNumber: this.dataGood[index].goodClassNumber,
          applicationChangeCashNumber: this.idSolicitud,
          ProceedingsNumber: this.dataGood[index].fileNumber,
          situationlegal: situacionJuridica,
          reasonApplication: motivo,
        };
        console.log('PAYLOAD', payload);
        this.loading = true;
        this.numeraryService.createSolCamNum(payload).subscribe({
          next: async (response: any) => {
            this.handleSuccess('Se creo correctamente');
            this.getDataTableNum();
            this.loading = false;
          },
          error: err => {
            this.loading = false;
            this.handleSuccess('No se Creo el Registro');
          },
        });
      }
    } else {
      this.warningAlert('No hay Registro en la tabla Bien x Tipo');
    }
  }
  quitarTodo() {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar todos los registros?'
    ).then(question => {
      if (question.isConfirmed) {
        if (this.dataCamNum.length != 0) {
          console.log(this.dataCamNum);
          this.loading = true;
          this.numeraryService
            .DeleteAllCamNum(this.dataCamNum[0].applicationChangeCashNumber)
            .subscribe({
              next: async (response: any) => {
                this.dataCamNum = [];
                this.data1.refresh();
                this.data1.load([]);
                this.totalItems1 = 0;
                this.alert('success', 'Registros Eliminados', '');

                this.loading = false;
              },
              error: err => {
                this.loading = false;
              },
            });
        } else {
          this.warningAlert('No hay registro en la tabla Bien Cam. Numerario');
        }
      }
    });
  }
  quitar() {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        if (this.selectCamNum.length != 0) {
          this.loading = true;
          this.numeraryService
            .DeleteOneCamNum(this.selectCamNum[0].goodNumber)
            .subscribe({
              next: async (response: any) => {
                this.getDataTableNum();
                this.deleteAlert();
                this.loading = false;
              },
              error: err => {
                this.loading = false;
              },
            });
        } else {
          this.warningAlert(
            'Debe seleccionar un registro en la tabla Bien Cam. Numerario'
          );
        }
      }
    });
  }
  handleSuccess(message: any) {
    if (message == 'Se creo correctamente') {
      this.alert('success', `${message}`, '');
    } else {
      this.alert('warning', `${message}`, '');
    }
    // this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    //this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  validation(valor: any) {
    var message = '';
    // if (this.formaplicationData.get('dateRequest').value == null) {
    //   message = "El bien ya esta en una solicitud"
    //   this.handleSuccess(message)
    // }
    if (
      this.formaplicationData.get('dateRequestChangeNumerary').value == null
    ) {
      message = 'La Fecha de Solicitud no debe estar vacía';
      this.handleSuccess(message);
    }
    if (this.formaplicationData.get('userRequestChangeNumber').value == null) {
      message = 'El Usuario Solicitante no debe estar vacío';
      this.handleSuccess(message);
    }
    if (this.formaplicationData.get('procedureProposal').value == null) {
      message = 'Debe de seleccionar el campo Procedimiento Propuesto';
      this.handleSuccess(message);
    }
    if (this.formaplicationData.get('delegationRequestcamnum').value == null) {
      message = 'El Cargo del Usuario no debe estar vacío';
      this.handleSuccess(message);
    }
    if (this.formaplicationData.get('authorizeUser').value == null) {
      message = 'El campo Usuario Autoriza no debe estar vacío';
      this.handleSuccess(message);
    }
    if (this.formaplicationData.get('authorizeDate').value == null) {
      message = 'La Fecha de Autorización no debe estar vacía';
      this.handleSuccess(message);
    }

    for (let index = 0; index < this.dataGood.length; index++) {
      if (valor == 0) {
        if (this.dataGood[index].appraisedValue == null) {
          console.log('ENTRO AQUI');
          message =
            'El bien NO tiene valor avalúo, verifique el punto 2.1 del manual de procedimientos para enajenación';
          this.handleSuccess(message);
        }

        console.log(this.dataGood[index].expediente);
        if (this.dataGood[index].expediente.id == null) {
          console.log(this.dataGood[index].expediente.id);
          message =
            'El bien NO tiene Número de Expediente' +
            this.dataGood[index].expediente.id;
          this.handleSuccess(message);
        }

        if (
          this.dataGood[index].expediente.preliminaryInquiry &&
          this.dataGood[index].expediente.preliminaryInquiry === ''
        ) {
          message = 'El bien NO tiene averiguación previa';
          this.handleSuccess(message);
        }
      }

      if (valor == 1) {
        if (this.dataGood[index].appraisedValue == null) {
          message =
            'El bien NO tiene valor avalúo, verifique el punto 2.1 del manual de procedimientos para enajenación';
          this.handleSuccess(message);
        }

        if (this.dataGood[index].expediente.id == null) {
          message = 'El bien NO tiene Número de Expediente';
          this.handleSuccess(message);
        }
      }
    }
    if (message != '') {
      this.validate = true;
      return;
    }
  }

  guardarSolicitud() {
    this.loading = true;
    // Obtener la fecha actual
    const currentDate = new Date(); // Obtener la fecha actual

    // Obtener la fecha seleccionada en el formulario
    const fechaSeleccionada = this.formaplicationData.get(
      'dateRequestChangeNumerary'
    ).value;

    // Comparar la fecha seleccionada con la fecha actual
    if (fechaSeleccionada.toDateString() !== currentDate.toDateString()) {
      // Si la fecha seleccionada no es la de hoy, mostrar un mensaje de error o realizar la acción que desees.
      console.log('La fecha seleccionada debe ser la de hoy.');
      this.loading = false;
      return;
    }

    // Si la fecha seleccionada es la de hoy, continuar con el proceso de guardado
    this.formaplicationData
      .get('dateRequestChangeNumerary')
      .setValue(currentDate);
    this.formaplicationData.get('applicationChangeCashNumber').setValue(null);
    this.numeraryService
      .createChangeNumerary(this.formaplicationData.getRawValue())
      .subscribe({
        next: async (response: any) => {
          this.idSolicitud = response.applicationChangeNumeraryNumber;
          this.formaplicationData
            .get('applicationChangeCashNumber')
            .setValue(response.applicationChangeNumeraryNumber);
          this.successAlert();
          this.loading = false;
          console.log(response);
        },
        error: err => {
          this.loading = false;
          console.log(err);
        },
      });
  }

  search() {
    this.loading = true;
    this.idSolicitud = this.formaplicationData.get(
      'applicationChangeCashNumber'
    ).value;
    this.getDataTableNum();
    this.numeraryService.getSolById(this.idSolicitud).subscribe({
      next: async (response: any) => {
        //'userRequestChangeNumber',
        const readonlyFields = [
          'dateRequestChangeNumerary',
          'applicationChangeCashNumber',
          'userRequestChangeNumber',
          'postUserRequestCamnum',
          'delegationRequestcamnum',
          'procedureProposal',
          'authorizeUser',
          'authorizePostUser',
          'authorizeDelegation',
          'authorizeDate',
        ];

        response.dateRequestChangeNumerary = new Date(
          response.dateRequestChangeNumerary + 'T00:00:00'
        );

        response.authorizeDate = new Date(response.authorizeDate + 'T00:00:00');

        // Formatear las fechas
        // Verificar y formatear los campos de fecha solo si son válido

        this.formaplicationData.patchValue(response);
        console.log('RES', this.formaplicationData.value);
        // Establecer los campos específicos como de solo lectura
        readonlyFields.forEach(fieldName => {
          this.formaplicationData.get(fieldName).disable();
        });

        //this.loading = false;

        this.loading = false;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  clean() {
    this.formaplicationData.get('dateRequestChangeNumerary').setValue(null);
    this.formaplicationData.get('applicationChangeCashNumber').setValue(null);
    this.formaplicationData.get('userRequestChangeNumber').setValue(null);
    this.formaplicationData.get('postUserRequestCamnum').setValue(null);
    this.formaplicationData.get('delegationRequestcamnum').setValue(null);
    this.formaplicationData.get('procedureProposal').setValue(null);
    this.formaplicationData.get('authorizeUser').setValue(null);
    this.formaplicationData.get('authorizePostUser').setValue(null);
    this.formaplicationData.get('authorizeDelegation').setValue(null);
    this.formaplicationData.get('authorizeDate').setValue(null);
    Object.keys(this.formaplicationData.controls).forEach(controlName => {
      this.formaplicationData.get(controlName).enable();
    }),
      (this.totalItems1 = 0);
    this.data1.load([]);
    this.data1.refresh();
  }
  //data3
  cleanFilter() {
    this.form.get('legalStatus').setValue(null);
    this.form.get('type').setValue(null);
    this.form.get('delegation').setValue(null);
    this.form.get('warehouse').setValue(null);
    this.form.get('vault').setValue(null);
    Object.keys(this.form.controls).forEach(controlName => {
      this.form.get(controlName).enable();
    }),
      (this.totalItems1 = 0);
    this.data.load([]);
    this.data.refresh();
    this.data3.load([]);
    this.data3.refresh();
  }

  printScanFile() {
    // if (this.form.get(this.formControlName).value != null) {
    const params = {
      PARAMFORM: 'NO',
      SOLICITUD: this.idSolicitud,
    };
    this.downloadReport('RRCAMBIONUMERARIO', params);
    //}
    // else {
    //   this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
    // }
  }

  downloadReport(reportName: string, params: any) {
    this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }

  warningAlert(message: any) {
    this.alert('warning', message, '');
  }
  successAlert() {
    this.alert('success', 'Registro Guardado', '');
  }

  deleteAlert() {
    this.alert('success', 'Registro Eliminado', '');
  }
  /////////////////////

  private buildForm() {
    this.form = this.fb.group({
      legalStatus: [null, Validators.required],
      delegation: [null],
      warehouse: [null],
      vault: [null],
      type: [null, Validators.required],
    });
  }

  private buildFormaplicationData() {
    this.formaplicationData = this.fb.group({
      dateRequestChangeNumerary: [null, [Validators.required]],
      applicationChangeCashNumber: [null],
      userRequestChangeNumber: [null, [Validators.required]],
      postUserRequestCamnum: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegationRequestcamnum: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
        ],
      ],
      procedureProposal: [null, [Validators.required]],
      authorizeUser: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      authorizePostUser: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      authorizeDelegation: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
        ],
      ],
      authorizeDate: [null, [Validators.required]],
    });
    this.formaplicationData.controls['postUserRequestCamnum'].disable();
    this.formaplicationData.controls['delegationRequestcamnum'].disable();
    this.formaplicationData.controls['authorizeDelegation'].disable();
    this.formaplicationData.controls['authorizePostUser'].disable();
    setTimeout(() => {
      this.getUsuario(new ListParams());
      this.getUsuario1(new ListParams());
    }, 1000);

    this.formaplicationData.controls;
    /*this.formaplicationData
      .get('dateRequestChangeNumerary')
      .valueChanges.subscribe((date: Date) => {
        if (date) {
          const formattedDate = moment(date).format('DD-MM-YYYY');
          this.formaplicationData.patchValue(
            { dateRequestChangeNumerary: formattedDate },
            { emitEvent: false }
          );
        }
      });

    /*this.formaplicationData
      .get('authorizeDate')
      .valueChanges.subscribe((date: Date) => {
        if (date) {
          const formattedDate = moment(date).format('DD-MM-YYYY');
          this.formaplicationData.patchValue(
            { authorizeDate: formattedDate },
            { emitEvent: false }
          );
        }
      });*/
  }
  opcionSeleccionada: any[] = [];

  dropdownSettings = {
    // Configuración del dropdown
    singleSelection: false, // Permitir selección múltiple
    idField: 'id', // Nombre del campo que contiene el ID de cada opción
    textField: 'name', // Nombre del campo que contiene el texto de cada opción
    selectAllText: 'Seleccionar todo', // Texto para seleccionar todas las opciones
    unSelectAllText: 'Deseleccionar todo', // Texto para deseleccionar todas las opciones
    itemsShowLimit: 3, // Número máximo de opciones que se mostrarán antes de contraer la lista
    allowSearchFilter: true, // Permitir búsqueda de opciones
    closeDropDownOnSelection: false, // Mantener el dropdown abierto después de seleccionar una opción
    showSelectedItemsAtTop: true, // Mostrar las opciones seleccionadas en la parte superior
    noDataAvailablePlaceholderText: 'No hay datos disponibles',
  };
}
