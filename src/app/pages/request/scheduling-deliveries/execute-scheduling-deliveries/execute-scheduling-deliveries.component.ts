import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, takeUntil } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IProgrammingDeliveryGood } from 'src/app/core/models/good-programming/programming-delivery-good.model';
import { IGoodInvAvailableView } from 'src/app/core/models/ms-goodsinv/goodsinv.model';
import { ITask } from 'src/app/core/models/ms-task/task-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { CertificatesDeliveryService } from 'src/app/core/services/ms-delivery-constancy/certificates-delivery.service';
import { CertificatesGoodsService } from 'src/app/core/services/ms-delivery-constancy/certificates-goods.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { JSON_TO_CSV } from 'src/app/pages/admin/home/constants/json-to-csv';
import { IprogrammingDelivery } from 'src/app/pages/siab-web/sami/receipt-generation-sami/receipt-table-goods/ireceipt';
import Swal from 'sweetalert2';
import { TypeSignatureModalComponent } from '../../reception-scheduling-service-order/components/type-signature-modal/type-signature-modal..component';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';
import { RequestHelperService } from '../../request-helper-services/request-helper.service';
import { ShowDocumentsGoodComponent } from '../../shared-request/expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { DeliveriesConstancyFormComponent } from '../deliveries-constancy-form/deliveries-constancy-form.component';
import { DocumentConstanceModalComponent } from '../document-constance-modal/document-constance-modal.component';
import { EntryOrderModalComponent } from '../entry-order-modal/entry-order-modal.component';
import { PhotosConstanceModalComponent } from '../photos-constance-modal/photos-constance-modal.component';
import { TypeDeliveryModelComponent } from '../type-delivery-model/type-delivery-model.component';
import {
  CONSTANCY_DELIVERY_COLUMNS,
  GOOD_DELIVERY_COLUMN,
  PROG_DELIVERY_GOOD_NO_DELIVERED,
  PROG_DELIVERY_GOOD_TYPE_REST_COLUMNS,
} from './columns/good-delivery-columns';
import { EntregaSignatureModalComponent } from './entrega-signature-modal/entrega-signature-modal.component';
import { ShowSchedulingReportComponentComponent } from './show-scheduling-report-component/show-scheduling-report-component.component';

