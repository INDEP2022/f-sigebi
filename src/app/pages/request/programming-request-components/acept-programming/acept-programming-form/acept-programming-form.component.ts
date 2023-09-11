import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import {
  IGoodProgramming,
  IGoodProgrammingSelect,
} from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { ITask } from 'src/app/core/models/ms-task/task-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DomicileService } from 'src/app/core/services/catalogs/domicile.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { ConfirmProgrammingComponent } from '../../../shared-request/confirm-programming/confirm-programming.component';
import { ElectronicSignatureListComponent } from '../../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowSignatureProgrammingComponent } from '../../../shared-request/show-signature-programming/show-signature-programming.component';
import { ShowReportComponentComponent } from '../../execute-reception/show-report-component/show-report-component.component';
import { DetailGoodProgrammingFormComponent } from '../../shared-components-programming/detail-good-programming-form/detail-good-programming-form.component';
import { DomicileFormComponent } from '../../shared-components-programming/domicile-form/domicile-form.component';
import { RejectProgrammingFormComponent } from '../../shared-components-programming/reject-programming-form/reject-programming-form.component';
import { ESTATE_COLUMNS, ESTATE_COLUMNS_VIEW } from '../columns/estate-columns';
import { USER_COLUMNS_SHOW } from '../columns/users-columns';

@Component({
  selector: 'app-acept-programming-form',
  templateUrl: './acept-programming-form.component.html',
  styles: [],
})
export class AceptProgrammingFormComponent extends BasePage implements OnInit {
  estateSettings = {
    ...this.settings,
    actions: false,
    columns: ESTATE_COLUMNS,
  };

  settingsTransportableGoods = {
    ...this.settings,
    actions: {
      delete: false,
      edit: true,
      columnTitle: 'Detalle de la Dirección',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS_VIEW,
  };

  settingGuardGoods = {
    ...this.settings,
    actions: {
      delete: false,
      edit: true,
      columnTitle: 'Detalle de la Dirección',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS_VIEW,
  };

  settingWarehouseGoods = {
    ...this.settings,
    actions: {
      delete: false,
      edit: true,
      columnTitle: 'Detalle de la Dirección',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS_VIEW,
  };
  paramsWarehouse = new BehaviorSubject<ListParams>(new ListParams());
  // namewarehouse1: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsTransportable = new BehaviorSubject<ListParams>(new ListParams());
  paramsTransportableGoods = new BehaviorSubject<ListParams>(new ListParams());
  paramsStation = new BehaviorSubject<ListParams>(new ListParams());
  paramsAuthority = new BehaviorSubject<ListParams>(new ListParams());
  goodsInfoTrans: any[] = [];
  // goodsInfoTrans: IGoodProgramming[];
  goodsInfoGuard: any[] = [];
  goodsInfoWarehouse: any[] = [];
  // goodsInfoWarehouse2: any[] = [];
  totalItems: number = 0;
  totalItemsTransportable: number = 0;
  totalItemsTransportableGoods: number = 0;
  totalItemsGuard: number = 0;
  totalItemsWarehouse: number = 0;
  idTransferent: number;
  idStation: number;
  programming: Iprogramming;
  usersData: LocalDataSource = new LocalDataSource();
  estateData: any[] = [];
  programmingId: number = 0;
  formLoading: boolean = false;
  goodsTranportables: LocalDataSource = new LocalDataSource();
  goodsGuards: LocalDataSource = new LocalDataSource();
  goodsWarehouse: LocalDataSource = new LocalDataSource();
  paramsShowTransportable = new BehaviorSubject<ListParams>(new ListParams());
  task: ITask;
  headingTransportable: string = `Transportables(0)`;
  headingGuard: string = `Resguardo(0)`;
  headingWarehouse: string = `Almacén INDEP(0)`;
  nameTransferent: string = '';
  nameStation: string = '';
  authorityName: string = '';
  typeRelevantName: string = '';
  nameState: string = '';
  nameWarehouse: string = '';
  formLoadingTransportable: boolean = false;
  formLoadingGuard: boolean = false;
  formLoadingWarehouse: boolean = false;
  paramsGuardGoods = new BehaviorSubject<ListParams>(new ListParams());
  paramsWarehouseGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsTransportableGuard: number = 0;
  totalItemsTransportableWarehouse: number = 0;
  paramsShowWarehouse = new BehaviorSubject<ListParams>(new ListParams());
  endDateEmail: string = '';
  startDateEmail: string = '';
  transGoods: any[] = [];
  guardGoods: any[] = [];
  warehouseGoods: any[] = [];
  emails: any[] = [];

  infoUsers: IUser[] = [];
  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private programmingService: ProgrammingRequestService,
    private regionalDelegationService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService,
    private goodService: GoodService,
    private authService: AuthService,
    private emailService: EmailService,
    private taskService: TaskService,
    private router: Router,
    private wcontentService: WContentService,
    private sanitizer: DomSanitizer,
    private stateService: StateOfRepublicService,
    private domicilieService: DomicileService,
    private goodsQueryService: GoodsQueryService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: USER_COLUMNS_SHOW,
    };
    this.programmingId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
  }

  ngOnInit(): void {
    this.getProgrammingId();
    const user: any = this.authService.decodeToken();

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getUsersProgramming());

    this.paramsGuardGoods
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.showGuard());

