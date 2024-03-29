import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
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
  totalItems1: number = 0;
  totalItems2: number = 0;
  columnFilters: any = [];
  //params = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());

  itemsBoveda = new DefaultSelect();
  itemsDelegation = new DefaultSelect();
  itemsAlmacen = new DefaultSelect();
  columnFilters4: any = [];
  idSolicitud: string = '';
  selectGood: any = [];
  selectCamNum: any = [];
  dataCamNum: any = [];
  dataGood: any = [];
  validate: boolean = false;
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
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
        title: 'No Bien',
        width: '10%',
        sort: false,
      },
      situationlegal: {
        title: 'Sit. Juridica',
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
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...this.settings,
      rowClassFunction: (row: { data: { id: any } }) =>
        row.data.id ? 'bg-dark text-white' : 'bg-success text-white',

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
    this.getDataTable();
    if (this.modal?.isShown) {
    }
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  showReceipt(event: any) {
    this.modal.show();
    console.log('YAaaaaaaaaaaaaaaaaaaaaaaaa', event);
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
          this.getDataTableDos();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataTableDos());
  }

  getDataTableDos() {
    this.loading = true;
    this.dataGood = [];
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    //params['filter.goodClassNumber'] = `$eq:1115`;
    params['filter.goodClassNumber'] = `$eq:${this.form.get('type').value}`;
    params['filter.status'] = `$in:${this.form.get('legalStatus').value}`;
    params['filter.storeNumber'] = `$eq:${this.form.get('warehouse').value}`;
    params['filter.vaultNumber'] = `$eq:${this.form.get('vault').value}`;
    params['filter.delegationNumber'] = `$eq:${
      this.form.get('delegation').value
    }`;
    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: async (response: any) => {
        this.dataGood = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: err => {},
    });
    this.loading = false;
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
        this.totalItems1 = 0;
        this.data1.load([]);
        this.data1.refresh();
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
      ) {
        situacionJuridica = 'ABANDONADO';
        motivo = 'BIEN ABANDONADO';
      }
      if (
        this.selectGood[0].id == '316' ||
        this.selectGood[0].id == '317' ||
        this.selectGood[0].id == '1025' ||
        this.selectGood[0].id == '1038'
      ) {
        motivo = 'ASEGURADO PERECEDERO';
      }
      if (this.selectGood[0].id == '319' || this.selectGood[0].id == '1078') {
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
          this.warningAlert('No se creo el registro');
        },
      });
    } else {
      this.warningAlert(
        'Debe seleccionar un registro en la tabla Bien por tipo'
      );
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
          this.dataGood[index].id == '316' ||
          this.dataGood[index].id == '317' ||
          this.dataGood[index].id == '1025' ||
          this.dataGood[index].id == '1038'
        ) {
          motivo = 'ASEGURADO PERECEDERO';
        }
        if (
          this.dataGood[index].id == '319' ||
          this.dataGood[index].id == '1078'
        ) {
          motivo = 'ASEGURADO SEMOVIENTE';
        }
        const payload = {
          goodNumber: this.dataGood[index].id,
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
            this.handleSuccess('No se creo el registro');
          },
        });
      }
    } else {
      this.warningAlert('No hay registro en la tabla Bien por tipo');
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
          this.loading = true;
          this.numeraryService
            .DeleteAllCamNum(this.dataCamNum[0].applicationChangeCashNumber)
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
      this.onLoadToast('success', `${message}`);
    } else {
      this.onLoadToast('warning', `${message}`);
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
      message = 'La Fecha de Solicitud no debe estar vacia';
      this.handleSuccess(message);
    }
    if (this.formaplicationData.get('userRequestChangeNumber').value == null) {
      message = 'El Usuario Solicitante no debe estar vacio';
      this.handleSuccess(message);
    }
    if (this.formaplicationData.get('procedureProposal').value == null) {
      message = 'El Procedimiento Propuesta no debe estar vacio';
      this.handleSuccess(message);
    }
    if (this.formaplicationData.get('delegationRequestcamnum').value == null) {
      message = 'El Cargo del Usuario no debe estar vacio';
      this.handleSuccess(message);
    }
    if (this.formaplicationData.get('authorizeUser').value == null) {
      message = 'El Usuario Autoriza no debe estar vacio';
      this.handleSuccess(message);
    }
    if (this.formaplicationData.get('authorizeDate').value == null) {
      message = 'La Fecha de Autorizacion no debe estar vacio';
      this.handleSuccess(message);
    }
    if (valor == 0) {
      if (this.dataGood[0].appraisedValue == null) {
        console.log('ENTRO AQUI');
        message =
          'El bien NO tiene valor avalúo, verifique el punto 2.1 del manual de procedimientos para enejenación';
        this.handleSuccess(message);
      }
    }

    if (valor == 1) {
      for (let index = 0; index < this.dataGood.length; index++) {
        if (this.dataGood[index].appraisedValue == null) {
          message =
            'El bien NO tiene valor avalúo, verifique el punto 2.1 del manual de procedimientos para enejenación';
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
        },
        error: err => {
          this.loading = false;
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
        this.formaplicationData.patchValue(response);
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
    this.totalItems1 = 0;
    this.data1.load([]);
    this.data1.refresh();
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
    this.alert('success', 'Registro guardado', '');
  }

  deleteAlert() {
    this.alert('success', 'Registro Eliminado', '');
  }
  /////////////////////

  private buildForm() {
    this.form = this.fb.group({
      legalStatus: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      warehouse: [null, [Validators.required]],
      vault: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });
  }

  private buildFormaplicationData() {
    this.formaplicationData = this.fb.group({
      dateRequestChangeNumerary: [null, [Validators.required]],
      applicationChangeCashNumber: [null],
      userRequestChangeNumber: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      postUserRequestCamnum: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegationRequestcamnum: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      procedureProposal: [null, [Validators.required]],
      authorizeUser: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      authorizePostUser: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      authorizeDelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      authorizeDate: [null, [Validators.required]],
    });
  }
}