@Component({
  selector: 'app-execute-scheduling-deliveries',
  templateUrl: './execute-scheduling-deliveries.component.html',
  styleUrls: ['./execute-scheduling-deliveries.scss'],
})
export class ExecuteSchedulingDeliveriesComponent
  extends BasePage
  implements OnInit
{
  @ViewChild('table', { static: false }) table: any;
  @ViewChild('table2', { static: false }) table2: any;
  @ViewChild('tablePEGNE', { static: false }) tablePEGNE: any;
  showSearchForm: boolean = true;
  constancyDelivered: boolean = false;
  constancyNoDelivered: boolean = false;
  constancyNoAcept: boolean = false;
  constancyNoRetired: boolean = false;
  showDetailProgDestruc: boolean = true;
  active: boolean = false;
  taskInfo: any = {};

  statusProgramming: string = ''; //APROBAR_NO_ENT_ESP

  programmingDetailPanel: any = {};
  GoodDeliverySettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };
  goodDeliveryArray: any = [];
  goodParams = new BehaviorSubject<ListParams>(new ListParams());
  devgoodTotalItems: number = 0;
  goodDeliveryColumns = GOOD_DELIVERY_COLUMN;

  constancyDeliverySettings: any = {
    ...TABLE_SETTINGS,
    selectMode: '',
    columns: CONSTANCY_DELIVERY_COLUMNS,
  };
  constancyDeliveryArray: any = [];
  constancyParams = new BehaviorSubject<ListParams>(new ListParams());
  constancyTotalItems: number = 0;
  constancyDeliveryColumns = CONSTANCY_DELIVERY_COLUMNS;
  loadingT2: boolean = false;

  progDelivGoodTypeRestSettings: any = {
    ...TABLE_SETTINGS,
    selectMode: '',
    actions: false,
    columns: PROG_DELIVERY_GOOD_TYPE_REST_COLUMNS,
  };
  progDelivGoodTypeRestArray: any = [];
  progDelivGoodTypeRestParams = new BehaviorSubject<ListParams>(
    new ListParams()
  );
  progDelivGoodTypeRestTotalItems: number = 0;
  progDelivGoodTypeRestColumns = PROG_DELIVERY_GOOD_TYPE_REST_COLUMNS;
  loadingEEB: boolean = false;
  goodDeliveryFieldSelected: any = [];
  goodRestSelected: any = {};

  progDelivGoodNDSettings: any = {
    ...TABLE_SETTINGS,
    selectMode: 'multi',
    actions: false,
    columns: PROG_DELIVERY_GOOD_NO_DELIVERED,
  };
  progDelivGoodNDArray: any = [];
  progDelivGoodNDParams = new BehaviorSubject<ListParams>(new ListParams());
  progDelivGoodNDTotalItems: number = 0;
  progDelivGoodNDColumns = PROG_DELIVERY_GOOD_NO_DELIVERED;
  loadingPENE: boolean = false;
  progGoodNoDeliveredSelected: any = [];
  progDeliveNoDSelectAll: any = [];

  goodDeliveredSelected: any = [];
  regDelegationId: number = null;
  bsModelRef: BsModalRef;
  jsonToCsv = JSON_TO_CSV;
  constanceSelected: any = {};
  is: boolean = false;
  idProgram: string = '';
  programmingId = '';

  title: string = '';

  private programmingService = inject(ProgrammingGoodService);
  private transferenteService = inject(TransferenteService);
  private certifiDeliveryService = inject(CertificatesDeliveryService);
  private excelService = inject(ExcelService);
  private wcontet = inject(WContentService);
  private certifiGoodsService = inject(CertificatesGoodsService);
  private requestHelpService = inject(RequestHelperService);
  private activeRouter = inject(ActivatedRoute);

  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private programmingRequestService: ProgrammingRequestService,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.programmingId = this.activeRouter.snapshot.params['id'];

    this.taskInfo = await this.getTask();
    this.title = this.taskInfo.title;

    if (this.programmingDetailPanel.status === 'RESTITUCION_BIENES') {
      this.active = true;
    }
    const segments = this.route.snapshot.url;
    this.idProgram = segments[segments.length - 1].path;

    let objFromStorage = JSON.parse(localStorage.getItem('Task'));

    if (objFromStorage.taskId != this.idProgram) {
      this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
    }

    this.getSchedulingDelivery();
    this.GoodDeliverySettings.columns = GOOD_DELIVERY_COLUMN;

    this.goodParams.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      if (this.programmingDetailPanel.id) {
        this.getProgrammingGoodDelivery(data);
      }
    });

    this.goodDeliveryColumns.amountDelivered = {
      ...this.goodDeliveryColumns.amountDelivered,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setamountDelivered(data);
        });
      },
    };

    this.goodDeliveryColumns.amountNotDelivered = {
      ...this.goodDeliveryColumns.amountNotDelivered,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setamountNotDelivered(data);
        });
      },
    };

    this.goodDeliveryColumns.anountNotAccelted = {
      ...this.goodDeliveryColumns.anountNotAccelted,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setanountNotAccelted(data);
        });
      },
    };

    this.goodDeliveryColumns.amountNotWhithdrawn = {
      ...this.goodDeliveryColumns.amountNotWhithdrawn,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setamountNotWhithdrawn(data);
        });
      },
    };

    this.constancyDeliverySettings = {
      ...TABLE_SETTINGS,
      columns: CONSTANCY_DELIVERY_COLUMNS,
      actions: {
        delete: true,
        edit: true,
        columnTitle: 'Acciones',
        position: 'right',
      },

      edit: {
        editButtonContent:
          '<i class="fa fa-eye text-primary mx-2 mr-2" tooltip="Vista Previa" containerClass="tooltip-style"></i>',
      },
      delete: {
        deleteButtonContent:
          '<i class="fa fa-times text-info mx-2" tooltip="Cerrar Constancia" containerClass="tooltip-style"></i>',
      },
    };

    this.constancyParams.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      if (this.programmingDetailPanel.id) {
        this.getCertificateDelivery(data);
      }
    });

    this.progDelivGoodTypeRestColumns.approveCheck = {
      ...this.progDelivGoodTypeRestColumns.approveCheck,
      onComponentInitFunction: this.approvedSelected.bind(this),
    };

    this.progDelivGoodTypeRestColumns.observation = {
      ...this.progDelivGoodTypeRestColumns.observation,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setObservations(data);
        });
      },
    };

    //
    this.progDelivGoodNDColumns.causeNotDelivered = {
      ...this.progDelivGoodNDColumns.causeNotDelivered,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setCauseNotDelivered(data);
        });
      },
    };

    this.progDelivGoodNDColumns.typeRestitution = {
      ...this.progDelivGoodNDColumns.typeRestitution,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setTypeRestitution(data);
        });
      },
    };

    this.progDelivGoodNDColumns.observation = {
      ...this.progDelivGoodNDColumns.observation,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setObservations(data);
        });
      },
    };

    this.progDelivGoodNDColumns.replacementDate = {
      ...this.progDelivGoodNDColumns.replacementDate,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setReplacementDate(data);
        });
      },
    };

    if (
      this.programmingDetailPanel.status == 'RESTITUCION_BIENES' ||
      this.programmingDetailPanel.status == 'APROBAR_NO_ENT' ||
      this.programmingDetailPanel.status == 'FORMATO_RECLAMACION' ||
      this.statusProgramming == 'BIENES_NO_ENTREGADOS' ||
      this.statusProgramming == 'FORMATO_RECLAMACION_SAE' ||
      this.statusProgramming == 'VERIFICACION_BIENES' ||
      this.statusProgramming == 'FORMATO_RECLAMACION_TE' ||
      this.programmingDetailPanel.status == 'BIENES_NO_ENTREGADOS'
    ) {
      this.progDelivGoodNDParams
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(data => {
          if (this.programmingDetailPanel.id) {
            this.getProgrammingGoodDelivery(data);
          }
        });
    }

    if (
      this.statusProgramming == 'BIENES_NO_ENTREGADOS' ||
      this.statusProgramming == 'BIENES_NO_ENTREGADOS'
    ) {
      this.progDelivGoodTypeRestParams
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(data => {
          if (this.programmingDetailPanel.id) {
            this.getProgrammingGoodDelivery(data);
          }
        });
    }
  }

  getTitle() {
    console.log(this.programmingDetailPanel.status);
    switch (this.programmingDetailPanel.status) {
      case 'PROGRAMACION_EJECUTADA':
      case 'VERIFICACION_BIENES':
        this.title = 'APROBAR SOLICITUD PARA LA RESTITUCIÓN DE BIENES';
        break;
      case 'BIENES_NO_ENTREGADOS':
        this.title = 'CLASIFICACIÓN DE BIENES NO ENTREGADOS';
        break;
      case 'RESTITUCION_BIENES':
        this.title = 'RESTITUCIÓN DE BIENES DAÑADOS Y FALTANTES';
        break;
      default:
        this.title = 'EJECUTAR PROGRAMACIÓN DE ENTREGA';
        break;
    }
  }

  certificateDelivery(constancy: number) {
    if (!this.selectedRows || this.selectedRows.length < 1) {
      this.alert(
        'warning',
        'Advertencia',
        'Se debe seleccionar al menos un bien para generar la constancia de entrega'
      );
      return;
    } else {
      const typeEvent = this.programmingDetailPanel.typeEvent;
      const comply = this.validateBeforeOpenModal(constancy);
      if (comply != true) return;

      const certificateDelivery = this.modalService.show(
        DeliveriesConstancyFormComponent,
        {
          initialState: {
            goods: this.selectedRows,
            typeConstancy: constancy,
            typeEvent: typeEvent,
            progEntrega: this.programmingDetailPanel,
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        }
      );

      certificateDelivery.content.event.subscribe((data: any) => {
        const typeEvent = this.programmingDetailPanel.typeEvent;
        this.loadingT2 = true;
        const typeReceptor = data.receiverType;
        if (typeEvent == 1 && typeReceptor == 'CLIENTE') {
          this.constancyDeliveryArray['identificator'] = data.clientIden;
          this.constancyDeliveryArray['IdennNum'] = data.clientIdennNum;
          this.constancyDeliveryArray['name'] = data.cliente;
        } else if (typeEvent != 1 && typeReceptor != 'CLIENTE') {
          this.constancyDeliveryArray['identificator'] = data.repLegalIden;
          this.constancyDeliveryArray['IdennNum'] = data.repLegalIdenNum;
          this.constancyDeliveryArray['name'] = data.repLegal;
        }

        this.constancyDeliveryArray = [...this.constancyDeliveryArray];
        this.loadingT2 = false;

        this.getCertificateDelivery(new ListParams());
      });
    }
  }

  newDocument() {
    if (
      this.constanceSelected == null ||
      this.constanceSelected.certificateId == null
    ) {
      this.alert(
        'warning',
        'Advertencia',
        'Es necesario seleccionar una constancia'
      );
      return;
    }

    if (
      this.constanceSelected.closing == null ||
      this.constanceSelected.closing == 'N'
    ) {
      this.alert(
        'warning',
        'Advertencia',
        'Es necesario cerrar la constancia para adjuntar documentos'
      );
      return;
    }

    const newDocument = this.modalService.show(
      DocumentConstanceModalComponent,
      {
        initialState: {
          certificate: this.constanceSelected,
          goodDelivery: this.programmingDetailPanel,
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  editConstancy() {
    if (
      this.constanceSelected == null ||
      Object.keys(this.constanceSelected).length === 0
    ) {
      this.alert(
        'warning',
        'Advertencia',
        'Es necesario seleccionar una constancia'
      );
      return;
    }

    let config: ModalOptions = {
      initialState: {
        goods: this.goodDeliveredSelected,
        typeEvent: +this.programmingDetailPanel.typeEvent,
        progEntrega: this.programmingDetailPanel,
        constanceForm: this.constanceSelected,
        edit: true,
        callback: (next: boolean) => {
          if (next) {
            //
            this.getSchedulingDelivery();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModelRef = this.modalService.show(
      DeliveriesConstancyFormComponent,
      config
    );
    this.bsModelRef.content.event.subscribe((data: any) => {
      if (data == true) {
        this.getCertificateDelivery(new ListParams());
      }
    });
  }

  deleteConstancy(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar esta constancía?'
    ).then(question => {
      if (question.isConfirmed) {
        alert('Eliminado');
      }
    });
  }

  getSchedulingDelivery() {
    this.selectedRows = [];
    const params = new ListParams();
    params['filter.id'] = `$eq:${this.idProgram}`;
    this.programmingService
      .getProgrammingDelivery(params)
      .pipe(
        map((x: any) => {
          return x.data[0];
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.programmingDetailPanel = resp;
          /*this.programmingDetailPanel.id = resp.id;
          this.programmingDetailPanel.typeEvent = resp.typeEvent;
          this.programmingDetailPanel.folio = resp.folio;
          this.programmingDetailPanel.store = resp.store;
          this.programmingDetailPanel.client = resp.client;
          this.programmingDetailPanel.startDate = resp.startDate;
          this.programmingDetailPanel.endDate = resp.endDate;
          this.programmingDetailPanel.typeUser = resp.typeUser;
          this.programmingDetailPanel.emailAddressCenterTe =
            resp.emailAddressCenterTe;
          this.programmingDetailPanel.status = resp.status;
          this.programmingDetailPanel.officeDestructionNumber =
            resp.officeDestructionNumber;
          this.programmingDetailPanel.metodDestruction = resp.metodDestruction;
          this.programmingDetailPanel.locationDestruction =
            resp.locationDestruction;
          this.programmingDetailPanel.addressee = resp.addressee;
          this.programmingDetailPanel.term = resp.term;
          this.programmingDetailPanel.taxpayerName = resp.taxpayerName;
          this.programmingDetailPanel.chargeAddressee = resp.chargeAddressee;
          this.programmingDetailPanel.company = resp.company;
          this.programmingDetailPanel.legalRepresentativeName =
            resp.legalRepresentativeName;
          this.programmingDetailPanel.placeDestruction = resp.placeDestruction;
          this.programmingDetailPanel.statusAut = resp.statusAut*/
          this.getTransferent(resp.transferId);

          this.getProgrammingGoodDelivery(new ListParams());
          this.getCertificateDelivery(new ListParams());
          //this.getTitle();
        },
      });
  }

  private getTransferent(id: number | string) {
    this.transferenteService.getById(id).subscribe({
      next: resp => {
        this.programmingDetailPanel.transferId = resp.nameTransferent;
      },
    });
  }

  getProgrammingGoodDelivery(params: ListParams) {
    this.loading = true;
    this.loadingEEB = true;
    if (
      this.programmingDetailPanel.status == 'RESTITUCION_BIENES' ||
      this.programmingDetailPanel.status == 'APROBAR_NO_ENT' ||
      this.programmingDetailPanel.status == 'FORMATO_RECLAMACION'
    ) {
      params['filter.status'] = `$ne:'PENDIENTE_APROBACION'`;
    }
    params[
      'filter.programmingDeliveryId'
    ] = `$eq:${this.programmingDetailPanel.id}`;
    this.programmingService.getProgrammingDeliveryGood(params).subscribe({
      next: (resp: any) => {
        let filteredData = resp.data;

        if (
          this.programmingDetailPanel === 'APROBAR_NO_ENT' ||
          this.programmingDetailPanel === 'FORMATO_RECLAMACION'
        ) {
          filteredData = resp.data.filter(
            (item: any) => item.replacementDate !== null
          );
        }

        filteredData.map((item: any) => {
          item['faltante'] =
            Number(item.amountGood) -
            (Number(item.sunGoodEnt) +
              Number(item.sumGoodNoEnt) +
              Number(item.sumGoodNoAce) +
              Number(item.sumGoodNoRet));
        });

        if (
          this.programmingDetailPanel.status == 'FORMATO_RECLAMACION' ||
          this.programmingDetailPanel.status == 'APROBAR_NO_ENT'
        ) {
          this.goodDeliveryArray = filteredData.filter(
            (item: any) => item.replacementDate === null
          );
          resp.data = this.goodDeliveryArray;
        } else {
          this.goodDeliveryArray = filteredData;
        }

        this.devgoodTotalItems = this.goodDeliveryArray.length;

        console.log('this.goodDeliveryArray', this.goodDeliveryArray);

        this.setProgramDeliveryGoodColumns();

        if (
          this.programmingDetailPanel.status == 'PROGRAMACION_EJECUTADA' ||
          this.programmingDetailPanel.status == 'VERIFICACION_BIENES' ||
          this.statusProgramming == 'APROBAR_NO_ENT_ESP' ||
          this.statusProgramming == 'APROBAR_NO_ENT_NUM'
        ) {
          resp.data.map((item: any) => {
            item.approveCheck =
              item.approveEnEsp == null || item.approveEnEsp == 'N'
                ? false
                : true;
          });
          this.progDelivGoodTypeRestArray = resp.data;
          this.progDelivGoodTypeRestTotalItems = resp.count;
        }

        if (
          this.programmingDetailPanel.status == 'RESTITUCION_BIENES' ||
          this.programmingDetailPanel.status == 'APROBAR_NO_ENT' ||
          this.programmingDetailPanel.status == 'BIENES_NO_ENTREGADOS' ||
          this.programmingDetailPanel.status == 'FORMATO_RECLAMACION' ||
          this.programmingDetailPanel.status == 'VERIFICACION_BIENES'
        ) {
          if (
            this.programmingDetailPanel.status == 'RESTITUCION_BIENES' ||
            this.programmingDetailPanel.status == 'APROBAR_NO_ENT' ||
            this.programmingDetailPanel.status == 'FORMATO_RECLAMACION'
          ) {
            resp.data.map((item: any) => {
              this.requestHelpService.changeReadOnly(true);
            });
          } else {
            this.requestHelpService.changeReadOnly(false);
          }
          this.progDelivGoodNDArray = resp.data;
          this.progDelivGoodNDTotalItems = resp.count;
          this.setProgDelivGoodNoDeliveredColumns();
        }

        this.loading = false;
        this.loadingEEB = false;
        this.loadingEEB = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  setProgramDeliveryGoodColumns() {
    setTimeout(() => {
      const table = this.table.grid.getColumns();
      const cantNoAcep = table.find((x: any) => x.id == 'anountNotAccelted');
      const sumNoAcep = table.find((x: any) => x.id == 'sumGoodNoAce');
      const cantNoRet = table.find((x: any) => x.id == 'amountNotWhithdrawn');
      const sumNoRet = table.find((x: any) => x.id == 'sumGoodNoRet');

      if (Number(this.programmingDetailPanel.typeEvent) != 1) {
        cantNoAcep.hide = true;
        sumNoAcep.hide = true;
        cantNoRet.hide = true;
        sumNoRet.hide = true;
      }
    }, 300);
  }

  setProgDelivGoodNoDeliveredColumns() {
    setTimeout(() => {
      const table = this.tablePEGNE.grid.getColumns();
      const foundInd = table.find((x: any) => x.id == 'foundInd');
      const replacementDate = table.find((x: any) => x.id == 'replacementDate');
      const typeRestitution = table.find((x: any) => x.id == 'typeRestitution');
      const commercialLot = table.find((x: any) => x.id == 'commercialLot');
      const commercialEvent = table.find((x: any) => x.id == 'commercialEvent');
      const invoice = table.find((x: any) => x.id == 'invoice');
      const compensationOpinion = table.find(
        (x: any) => x.id == 'compensationOpinion'
      );
      const resolutionSat = table.find((x: any) => x.id == 'resolutionSat');
      foundInd.hide = true;

      if (
        this.programmingDetailPanel.status == 'RESTITUCION_BIENES' ||
        this.programmingDetailPanel.status == 'APROBAR_NO_ENT' ||
        this.programmingDetailPanel.status == 'FORMATO_RECLAMACION'
      ) {
        foundInd.hide = true;
      } else {
        typeRestitution.hide = true;
        replacementDate.hide = true;
      }

      if (Number(this.programmingDetailPanel.typeEvent) != 1) {
        commercialLot.hide = true;
        commercialEvent.hide = true;
        invoice.hide = true;
      }

      if (Number(this.programmingDetailPanel.typeEvent) != 3) {
        compensationOpinion.hide = true;
        resolutionSat.hide = true;
      }

      if (
        this.programmingDetailPanel.status == 'RESTITUCION_BIENES' ||
        this.programmingDetailPanel.status == 'APROBAR_NO_ENT' ||
        this.programmingDetailPanel.status == 'FORMATO_RECLAMACION'
      ) {
        const tablePegene = document.getElementById('tablePegene');
        const tbody = tablePegene.children[0].children[1].children;
        for (let index = 0; index < tbody.length; index++) {
          const element = tbody[index];
          const obser: any =
            element.children[16].children[0].children[0].children[0].children[0]
              .children[0].children[0].children[0];
          obser.disabled = true;
        }
      }
    }, 300);
  }

  updateProgrammingGoodDelivery(body: any) {
    return new Promise((resolve, reject) => {
      this.programmingService
        .updateProgrammingDeliveryGood(body.id, body)
        .subscribe({
          next: resp => {
            this.active = true;

            resolve(resp);
          },
          error: error => {
            reject(error);

            this.loadingEEB = false;
          },
        });
    });
  }

  selectRows(event: any) {
    /*const index = this.goodDeliveryArray.indexOf(event.data);

    const table = document.getElementById('table');
    const tbody = table.children[0].children[1].children;
    const ele: any = tbody[index];
    const cantEnt =
      ele.children[11].children[0].children[0].children[0].children[0]
        .children[0].children[0].children[0];
    cantEnt.disabled = true;*/

    this.goodDeliveredSelected = event.selected;
  }

  setamountDelivered(data: any) {
    this.goodDeliveryArray.map((item: any) => {
      if (item.id == data.row.id) {
        item.amountDelivered = data.data;
      }
    });
  }

  setamountNotDelivered(data: any) {
    this.goodDeliveryArray.map((item: any) => {
      if (item.id == data.row.id) {
        item.amountNotDelivered = data.data;
      }
    });
  }

  setanountNotAccelted(data: any) {
    this.goodDeliveryArray.map((item: any) => {
      if (item.id == data.row.id) {
        item.anountNotAccelted = data.data;
      }
    });
  }

  setamountNotWhithdrawn(data: any) {
    this.goodDeliveryArray.map((item: any) => {
      if (item.id == data.row.id) {
        item.amountNotWhithdrawn = data.data;
      }
    });
  }

  validateBeforeOpenModal(typeConstancy: number): any {
    //listo 1
    for (let index = 0; index < this.selectedRows.length; index++) {
      const item = this.selectedRows[index];
      const typeEvent = this.programmingDetailPanel.typeEvent;
      if (typeEvent === 1 && item.commercialEvent == null) {
        this.alert(
          'warning',
          'Advertencia',
          'El bien debe tener un evento comercial. Consulte a su administrador.'
        );

        return false;
      }

      let lsColumna = null;
      let lsColumnaTot = null;
      switch (+typeConstancy) {
        case 1:
          lsColumna = item.amountDelivered;
          lsColumnaTot = item.sunGoodEnt;
          break;
        case 2:
          lsColumna = item.amountNotDelivered;
          lsColumnaTot = item.sumGoodNoEnt;
          break;
        case 3:
          lsColumna = item.anountNotAccelted;
          lsColumnaTot = item.sumGoodNoAce;
          break;
        default:
          lsColumna = item.amountNotWhithdrawn;
          lsColumnaTot = item.sumGoodNoRet;
          break;
      }
      if (lsColumna <= 0) {
        this.alert(
          'warning',
          'Acción Invalida',
          `El bien ${item.goodId} tiene un valor menor o igual a cero`
        );
        return false;
      }

      if (lsColumna > item.faltante) {
        this.alert(
          'warning',
          'Acción Invalida',
          `El bien ${item.goodId} excede la cantidad permitida`
        );
        return false;
      }

      return true;
    }
  }

  getCertificateDelivery(params: ListParams) {
    this.loadingT2 = true;
    const progDeliveryId = this.programmingDetailPanel.id;
    params['filter.deliveryScheduleId'] = `$eq:${progDeliveryId}`;
    this.certifiDeliveryService.getAll(params).subscribe({
      next: (resp: any) => {
        const typeEvent = this.programmingDetailPanel.typeEvent;
        resp.data.map((item: any) => {
          const typeReceptor = item.receiverType;
          if (typeEvent == 1 && typeReceptor == 'CLIENTE') {
            item['identificator'] = item.clientIden;
            item['IdennNum'] = item.clientIdennNum;
            item['name'] = item.cliente;
          } else if (typeEvent != 1 && typeReceptor != 'CLIENTE') {
            item['identificator'] = item.repLegalIden;
            item['IdennNum'] = item.repLegalIdenNum;
            item['name'] = item.repLegal;
          }
        });
        this.constancyDeliveryArray = resp.data;
        this.constancyTotalItems = resp.count;
        this.displayCloseConstanceIcon();
        this.loadingT2 = false;
      },
      error: error => {
        if (error.status != 400) {
          this.alert(
            'error',
            'Error',
            'Ocurrio un error al cargar los certificados de constancia'
          );
        }
        this.loadingT2 = false;
        this.constancyDeliveryArray = [];
        this.constancyTotalItems = 0;
      },
    });
  }

  displayCloseConstanceIcon() {
    setTimeout(() => {
      const table = document.getElementById('table2');
      const tbody = table.children[0].children[1].children;
      for (let index = 0; index < tbody.length; index++) {
        const ele: any = tbody[index];
        const isclose = this.constancyDeliveryArray[index].closing;
        if (isclose != null && isclose != 'N') {
          ele.children[6].children[1].children[1].hidden = true;
        }
      }
    }, 300);
  }

  //aqui
  delivery(executionType: string, causa?: string) {
    if (executionType == 'entregados') {
      let constancyDelivered = this.constancyDeliveryArray.filter(
        item => item.certificateType === '1'
      );

      if (constancyDelivered.length < 1) {
        this.alert(
          'warning',
          'Advertencia',
          'Debes generar por lo menos una constancia de entrega'
        );
        return;
      }
    } else {
      let types = ['2', '3', '4'];
      let constancyNoDelivered = this.constancyDeliveryArray.filter(item =>
        types.includes(item.certificateType)
      );
      if (constancyNoDelivered.length < 1) {
        this.alert(
          'warning',
          'Advertencia',
          'Debes generar por lo menos una constancia de no entrega'
        );
        return;
      }
    }

    if (!this.selectedRows || this.selectedRows.length !== 1) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Debe tener un bien seleccionado para la ejecución de entrega'
      );
      return;
    }

    this.selectedRows.map((item: any) => {
      let colDestino = '';
      let lsColumna = null;
      let lsColumnaTot = '';
      if (executionType == 'entregados') {
        lsColumna = item.amountDelivered;
        colDestino = 'amountDelivered';
        lsColumnaTot = 'sunGoodEnt';
      } else {
        if (causa == 'NO ENTREGADOS') {
          lsColumna = item.amountNotDelivered;
          colDestino = 'amountNotDelivered';
          lsColumnaTot = 'sumGoodNoEnt';
        } else if (causa == 'NO ACEPTADOS') {
          lsColumna = item.anountNotAccelted;
          colDestino = 'anountNotAccelted';
          lsColumnaTot = 'sumGoodNoAce';
        } else {
          lsColumna = item.amountNotWhithdrawn;
          colDestino = 'amountNotWhithdrawn';
          lsColumnaTot = 'sumGoodNoRet';
        }
      }

      if (lsColumna < 1) {
        this.alert(
          'warning',
          'Acción Invalida',
          'El bien seleccionado tiene un valor menor o igual a cero'
        );
        return;
      }

      const totalAmount =
        Number(item.amountDelivered) +
        Number(item.amountNotDelivered) +
        Number(item.anountNotAccelted) +
        Number(item.amountNotWhithdrawn);

      if (totalAmount > item.faltante) {
        this.alert(
          'warning',
          'Acción Invalida',
          'El bien seleccionado excede la cantidad permitida'
        );
        return;
      }

      const total = Number(lsColumna);
      const body: any = {};
      body['id'] = item.id;
      body[colDestino] = total;
      body[lsColumnaTot] = Number(lsColumna);
      this.updateProgrammingGoodDelivery(body);
      this.alert(
        'success',
        'Acción Exitosa',
        'Se ha actualizado la cantidad de bienes'
      );
      this.getSchedulingDelivery();
    });
  }

  noDelivery(executionType: string) {
    if (!this.selectedRows || this.selectedRows.length > 1) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Debe tener un bien seleccionado para la ejecucide entrega'
      );
      return;
    }

    this.openTypeReason(executionType);
  }

  openTypeReason(executionType: string) {
    const typeEvent = this.programmingDetailPanel.typeEvent;
    let config: ModalOptions = {
      initialState: {
        typeEvent,
        callback: (next: boolean) => {
          if (next) {
          }
        },
      },
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModelRef = this.modalService.show(
      TypeDeliveryModelComponent,
      config
    );
    this.bsModelRef.content.event.subscribe((data: any) => {
      this.delivery(executionType, data.type);
    });
  }

  async exportCsv() {
    const filename: string = 'Bienes';
    const params = new ListParams();
    params.limit = 100;
    const goodsFile: any = await this.getAsyncProgrammingDeliveryGood(params);
    //type: 'csv',
    this.excelService.export(goodsFile, { filename });
  }

  getAsyncProgrammingDeliveryGood(params: ListParams) {
    return new Promise((resolve, reject) => {
      params[
        'filter.programmingDeliveryId'
      ] = `$eq:${this.programmingDetailPanel.id}`;

      this.programmingService.getProgrammingDeliveryGood(params).subscribe({
        next: (resp: any) => {
          resolve(resp.data);
        },
        error: error => {},
      });
    });
  }

  preview(event: any) {
    this.showReport(event);
  }

  close(event: any) {
    this.loadingT2 = true;
    let body: any = {};
    body.certificateId = event.certificateId;
    body.closing = 'Y';
    this.certifiDeliveryService.update(body).subscribe({
      next: resp => {
        const index = this.constancyDeliveryArray.indexOf(event);
        if (index != -1) {
          this.constancyDeliveryArray[index].closing = 'Y';
          this.constancyDeliveryArray = [...this.constancyDeliveryArray];
          //luego actualizar los botones
          this.displayCloseConstanceIcon();
        }
        this.alert('success', 'Constancia cerrada', 'La constancia se cerro');
        this.loadingT2 = false;
      },
      error: error => {
        this.alert('error', 'Error', 'No se pudo cerrar la constancia');
        this.loadingT2 = false;
      },
    });
  }

  selectConstance(event: any) {
    if (event.isSelected == false) {
      this.constanceSelected = {};
      return;
    }
    this.constanceSelected = event.data;
  }

  async finalizeDelivery() {
    let lbNoEnt: boolean = false;

    if (this.constancyDeliveryArray.length == 0) {
      this.alert(
        'warning',
        'Advertencia',
        'Debes generar por lo menos una constancia'
      );
      return;
    }

    const allClosed = this.constancyDeliveryArray.every(
      item => item.closing === 'Y'
    );

    if (!allClosed) {
      this.alert(
        'warning',
        'Advertencia',
        'Todas las constancias deben estar cerradas'
      );
      return;
    }

    const constDelivery: any = await this.getAllCertificates(new ListParams());

    if (constDelivery == true) {
      this.alert(
        'warning',
        'Advertencia',
        'Es necesario adjuntar un documento a las constancias'
      );

      return;
    }

    if (this.programmingDetailPanel.typeEvent == 4) {
      this.confirm();
    } else {
      this.alertQuestion(
        'question',
        'Enviar la programación',
        `¿Desea enviar la programación con folio: ${this.programmingDetailPanel.folio}?`
      ).then(async question => {
        if (question.isConfirmed) {
          let result = await this.closeTask();
          if (result) {
            this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
            this.alert(
              'success',
              'Entrega finalizada',
              `Se finalizo la entrega con el folio: ${this.programmingDetailPanel.folio}`
            );
          }
        }
      });
    }
  }

  haveDocuments() {
    return new Promise(async (resolve, reject) => {
      let noHaveField: number = 0;
      const constDelivery: any = await this.getAllCertificates(
        new ListParams()
      );

      constDelivery.data.map(async (item: any, _i: number) => {
        const index = _i + 1;
        const param = new ListParams();
        param['filter.certificateId'] = `$eq:${item.certificateId}`;
        const certifyGood: any = await this.getConstancyGood(param);
        /*this.doSomthing(certifyGood)
          .then((result:any) => {
          })*/

        certifyGood.data.map(async (item2: any) => {
          const body: any = {};
          body.xidBien = item2.goodId;
          body.xtipoDocumento = 19;
          const fields: any = await this.getDocumentConstance(body);

          const have = fields.data.filter((x: any) => {
            return Number(x.xtipoDocumento) == 19;
          });
          noHaveField = have.length == 0 ? noHaveField + 1 : noHaveField;
        });
        if (constDelivery.data.length == index) {
          resolve(noHaveField);
        }
      });
    });
  }

  getAllCertificates(params: ListParams) {
    return new Promise((resolve, reject) => {
      const progDeliveryId = this.programmingDetailPanel.id;
      params['filter.deliveryScheduleId'] = `$eq:${progDeliveryId}`;
      this.certifiDeliveryService
        .getAll(params)
        .pipe(
          catchError((e: any) => {
            if (e.status == 400) return of({ data: [], count: 0 });
            throw e;
          })
        )
        .subscribe({
          next: resp => {
            resolve(resp);
          },
        });
    });
  }

  getAllProgramminDeliveryGoods(params: ListParams) {
    return new Promise((resolve, reject) => {
      params[
        'filter.programmingDeliveryId'
      ] = `$eq:${this.programmingDetailPanel.id}`;
      this.programmingService.getProgrammingDeliveryGood(params).subscribe({
        next: (resp: any) => {
          resolve(resp.data);
        },
      });
    });
  }

  getConstancyGood(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.certifiGoodsService.getAll(params).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  getDocumentConstance(body: any) {
    //5319436
    return new Promise((resolve, reject) => {
      this.wcontet.getDocumentos(body).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  photos() {
    let typeDoc = null;
    let nomProcess = null;

    if (
      this.programmingDetailPanel.status == 'RESTITUCION_BIENES' ||
      this.programmingDetailPanel.status == 'APROBAR_NO_ENT'
    ) {
      this.goodRestSelected = this.progGoodNoDeliveredSelected;
    }
    if (!this.goodRestSelected) {
      this.alert('warning', 'Advertencia', 'Debe tener un bien seleccionado');
      return;
    }

    if (this.programmingDetailPanel.status == 'PROGRAMACION_EJECUTADA') {
      typeDoc = 209;
      nomProcess = 'Aprobar RestituciEspecie';
    } else if (this.programmingDetailPanel.status == 'VERIFICACION_BIENES') {
      typeDoc = 208;
      nomProcess = 'RestituciBienes';
    } else {
      typeDoc = 209;
      nomProcess = 'Bienes No Entregados';
    }
    const newDocument = this.modalService.show(PhotosConstanceModalComponent, {
      initialState: {
        //certificate: this.constanceSelected,
        progGood: this.goodRestSelected,
        typeDoc: typeDoc,
        nomProcess: nomProcess,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  selectGoodTypeRestRows(event: any) {
    if (event.isSelected == false) {
      this.goodRestSelected = [];
      return;
    }
    this.goodRestSelected = event.data;
  }

  approvedSelected(event: any) {
    event.toggle.subscribe(async (data: any) => {
      this.loadingEEB = true;
      const body: any = {};
      body.id = data.row.id;
      body.approveEnEsp = event.toggle == true ? 'Y' : 'N';
      const updated = await this.updateProgrammingGoodDelivery(body);
      if (updated) {
        this.loadingEEB = false;
      }
    });
  }

  setObservations(event: any) {
    if (event.data && Object.keys(event.data).length > 0) {
      const idx = this.goodDeliveryFieldSelected.indexOf(event.data);
      if (this.goodDeliveryFieldSelected.length == 0 || idx == -1) {
        this.goodDeliveryFieldSelected.push(event.data);
        this.active = true;
      } else {
        this.goodDeliveryFieldSelected[idx] = event.data;
      }
      this.active = true;
    }
  }

  setCauseNotDelivered(event: any) {
    console.log(event);
    if (event.text != null && event.text != '') {
      const index = this.goodDeliveryFieldSelected.indexOf(event.row);
      if (this.goodDeliveryFieldSelected.length == 0 || index == -1) {
        this.goodDeliveryFieldSelected.push(event.row);
        this.active = true;
      } else {
        this.goodDeliveryFieldSelected[index] = event.row;
      }
    }
  }

  setTypeRestitution(event: any) {
    if (event.text != null && event.text != '') {
      const index = this.goodDeliveryFieldSelected.indexOf(event.row);
      if (this.goodDeliveryFieldSelected.length == 0 || index == -1) {
        this.goodDeliveryFieldSelected.push(event.row);
      } else {
        this.goodDeliveryFieldSelected[index] = event.row;
      }
    }
  }

  setReplacementDate(event: any) {
    const index = this.goodDeliveryFieldSelected.indexOf(event.row);
    if (
      (this.goodDeliveryFieldSelected.length == 0 || index == -1) &&
      event.text != null
    ) {
      this.goodDeliveryFieldSelected.push(event.row);
    } else {
      this.goodDeliveryFieldSelected[index] = event.row;
    }
  }

  save() {
    if (this.programmingDetailPanel.status == 'BIENES_NO_ENTREGADOS') {
      if (this.goodDeliveryFieldSelected.length == 0) {
        this.alert(
          'warning',
          'Advertencia',
          'Debes realizar cambios de observaciones'
        );
        return;
      }
      let list: any = [];
      for (
        let index = 0;
        index < this.goodDeliveryFieldSelected.length;
        index++
      ) {
        const good = this.goodDeliveryFieldSelected[index];
        const body: any = {};
        for (const key in good) {
          if (good[key] != null) {
            body[key] = good[key];
          }
        }
        delete body.programingdelivery;
        delete body.faltante;
        list.push(body);
      }

      if (list.length == 0) return;
      list.map(async (item: any, _i: number) => {
        const index = _i + 1;

        const updated = await this.updateProgrammingGoodDelivery(item);
        if (list.length == index) {
          this.goodDeliveryFieldSelected = [];
          this.getProgrammingGoodDelivery(new ListParams());
          this.alert('success', 'Actualizado', 'Se han actualizado los bienes');
        }
      });
    } else {
      let infoProgramming = {
        id: this.programmingDetailPanel.id,
      };
      this.programmingRequestService
        .updateProgrammingDelivery(
          this.programmingDetailPanel.id,
          infoProgramming
        )
        .subscribe({
          next: async response => {
            this.alert(
              'success',
              'Actualizado',
              'Se han actualizado los bienes'
            );
          },
          error: () => {},
        });
    }
  }

  selectGoodNoDelivered(event: any) {
    this.progDeliveNoDSelectAll = false;
    if (this.tablePEGNE.isAllSelected == true && event.isSelected == null) {
      this.progDeliveNoDSelectAll = true;
    } else if (
      this.tablePEGNE.isAllSelected == true &&
      event.isSelected != null
    ) {
      this.progDeliveNoDSelectAll = false;
      this.tablePEGNE.isAllSelected = false;
    }

    this.progGoodNoDeliveredSelected = event.selected;
  }

  entryOrder() {
    let error = false;
    if (this.progGoodNoDeliveredSelected.length == 0) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Debes seleccionar al menos un bien'
      );
      return;
    }
    for (
      let index = 0;
      index < this.progGoodNoDeliveredSelected.length;
      index++
    ) {
      const good = this.progGoodNoDeliveredSelected[index];

      if (!good.typeRestitution) {
        this.alert(
          'warning',
          'Acción Invalida',
          'El bien ' +
            good.goodId +
            '-' +
            good.inventoryNumber +
            ' debe tener asignado un tipo de restitución'
        );
        error = true;
        break;
      }

      if (good.typeRestitution != 'NUMERARIO') {
        const msg = `El tipo de restitución del bien ${good.goodId}-${good.inventoryNumber} debe ser numerario`;
        this.alert('warning', 'Acción Invalida', msg);
        error = true;
        break;
      }
    }

    if (error == true) {
      return;
    }

    let config = {
      initialState: {
        goods: this.progGoodNoDeliveredSelected,
        callback: next => {
          if (next) {
            // Do something
          }
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModelRef = this.modalService.show(EntryOrderModalComponent, config);
  }

  sendApproval() {
    if (this.programmingDetailPanel.status === 'FORMATO_RECLAMACION') {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se debe firmar el formato de reclamación para los bienes clasificados como dañados o faltantes'
      );
    }
    let error = false;
    if (this.progGoodNoDeliveredSelected.length == 0) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Debe tener al menos un bien seleccionado'
      );
      return;
    }
    for (
      let index = 0;
      index < this.progGoodNoDeliveredSelected.length;
      index++
    ) {
      const good = this.progGoodNoDeliveredSelected[index];

      if (!good.typeRestitution) {
        this.alert(
          'warning',
          'Acción Invalida',
          'El bien ' +
            good.goodId +
            '-' +
            good.inventoryNumber +
            ' debe tener una restitución en especie'
        );
        error = true;
        break;
      }

      if (good.typeRestitution != 'EN_ESPECIE') {
        const msg = `El bien ${good.goodId}-${good.inventoryNumber} debe tener una restitución en especie`;
        this.alert('warning', 'Acción Invalida', msg);
        error = true;
        break;
      }
    }

    if (error == true) {
      return;
    }

    Swal.fire({
      title: 'Confirmación',
      html: '&#191; Estas seguro que deseas enviar los bienes seleccionado a aprobación?',
      icon: undefined,
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#B38E5D',
      confirmButtonText: 'Enviar',
    }).then(result => {
      if (result.isConfirmed) {
        this.goodParams.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
          if (this.programmingDetailPanel.id) {
            this.getProgrammingGoodDelivery(data);
          }
        });
        this.sentApprovalTask();
      }
    });
  }

  sentApprovalTask() {
    let goodEsp = this.progGoodNoDeliveredSelected;
    let statusAut: string = this.programmingDetailPanel.statusAut;

    if (statusAut == 'SIN_BIENES') {
      let infoProgramming = {
        id: this.programmingDetailPanel.id,
        status: 'APROBAR_NO_ENT',
        statusAut: 'BIENES_PEND_AUT',
      };

      this.programmingRequestService
        .updateProgrammingDelivery(
          this.programmingDetailPanel.id,
          infoProgramming
        )
        .subscribe({
          next: async response => {},
          error: () => {},
        });
    }

    try {
      goodEsp.map(async (item: IProgrammingDeliveryGood, _i: number) => {
        const index = _i + 1;

        let data = {
          id: item.id,
          typeRestitution: item.typeRestitution,
          approveEnEsp: 'N',
          status: 'PENDIENTE_APROBACION',
          replacementDate: item.replacementDate,
        };

        const updateGood = await this.updateProgrammingGoodDelivery(data);
        if (goodEsp.length == index) {
          this.alert(
            'success',
            'Bienes enviados',
            'Los bienes fueron enviados a aprobación'
          );
          return;
        }
      });
    } catch (error) {}
  }

  claimmingForm() {
    this.configuraModalFirma();
  }

  updateTask(id, body) {
    return new Promise((resolve, reject) => {
      this.taskService.update(id, body).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {},
      });
    });
  }

  configuraModalFirma() {
    const formOnly = true;
    const nameSignatoryRuling = this.taskInfo.participantName;
    const postSignatoryRuling = this.taskInfo.ownerRole;
    const typeSign = this.taskInfo.componentName;
    const typeAnnex = 'sign-annexJ-assets-classification';

    let config: ModalOptions = {
      initialState: {
        //requestId: this.programmingId,
        //reportId: '218',
        //idSample: this.programmingId,
        //contentId: '',
        // typeAnnex: typeAnnex,
        nameSignatoryRuling,
        postSignatoryRuling,
        typeSign,
        formOnly,
        callback: async (name, charge, typeSign) => {
          this.taskInfo.ownerRole = charge;
          this.taskInfo.participantName = name;
          this.taskInfo.componentName = typeSign;

          console.log(name, charge, typeSign);
          this.updateTask(this.taskInfo.id, {
            ownerRole: charge,
            participantName: name,
            componentName: typeSign,
          });

          this.openFirma(name, charge, typeSign);
          //Actualizar la orden de servicio con los datos de la firma
          //this.updateOrderService(responsibleSae, saePosition, typeSign);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeSignatureModalComponent, config);
  }

  async openFirma(name, charge, typeSign) {
    let token = this.authService.decodeToken();
    let today = new Date();

    let idTypeDoc = '218';
    let readOnly = false;

    const typeAnnex = 'approval-request';
    const requestInfo = { id: this.programmingId, type: 'programming' };
    const idReportAclara = this.programmingId;
    const nameTypeDoc = 'AnexoJ';
    const nomenglatura = '';

    const nameDoc = 'formato_reclamacion';
    const userName = name;
    const chargeUser = charge;
    const numSignature = 1;
    const idProg = this.programmingDetailPanel.id;
    const process = typeSign;

    //const readOnly = this.requestInfo.detail.version == "1";

    let config: ModalOptions = {
      initialState: {
        nameDoc,
        userName,
        chargeUser,
        numSignature,
        folio: this.programmingDetailPanel.folio,
        process,
        idReportAclara,
        idTypeDoc,
        typeAnnex,
        requestInfo,
        nameTypeDoc,
        nomenglatura,
        readOnly,
        callback: (next, xml) => {
          //this.updateInfo = !this.updateInfo;
          if (next) {
            //this.updateReport(xml);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modalService.show(EntregaSignatureModalComponent, config);
  }

  changeTypeRestitucion(tipoRest: string) {
    if (this.progGoodNoDeliveredSelected.length == 0) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Debes seleccionar al menos un bien'
      );
      return;
    }

    if (this.progDeliveNoDSelectAll == true) {
      this.loadingPENE = true;
      const id = this.programmingDetailPanel.id;
      const body = { typeRestitution: tipoRest };
      this.programmingService
        .updateAllProgrammingDeliveryGoodByIdDeliverySchedule(id, body)
        .subscribe({
          next: resp => {
            this.alert(
              'success',
              'Actualizado',
              'La clasificación fue exitosa'
            );
            this.loadingPENE = false;
            this.progGoodNoDeliveredSelected = [];
            this.getProgrammingGoodDelivery(new ListParams());
          },
          error: error => {
            this.loadingPENE = false;
          },
        });
    } else {
      this.loadingPENE = true;
      this.progGoodNoDeliveredSelected.map(
        async (item: IProgrammingDeliveryGood, _i: number) => {
          const index = _i + 1;
          const body: any = { id: item.id, typeRestitution: tipoRest };

          const updated = await this.updateProgrammingGoodDelivery(body);
          if (this.progGoodNoDeliveredSelected.length == index) {
            this.alert(
              'success',
              'Actualizado',
              'La clasificación fue exitosa'
            );

            this.loadingPENE = false;
            this.progGoodNoDeliveredSelected = [];

            this.getProgrammingGoodDelivery(new ListParams());
            return;
          }
        }
      );
    }
  }

  async finalizeClassify() {
    let msg = '';
    let title = '';
    let status = '';
    if (this.programmingDetailPanel.status === 'BIENES_NO_ENTREGADOS') {
      msg =
        'Desea enviar la clasificación de los bienes no entregados para la programación con folio';
      status = 'VERIFICACION_BIENES';
      title =
        'Aprobar solicitud para la restitución de los bienes de la programación';
    } else if (
      this.programmingDetailPanel.status === 'RESTITUCION_BIENES' ||
      this.programmingDetailPanel.status === 'APROBAR_NO_ENT' ||
      this.programmingDetailPanel.status === 'FORMATO_RECLAMACION'
    ) {
      if (this.programmingDetailPanel.status != 'FORMATO_RECLAMACION') {
        this.alert(
          'warning',
          'Advertencia',
          'Se debe firmar el formato de reclamación para los bienes clasificados como dañados o faltantes'
        );
      } else {
        this.finishTask();
      }
      return;
    }

    let result = await this.getGoods();
    if (!result) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe agregar una causa y observación a todos los bienes'
      );
      return;
    }

    this.alertQuestion(
      'question',
      'Finalizar Clasificación',
      `¿${msg} ${this.programmingDetailPanel.folio}?`
    ).then(async question => {
      if (question.isConfirmed) {
        if (this.programmingDetailPanel) {
          const infoProgramming: IprogrammingDelivery = {
            id: this.programmingDetailPanel.id,
            status: status,
          };

          this.programmingRequestService
            .updateProgrammingDelivery(
              this.programmingDetailPanel.id,
              infoProgramming
            )
            .subscribe({
              next: response => {},
              error: error => {},
            });
          this.loading = true;
          this.programmingId = this.programmingDetailPanel.id;
          const user: any = this.authService.decodeToken();

          let body: any = {};

          body['type'] = 'SOLICITUD_PROGRAMACION';
          body['subtype'] = 'Programar_Recepcion';
          body['ssubtype'] = 'TURNAR';

          let task: any = {};
          task['id'] = 0;
          task['assignees'] = user.username;
          task['assigneesDisplayname'] = user.nameUser;
          task['creator'] = user.username;
          task['reviewers'] = user.username;
          task['taskNumber'] = Number(this.programmingId);
          task['title'] = title + ' ' + this.programmingDetailPanel.folio;
          task['programmingId'] = this.programmingId;
          task['requestId'] = this.programmingId;
          task['expedientId'] = 0;
          task['idDelegationRegional'] = this.programmingDetailPanel.delRegId;
          task['urlNb'] =
            'pages/request/scheduling-deliveries/execute-schelude-delivery';
          task['processName'] = 'SolicitudProgramacion';
          body['task'] = task;
          const taskResult = await this.createTaskOrderService(body);
          this.loading = false;
          if (taskResult) {
            let result = await this.closeTask();
            if (result) {
              this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
              this.alert(
                'success',
                'Creación de Tarea Correcta',
                `Se creó la tarea Realizar Programación con el folio: ${this.programmingId}`
              );
            }
          }
        }
      }
    });
  }

  finalizeVerify() {
    /**
     * mustraPopClasificaNoEntrega()
     */
    window.alert('No se implento la funcion');
  }

  async getGoods(): Promise<boolean> {
    let params = new ListParams();
    params[
      'filter.programmingDeliveryId'
    ] = `$eq:${this.programmingDetailPanel.id}`;
    return new Promise(resolve => {
      this.programmingService.getProgrammingDeliveryGood(params).subscribe({
        next: (resp: any) => {
          let allHaveCauseAndObservation = resp.data.every(
            (item: any) => item.causeNotDelivered && item.observation
          );
          resolve(allHaveCauseAndObservation);
        },
      });
    });
  }

  async getApproves(): Promise<boolean> {
    let params = new ListParams();
    params[
      'filter.programmingDeliveryId'
    ] = `$eq:${this.programmingDetailPanel.id}`;
    return new Promise(resolve => {
      this.programmingService.getProgrammingDeliveryGood(params).subscribe({
        next: (resp: any) => {
          let atLeastOneHasN = resp.data.some(
            (item: any) => item.approveEnEsp === 'N'
          );
          resolve(atLeastOneHasN);
        },
      });
    });
  }

  async sendApprove() {
    let result = await this.getApproves();

    if (!result) {
      this.alert('warning', 'Advertencia', 'Debe aprobar al menos un bien');
      return;
    }

    let title = '';
    let status = '';
    if (this.programmingDetailPanel.status == 'PROGRAMACION_EJECUTADA') {
      title =
        'Clasificación de bienes no entregados para la programación. ' +
        this.programmingDetailPanel.folio;
      status = 'BIENES_NO_ENTREGADOS';
    } else if (this.programmingDetailPanel.status == 'VERIFICACION_BIENES') {
      title =
        'Restitución de bienes dañados y faltantes para la programación' +
        this.programmingDetailPanel.folio;
      status = 'RESTITUCION_BIENES';
    }
    this.alertQuestion(
      'question',
      'Turnar Solicitud',
      `¿Desea enviar la aprobación de los bienes en especie para la programación con folio ${this.programmingDetailPanel.folio}?`
    ).then(async question => {
      if (question.isConfirmed) {
        if (this.programmingDetailPanel) {
          const infoProgramming: IprogrammingDelivery = {
            id: this.programmingDetailPanel.id,
            status: status,
          };

          this.programmingRequestService
            .updateProgrammingDelivery(
              this.programmingDetailPanel.id,
              infoProgramming
            )
            .subscribe({
              next: response => {},
              error: error => {},
            });
          this.loading = true;
          this.programmingId = this.programmingDetailPanel.id;
          const user: any = this.authService.decodeToken();

          let body: any = {};

          body['type'] = 'SOLICITUD_PROGRAMACION';
          body['subtype'] = 'Programar_Recepcion';
          body['ssubtype'] = 'TURNAR';

          let task: any = {};
          task['id'] = 0;
          task['assignees'] = user.username;
          task['assigneesDisplayname'] = user.nameUser;
          task['creator'] = user.username;
          task['reviewers'] = user.username;
          task['taskNumber'] = Number(this.programmingId);
          task['title'] = title;
          task['programmingId'] = this.programmingId;
          task['requestId'] = this.programmingId;
          task['expedientId'] = 0;
          task['idDelegationRegional'] = this.programmingDetailPanel.delRegId;
          task['urlNb'] =
            'pages/request/scheduling-deliveries/execute-schelude-delivery';
          task['processName'] = 'SolicitudProgramacion';
          body['task'] = task;
          const taskResult = await this.createTaskOrderService(body);
          this.loading = false;
          if (taskResult) {
            let result = await this.closeTask();
            if (result) {
              this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
              this.alert(
                'success',
                'Creación de Tarea Correcta',
                `Se creó la tarea Realizar Programación con el folio: ${this.programmingId}`
              );
            }
          }
        }
      }
    });
  }

  selectedRows;
  goodsSelect(goodSelect: IGoodInvAvailableView[]) {
    this.selectedRows = goodSelect;
  }

  showDocuments(): void {
    if (isNullOrEmpty(this.selectedRows)) {
      this.alert('warning', 'Acción Invalida', 'Se debe seleccionar un bien ');
    } else {
      if (this.selectedRows.length == 0 || this.selectedRows.length >= 2) {
        this.alert(
          'warning',
          'Acción Invalida',
          'Se debe seleccionar un bien '
        );
      } else {
        const idGood = this.selectedRows[0].id;
        const idRequest = 0;
        let config: ModalOptions = {
          initialState: {
            idGood,
            idRequest,
            parameter: '',
            typeDoc: 'expedient',
            callback: (next: boolean) => {
              //if(next) this.getExample();
            },
          },
          class: `modalSizeXL modal-dialog-centered`,
          ignoreBackdropClick: true,
        };
        this.modalService.show(ShowDocumentsGoodComponent, config);
      }
    }
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Turnar Solicitud',
      `¿Desea enviar la programación con folio: ${this.programmingDetailPanel.folio}?`
    ).then(async question => {
      if (question.isConfirmed) {
        if (this.programmingDetailPanel) {
          const infoProgramming: IprogrammingDelivery = {
            id: this.programmingDetailPanel.id,
            status: 'PROGRAMACION_EJECUTADA',
          };

          this.programmingRequestService
            .updateProgrammingDelivery(
              this.programmingDetailPanel.id,
              infoProgramming
            )
            .subscribe({
              next: response => {},
              error: error => {},
            });
          this.loading = true;
          this.programmingId = this.programmingDetailPanel.id;
          const user: any = this.authService.decodeToken();

          let body: any = {};

          body['type'] = 'SOLICITUD_PROGRAMACION';
          body['subtype'] = 'Programar_Recepcion';
          body['ssubtype'] = 'TURNAR';

          let task: any = {};
          task['id'] = 0;
          task['assignees'] = user.username;
          task['assigneesDisplayname'] = user.nameUser;
          task['creator'] = user.username;
          task['reviewers'] = user.username;
          task['taskNumber'] = Number(this.programmingId);
          task['title'] =
            'Aprobar solicitud para la restitución de bienes de la programación ' +
            this.programmingDetailPanel.folio;
          task['programmingId'] = this.programmingId;
          task['requestId'] = this.programmingId;
          task['expedientId'] = 0;
          task['idDelegationRegional'] = this.programmingDetailPanel.delRegId;
          task['urlNb'] =
            'pages/request/scheduling-deliveries/execute-schelude-delivery';
          task['processName'] = 'SolicitudProgramacion';
          body['task'] = task;
          const taskResult = await this.createTaskOrderService(body);
          this.loading = false;
          if (taskResult) {
            let result = await this.closeTask();
            if (result) {
              this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
              this.alert(
                'success',
                'Creación de Tarea Correcta',
                `Se creó la tarea Realizar Programación con el folio: ${this.programmingId}`
              );
            }
          }
        }
      }
    });
  }

  closeTask() {
    return new Promise((resolve, reject) => {
      const taskForm: ITask = {
        State: 'FINALIZADA',
        taskDefinitionId: null,
      };
      this.taskService.update(this.taskInfo.id, taskForm).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {},
      });
    });
  }

  finishTask() {
    this.alertQuestion(
      'question',
      'Turnar Solicitud',
      `¿Desea finalizar la programación con folio: ${this.programmingDetailPanel.folio}?`
    ).then(async question => {
      if (question.isConfirmed) {
        if (this.programmingDetailPanel) {
          const infoProgramming: IprogrammingDelivery = {
            id: this.programmingDetailPanel.id,
            status: 'PROGRAMACION_CERRADA',
          };

          this.programmingRequestService
            .updateProgrammingDelivery(
              this.programmingDetailPanel.id,
              infoProgramming
            )
            .subscribe({
              next: response => {},
              error: error => {},
            });
          this.loading = true;
          this.programmingId = this.programmingDetailPanel.id;
          const user: any = this.authService.decodeToken();

          const taskResult: any = await this.closeTask();
          this.loading = false;
          if (taskResult) {
            this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
            this.alert(
              'success',
              'Se finalizó la tarea correctamente',
              `Se finalizo la tarea Realizar Programación con el folio: ${this.programmingDetailPanel.folio}`
            );
          }
        }
      }
    });
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

  showReport(data: any) {
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-xl modal-dialog-centered',
    };
    config.initialState = {
      idprogDel: data.certificateId,
      typeEvent: this.programmingDetailPanel.typeEvent,
      report: data.certificateType,
      callback: (next: boolean) => {
        if (next) {
          //this.showReportDestruction();
        }
      },
    };

    this.modalService.show(ShowSchedulingReportComponentComponent, config);
  }

  getTask() {
    const task = JSON.parse(localStorage.getItem('Task'));

    const param = new FilterParams();
    param.addFilter('id', task.id);
    const filter = param.getParams();

    return new Promise((resolve, reject) => {
      this.taskService.getAll(filter).subscribe({
        next: resp => {
          if (resp.data.length > 0) {
            resolve(resp.data[0]);
          } else {
            reject(false);
          }
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }
}