    this.paramsWarehouseGoods
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.showWarehouseGoods());
  }

  getProgrammingId() {
    this.formLoading = true;
    this.programmingService
      .getProgrammingId(this.programmingId)
      .subscribe(data => {
        this.startDateEmail = data.startDate;
        this.endDateEmail = data.endDate;

        data.startDate = moment(data.startDate).format('DD/MM/YYYY HH:mm:ss');
        data.endDate = moment(data.endDate).format('DD/MM/YYYY HH:mm:ss');
        this.programming = data;

        this.idTransferent = data.tranferId;
        this.idStation = data.stationId;
        this.getRegionalDelegation();
        this.getTransferent();
        this.getState();
        this.getStation();
        this.getAuthority();
        this.getTypeRelevant();
        this.getwarehouse();
        this.getTask();

        this.paramsTransportableGoods
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.filterStatusTrans());
      });
  }

  showGuard() {
    this.formLoadingGuard = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    params.getValue()['filter.status'] = 'EN_RESGUARDO_TMP';
    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: async data => {
        this.totalItemsTransportableGuard = data.count;
        this.headingGuard = `Resguardo(${data.count})`;
        const showGuard: any = [];
        data.data.map((item: IGoodProgramming) => {
          this.paramsShowTransportable.getValue()['filter.id'] = item.goodId;
          this.goodService
            .getAll(this.paramsShowTransportable.getValue())
            .subscribe({
              next: async data => {
                data.data.map(async item => {
                  const aliasWarehouse: any = await this.getAliasWarehouse(
                    item.addressId
                  );
                  item['aliasWarehouse'] = aliasWarehouse;

                  if (item.statePhysicalSae == 1)
                    item['statePhysicalSae'] = 'BUENO';
                  if (item.statePhysicalSae == 2)
                    item['statePhysicalSae'] = 'MALO';
                  showGuard.push(item);
                  this.goodsGuards.load(showGuard);
                  this.formLoadingGuard = false;
                });
              },
            });
        });
      },
      error: error => {
        this.formLoadingGuard = false;
      },
    });
  }

  showWarehouseGoods() {
    this.formLoadingWarehouse = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    params.getValue()['filter.status'] = 'EN_ALMACEN_TMP';

    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: async data => {
        this.totalItemsTransportableWarehouse = data.count;
        this.headingWarehouse = `Almacén INDEP(${data.count})`;
        const showWarehouse: any = [];
        data.data.map((item: IGoodProgramming) => {
          this.paramsShowWarehouse.getValue()['filter.id'] = item.goodId;
          this.goodService
            .getAll(this.paramsShowWarehouse.getValue())
            .subscribe({
              next: async data => {
                data.data.map(async item => {
                  const aliasWarehouse: any = await this.getAliasWarehouse(
                    item.addressId
                  );
                  item['aliasWarehouse'] = aliasWarehouse;

                  if (item.statePhysicalSae == 1)
                    item['statePhysicalSae'] = 'BUENO';
                  if (item.statePhysicalSae == 2)
                    item['statePhysicalSae'] = 'MALO';
                  showWarehouse.push(item);
                  this.goodsWarehouse.load(showWarehouse);
                  this.formLoadingWarehouse = false;
                });
              },
            });
        });
      },
      error: error => {
        this.formLoadingWarehouse = false;
      },
    });
  }

  getTask() {
    const task = JSON.parse(localStorage.getItem('Task'));
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = `$eq:${task.id}`;
    this.taskService.getAll(params.getValue()).subscribe({
      next: response => {
        this.task = response.data[0];
      },
      error: error => {},
    });
  }

  getRegionalDelegation() {
    this.regionalDelegationService
      .getById(this.programming.regionalDelegationNumber)
      .subscribe(data => {
        this.programming.regionalDelegationNumber = data.description;
      });
  }

  getState() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.programming.stateKey;
    this.stateService.getAll(params.getValue()).subscribe({
      next: response => {
        this.nameState = response.data[0].descCondition;
      },
    });
  }
  getTransferent() {
    this.transferentService
      .getById(this.programming.tranferId)
      .subscribe(data => {
        this.nameTransferent = data.nameTransferent;
      });
  }

  getStation() {
    this.paramsStation.getValue()['filter.id'] = this.programming.stationId;
    this.paramsStation.getValue()['filter.idTransferent'] =
      this.programming.tranferId;

    this.stationService.getAll(this.paramsStation.getValue()).subscribe({
      next: response => {
        this.nameStation = response.data[0].stationName;
      },
      error: error => {},
    });
  }

  getAuthority() {
    this.paramsAuthority.getValue()['filter.idAuthority'] =
      this.programming.autorityId;
    this.paramsAuthority.getValue()['filter.idTransferer'] = this.idTransferent;

    this.authorityService.getAll(this.paramsAuthority.getValue()).subscribe({
      next: response => {
        let authority = response.data.find(res => {
          return res;
        });
        this.authorityName = authority.authorityName;
      },
    });
  }

  getTypeRelevant() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.programming.typeRelevantId;
    this.typeRelevantService.getAll(params.getValue()).subscribe(data => {
      this.typeRelevantName = data.data[0].description;
    });
  }

  getwarehouse() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.organizationCode'] = this.programming.storeId;
    this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
      next: response => {
        this.nameWarehouse = response.data[0].name;
        this.formLoading = false;
      },
      error: error => {},
    });
    /*this.warehouseService.getAll(params.getValue()).subscribe(data => {
      this.nameWarehouse = data.data[0].description;
      this.formLoading = false;
    }); */
  }

  getUsersProgramming() {
    this.loading = true;
    this.params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getUsersProgramming(this.params.getValue())
      .subscribe({
        next: response => {
          const usersData = response.data.map(items => {
            items.userCharge = items.charge?.description;
            return items;
          });
          this.infoUsers = usersData;
          this.usersData.load(usersData);
          this.totalItems = this.usersData.count();
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  confirm() {}

  rejectProgramming() {
    const config = MODAL_CONFIG;
    let idProgramming = this.programmingId;
    config.initialState = {
      idProgramming,
      callback: (next: boolean) => {
        if (next) {
        }
      },
    };

    this.modalService.show(RejectProgrammingFormComponent, config);
  }

  signOffice() {
    const config = MODAL_CONFIG;
    config.initialState = {
      idProgramming: this.programmingId,
      callback: (signatore: ISignatories) => {
        if (signatore) {
          this.openReport(signatore);
        }
      },
    };

    this.modalService.show(ConfirmProgrammingComponent, config);
  }

  viewOffice() {
    this.wcontentService.obtainFile(this.programming.contentId).subscribe({
      next: response => {
        let blob = this.dataURItoBlob(response);
        let file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.openPrevPdf(fileURL);
      },
      error: error => {},
    });
  }

  openReport(signatore: ISignatories) {
    const idProg = this.programmingId;
    const idTypeDoc = 221;
    let config: ModalOptions = {
      initialState: {
        idProg,
        idTypeDoc,
        signatore,
        typeFirm: 'electronica',
        programming: this.programming,
        callback: (next: boolean) => {
          if (next) {
            this.getProgrammingId();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  openPrevPdf(pdfUrl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  electronicSign() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.showSignProg();
        }
      },
    };

    const electronicSign = this.modalService.show(
      ElectronicSignatureListComponent,
      config
    );
  }

  showSignProg() {
    const showSignProg = this.modalService.show(
      ShowSignatureProgrammingComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  filterStatusTrans() {
    this.formLoadingTransportable = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    params.getValue()['filter.status'] = 'EN_TRANSPORTABLE';
    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: async data => {
        this.totalItemsTransportableGoods = data.count;
        this.headingTransportable = `Transportable(${data.count})`;
        const showTransportable: any = [];
        data.data.map((item: IGoodProgramming) => {
          this.paramsShowTransportable.getValue()['filter.id'] = item.goodId;
          this.goodService
            .getAll(this.paramsShowTransportable.getValue())
            .subscribe({
              next: async data => {
                data.data.map(async item => {
                  const aliasWarehouse: any = await this.getAliasWarehouse(
                    item.addressId
                  );
                  item['aliasWarehouse'] = aliasWarehouse;

                  if (item.physicalStatus == 1)
                    item['physicalStatus'] = 'BUENO';
                  if (item.physicalStatus == 2) item['physicalStatus'] = 'MALO';
                  showTransportable.push(item);

                  this.goodsTranportables.load(showTransportable);
                  this.formLoadingTransportable = false;
                });
              },
            });
        });
      },
      error: error => {
        this.formLoadingTransportable = false;
      },
    });
  }

  getAliasWarehouse(idAddress: number) {
    return new Promise((resolve, reject) => {
      this.domicilieService.getById(idAddress).subscribe({
        next: response => {
          resolve(response.aliasWarehouse);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  filterStatusGuard(data: IGoodProgramming[]) {
    const goodsTrans = data.filter(items => {
      return items.status == 'EN_RESGUARDO_TMP';
    });
    goodsTrans.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //
          this.goodsInfoGuard.push(response);
          this.goodsGuards.load(this.goodsInfoGuard);
          this.totalItemsGuard = this.goodsGuards.count();
          this.headingGuard = `Resguardo(${this.goodsGuards.count()})`;
        },
      });
    });
  }

  filterStatusWarehouse(data: IGoodProgramming[]) {
    const goodswarehouse = data.filter(items => {
      return items.status == 'EN_ALMACEN_TMP';
    });

    goodswarehouse.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';

          // response.decriptionGoodSae = 'Sin descripción';
          // warehouseName
          // queda pendiente mostrar el alías del almacén //
          this.goodsInfoWarehouse.push(response);
          this.goodsWarehouse.load(this.goodsInfoWarehouse);
          this.totalItemsWarehouse = this.goodsWarehouse.count();
          this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.count()})`;
        },
      });
    });
  }

  aprobateProgramming() {
    this.sendEmailUsers();
    if (this.programming.contentId) {
      this.alertQuestion(
        'question',
        'Aprobar Programación',
        `¿Esta seguro de aprobar la programación con folio: ${this.programming.folio}?`
      ).then(async question => {
        if (question.isConfirmed) {
          this.sendEmailUsers();
          const createTaskNotification: any =
            await this.createTaskNotification();

          if (createTaskNotification) {
            this.createTaskExecuteProgramming();
            this.createTaskFormalize(createTaskNotification);
          }
        }
      });
    } else {
      // this.sendEmailUsers();
      this.alertInfo(
        'warning',
        'Acción no permitida',
        'Se necesita firmar el oficio para poder aprobar la solicitud'
      );
    }
  }
  async sendEmailUsers() {
    this.infoUsers.map(user => {
      const emailsUsers = user.email;
      this.emails.push(emailsUsers);
    });

    const showTransportableData = await this.showTransportableEmail();
    console.log('showTransportableData', showTransportableData);
    if (showTransportableData) {
      const showGuardData = await this.showGuardEmail();
      console.log('showGuardData', showGuardData);
      if (showGuardData) {
        const showWarehouseData = await this.showWarehouseEmail();
        console.log('showWarehouseData', showWarehouseData);
        if (showWarehouseData) {
          const dataEmail = {
            folio: this.programming.folio,
            startDate: this.startDateEmail,
            endDate: this.endDateEmail,
            city: this.programming.city,
            address: this.programming.address,
            usersProg: this.infoUsers,
            goodsTrans: this.transGoods,
            goodsResg: this.guardGoods,
            goodsWarehouse: this.warehouseGoods,
            emailSend: this.emails,
            nameAtt: this.programming.folio,
            wcontent: this.programming.contentId,
          };
          setTimeout(() => {
            this.emailService.createEmailProgramming(dataEmail).subscribe({
              next: response => {
                console.log('se envio el correo', response);
              },
              error: error => {},
            });

            this.formLoading = false;
          }, 5000);
        }
      }
    }
  }

  showTransportableEmail() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.programmingId'] = this.programmingId;
      params.getValue()['filter.status'] = 'EN_TRANSPORTABLE';
      params.getValue().limit = 10000000;
      this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
        next: async data => {
          data.data.map(async good => {
            const paramsGood = new BehaviorSubject<ListParams>(
              new ListParams()
            );
            paramsGood.getValue()['filter.id'] = good.goodId;
            this.goodService.getAll(paramsGood.getValue()).subscribe({
              next: async data => {
                const infotrans = await this.warehouseNameT(
                  data.data[0].storeId
                );
                const transObject = {
                  goodId: good.goodId,
                  uniqueKey: data.data[0].uniqueKey,
                  goodDescription: data.data[0].goodDescription,
                  quantity: data.data[0].quantity,
                  unitMeasure: data.data[0].unitMeasure,
                  storeId: infotrans,
                };
                this.transGoods.push(transObject);
                resolve(true);
              },
            });
            //this.goodService.getAll;
          });
        },
        error: error => {
          resolve(true);
        },
      });
    });
  }

  showGuardEmail() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.programmingId'] = this.programmingId;
      params.getValue()['filter.status'] = 'EN_RESGUARDO_TMP';
      params.getValue().limit = 10000000;
      this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
        next: async data => {
          data.data.map(async good => {
            const paramsGood = new BehaviorSubject<ListParams>(
              new ListParams()
            );
            paramsGood.getValue()['filter.id'] = good.goodId;
            this.goodService.getAll(paramsGood.getValue()).subscribe({
              next: async data => {
                const infotrans = await this.warehouseNameT(
                  data.data[0].storeId
                );
                const transObject = {
                  goodId: good.goodId,
                  uniqueKey: data.data[0].uniqueKey,
                  goodDescription: data.data[0].goodDescription,
                  quantity: data.data[0].quantity,
                  unitMeasure: data.data[0].unitMeasure,
                  storeId: infotrans,
                };
                this.guardGoods.push(transObject);
                resolve(true);
              },
            });
            //this.goodService.getAll;
          });
        },
        error: error => {
          resolve(true);
        },
      });
    });
  }

  showWarehouseEmail() {
    return new Promise((resolve, reject) => {
      let count: number = 0;
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.programmingId'] = this.programmingId;
      params.getValue()['filter.status'] = 'EN_ALMACEN_TMP';
      params.getValue().limit = 10000000;
      this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
        next: async data => {
          data.data.map(async good => {
            count = count + 1;
            const paramsGood = new BehaviorSubject<ListParams>(
              new ListParams()
            );
            paramsGood.getValue()['filter.id'] = good.goodId;
            this.goodService.getAll(paramsGood.getValue()).subscribe({
              next: async data => {
                const infotrans = await this.warehouseNameT(
                  data.data[0].storeId
                );
                const transObject = {
                  goodId: good.goodId,
                  uniqueKey: data.data[0].uniqueKey,
                  goodDescription: data.data[0].goodDescription,
                  quantity: data.data[0].quantity,
                  unitMeasure: data.data[0].unitMeasure,
                  storeId: infotrans,
                };
                if (count == 2) {
                  this.warehouseGoods.push(transObject);
                  resolve(true);
                }
              },
            });
            //this.goodService.getAll;
          });
        },
        error: error => {
          resolve(true);
        },
      });
    });
  }

  //Creamos la tarea de notificación al delegado regional//
  async createTaskNotification() {
    return new Promise(async (resolve, reject) => {
      const _task = JSON.parse(localStorage.getItem('Task'));
      const user: any = this.authService.decodeToken();
      let body: any = {};

      body['idTask'] = _task.id;
      body['userProcess'] = user.username;
      body['type'] = 'SOLICITUD_PROGRAMACION';
      body['subtype'] = 'Aceptar_Programacion';
      body['ssubtype'] = 'APPROVE';

      let task: any = {};
      task['id'] = 0;
      task['assignees'] = _task.assignees;
      task['assigneesDisplayname'] = _task.assigneesDisplayname;
      task['creator'] = user.username;
      task['taskNumber'] = Number(this.programmingId);
      task[
        'title'
      ] = `Notificación de Programación con folio: ${this.programming.folio}`;
      task['programmingId'] = this.programmingId;
      //task['requestId'] = this.programmingId;
      task['expedientId'] = 0;
      task['idDelegationRegional'] = user.department;
      task['urlNb'] = 'pages/request/programming-request/schedule-notify';
      task['processName'] = 'SolicitudProgramacion';
      task['idAuthority'] = this.programming.autorityId;
      task['idStore'] = this.programming.storeId;
      task['idTransferee'] = this.programming.tranferId;
      task['nbTransferee'] = this.programming.transferentName;
      body['task'] = task;

      const createTask: any = await this.createTaskOrderService(body);
      if (createTask) resolve(createTask);

      this.loading = false;
    });
  }

  //Creamos la tarea de ejecutar la recepción//
  async createTaskExecuteProgramming() {
    const _task = JSON.parse(localStorage.getItem('Task'));
    const user: any = this.authService.decodeToken();
    let body: any = {};
    body['type'] = 'SOLICITUD_PROGRAMACION';
    body['subtype'] = 'Aceptar_Programacion';
    body['ssubtype'] = 'APPROVE_ER';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = _task.assignees;
    task['assigneesDisplayname'] = _task.assigneesDisplayname;
    task['creator'] = user.username;
    task['taskNumber'] = Number(this.programmingId);
    task['title'] = `Ejecutar Recepción con folio: ${this.programming.folio}`;
    task['programmingId'] = this.programmingId;
    //task['requestId'] = this.programmingId;
    task['expedientId'] = 0;
    task['idDelegationRegional'] = user.department;
    task['urlNb'] = 'pages/request/programming-request/execute-reception';
    task['processName'] = 'SolicitudProgramacion';
    task['idAuthority'] = this.programming.autorityId;
    task['idStore'] = this.programming.storeId;
    task['idTransferee'] = this.programming.tranferId;
    task['nbTransferee'] = this.programming.transferentName;
    body['task'] = task;

    await this.createTaskOrderService(body);
    this.loading = false;
  }

  //Creamos la tarea de Formalizar la recepción//
  async createTaskFormalize(createTaskNotification: any) {
    const _task = JSON.parse(localStorage.getItem('Task'));
    const user: any = this.authService.decodeToken();
    let body: any = {};

    body['type'] = 'SOLICITUD_PROGRAMACION';
    body['subtype'] = 'Aceptar_Programacion';
    body['ssubtype'] = 'APPROVE_FE';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = _task.assignees;
    task['assigneesDisplayname'] = _task.assigneesDisplayname;
    task['creator'] = user.username;
    task['taskNumber'] = Number(this.programmingId);
    task['title'] = `Formalizar entrega con folio: ${this.programming.folio}`;
    task['programmingId'] = this.programmingId;
    //task['requestId'] = this.programmingId;
    task['expedientId'] = 0;
    task['idDelegationRegional'] = user.department;
    task['urlNb'] = 'pages/request/programming-request/formalize-programming';
    task['processName'] = 'SolicitudProgramacion';
    task['idAuthority'] = this.programming.autorityId;
    task['idStore'] = this.programming.storeId;
    task['idTransferee'] = this.programming.tranferId;
    task['identificationKey'] = createTaskNotification.task.id;
    task['nbTransferee'] = this.programming.transferentName;
    body['task'] = task;

    const taskResult: any = await this.createTaskOrderService(body);
    this.loading = false;
    if (taskResult || taskResult == false) {
      this.msgGuardado(
        'success',
        'Creación de tarea correcta',
        `Se creó la tarea ejecutar recepción con el folio: ${this.programming.folio}`
      );
    }
  }

  createTaskOrderService(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(false);
        },
      });
    });
  }
  warehouseNameT(idWarehouse: number) {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.organizationCode'] = idWarehouse;
      this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].name);
        },
        error: error => {},
      });
      /*this.warehouseService.getById(idWarehouse).subscribe({
        next: response => {
          return resolve(response.description);
        },
        error: error => {},
      }); */
    });
  }

  showGood(item: IGoodProgrammingSelect) {
    let config = { ...MODAL_CONFIG, class: 'modal-xl modal-dialog-centered' };
    config.initialState = {
      item,
      callback: () => {},
    };
    this.modalService.show(DetailGoodProgrammingFormComponent, config);
  }

  showAddress(item: IGoodProgrammingSelect) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      item,
      callback: () => {},
    };
    this.modalService.show(DomicileFormComponent, config);
  }

  msgGuardado(icon: any, title: string, message: string) {
    Swal.fire({
      title: title,
      html: message,
      icon: icon,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['pages/siab-web/sami/consult-tasks']);
      }
    });
  }
}
