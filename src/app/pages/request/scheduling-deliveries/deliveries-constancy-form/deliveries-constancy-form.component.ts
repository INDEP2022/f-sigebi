import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProgrammingDeliveryGood } from 'src/app/core/models/good-programming/programming-delivery-good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { NonDeliveryReasonService } from 'src/app/core/services/catalogs/non-delivery-reason.service';
import { CertificatesDeliveryService } from 'src/app/core/services/ms-delivery-constancy/certificates-delivery.service';
import { CertificatesGoodsService } from 'src/app/core/services/ms-delivery-constancy/certificates-goods.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ShowSchedulingReportComponentComponent } from '../execute-scheduling-deliveries/show-scheduling-report-component/show-scheduling-report-component.component';
import { PERSONAL_ESTATE_COLUMNS } from './personal-estate-columns';

const typeContances: any = [
  {
    id: 1,
    name: 'Entregados',
    noId: 'siEnt',
  },
  {
    id: 2,
    name: 'No Entregados',
    noId: 'siNoEnt',
  },
  {
    id: 3,
    name: 'No Aceptado',
    noId: 'siNoAce',
  },
  {
    id: 4,
    name: 'No Retirados',
    noId: 'siNoRet',
  },
];
@Component({
  selector: 'app-deliveries-constancy-form',
  templateUrl: './deliveries-constancy-form.component.html',
  styleUrls: ['./deliveries-constancy.scss'],
})
export class DeliveriesConstancyFormComponent
  extends BasePage
  implements OnInit
{
  @ViewChild('table', { static: false }) table: any;
  typeConstancy: number = null;
  goods: IProgrammingDeliveryGood[] = [];
  regDele: number = null;
  progEntrega: any = null;
  constanceForm?: any = null;
  deliveryConstancyForm: FormGroup = new FormGroup({});
  showClientForm: boolean = true;
  personalEstates: boolean = true;
  showAdminJuridico: boolean = true;
  showRepLegar: boolean = true;
  showWitness: boolean = true;
  edit: boolean = false;
  personalEstateData: any[] = [];
  typeEvent: number = null;

  data: any = {};

  listTypeConstances = new DefaultSelect();
  typeReceptor: string = '';
  lsColumna: string = '';
  lsColumnaTot: string = '';

  selectEntity = new DefaultSelect();
  selectReasonNoAcep = new DefaultSelect();
  selectReasonNoDelive = new DefaultSelect();
  selectReasonNoWithdrawn = new DefaultSelect();

  goodSelected: any = {};
  btnTitle: string = 'Guardar';
  blockButtons: boolean = false;
  public event: EventEmitter<any> = new EventEmitter();

  private programmingGoodService = inject(ProgrammingGoodService);
  private certifiDeliveryService = inject(CertificatesDeliveryService);
  private certifiGoodsService = inject(CertificatesGoodsService);
  private auth = inject(AuthService);
  private goodService = inject(GoodService);
  private programmingService = inject(ProgrammingGoodService);

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationStateService: DelegationStateService,
    private nonDeliveryReasonsService: NonDeliveryReasonService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
    };
  }

  ngOnInit(): void {
    this.settings.columns = PERSONAL_ESTATE_COLUMNS;
    this.prepareForm();
    this.getReasons();
    this.regDele = this.progEntrega.delRegId;
    this.listTypeConstances = new DefaultSelect(
      typeContances,
      typeContances.length
    );
    this.isEdit();
    this.personalEstateData = []; // Limpia los datos existentes
    this.personalEstateData = [...this.goods]; // Asigna una copia de this.goods a this.personalEstateData
    setTimeout(() => {
      this.setColumns();
      this.validateClientSeccion();
    }, 300);
  }

  getReasons() {
    const params = new ListParams();
    this.getReasonNotDelivery(params);
    this.getReasonNotAccepted(params);
    this.getReasonNotWithdrawn(params);
  }

  prepareForm() {
    this.deliveryConstancyForm = this.fb.group({
      certificateId: [null],
      receiverType: ['CLIENTE'],
      certificateType: [this.typeConstancy],
      //linea 38 - 68
      publicDeed: [null],
      writedate: [null],
      adjudicator: [null],
      publicNotary: [null],
      cveState: [null],
      //linea 65 - 112
      transport: [null],
      marck: [null],
      model: [null],
      plates: [null],
      serie: [null],
      driverName: [null],
      oficioNum: [null],
      oficioDate: [null],
      //linea 114 -
      acreditPerson: [null],

      //
      virtue: [null],
      reasonsNotAccepted: [null],
      reasonsNotDelivered: [null],
      reasonsNotRetired: [null],

      teName: [null],
      tePosition: [null],

      clientIden: [null],
      clientIdennNum: [null],
      procClientIdennNum: [null, [Validators.pattern(STRING_PATTERN)]],
      repLegal: [null, [Validators.pattern(STRING_PATTERN)]],
      repLegalPosition: [null, [Validators.pattern(STRING_PATTERN)]],
      repLegalIden: [null],
      repLegalIdenNum: [null],
      repLegalIdenProg: [null, [Validators.pattern(STRING_PATTERN)]],
      //
      companyName: [null],
      positionCompany: [null],
      //
      deliveryName: [null],
      postDelivery: [null],
      deliveryIden: [null],
      deliveryNum: [null],
      deliveryProcIden: [null],
      //
      witnessName1: [null],
      witnessName2: [null],
      authorizeReceive: [null],
      certifiesPersonality: [null],
      oicParticipates: [null],
      oicName: [null],
      oicCall: [null],
      //
      closing: [null],
    });
    this.typeReceptor = this.deliveryConstancyForm.get('receiverType').value;
  }

  isEdit() {
    if (this.edit == true) {
      this.btnTitle = 'Actualizar';

      this.certifiDeliveryService
        .getById(this.constanceForm.certificateId)
        .subscribe({
          next: resp => {
            this.data = resp;
            this.setFormValues(resp);
          },
          error: error => {
            this.onLoadToast(
              'error',
              'No se pudo crear la constancia de entrega'
            );
          },
        });

      const certiType = this.constanceForm.certificateType;
      this.typeConstancy = +certiType;
      this.deliveryConstancyForm.controls['certificateType'].setValue(
        Number(certiType)
      );
      this.getCertificateGood();
    }
  }

  validateClientSeccion(): boolean {
    if (
      this.typeEvent != 1 ||
      (this.typeEvent == 1 &&
        this.typeConstancy != 4 &&
        this.typeReceptor == 'CLIENTE')
    ) {
      return true;
    }
    return false;
  }

  typeUser(event: Event): string {
    this.typeReceptor = this.deliveryConstancyForm.get('receiverType').value;
    if (this.typeReceptor == 'REP_LEGAL') {
      this.getState(new ListParams());
    } else {
      this.selectEntity = new DefaultSelect();
      this.deliveryConstancyForm.get('cveState').setValue(null);
    }
    return (event.target as HTMLInputElement).value;
  }

  setColumns() {
    //
    const table = this.table.grid.getColumns();
    const type1 = table.find((x: any) => x.id == 'amountDelivered');
    type1.hide = true;

    const type2 = table.find((x: any) => x.id == 'amountNotDelivered');
    type2.hide = true;

    const type3 = table.find((x: any) => x.id == 'anountNotAccelted');
    type3.hide = true;

    const type4 = table.find((x: any) => x.id == 'amountNotWhithdrawn');
    type4.hide = true;

    switch (this.typeConstancy) {
      case 1: //amountDelivered
        this.lsColumna = 'amountDelivered';
        this.lsColumnaTot = 'sunGoodEnt';
        break;
      case 2:
        this.lsColumna = 'amountNotDelivered';
        this.lsColumnaTot = 'sumGoodNoEnt';
        break;
      case 3:
        this.lsColumna = 'anountNotAccelted';
        this.lsColumnaTot = 'sumGoodNoAce';
        break;
      default:
        this.lsColumna = 'amountNotWhithdrawn';
        this.lsColumnaTot = 'sumGoodNoRet';
        break;
    }

    const column = table.find((x: any) => x.id == this.lsColumna);
    column.hide = false;
  }

  getState(params: ListParams) {
    params.page = 1;
    params.limit = 10;
    params['filter.regionalDelegation'] = `$eq:${this.regDele}`;
    this.delegationStateService.getAll(params).subscribe({
      next: data => {
        const stateCode = data.data
          .map((x: any) => {
            if (x.stateCode != null) {
              return x.stateCode;
            }
          })
          .filter(x => x != undefined);

        this.selectEntity = new DefaultSelect(stateCode, stateCode.length);
      },
      error: error => {},
    });
  }

  async confirm() {
    this.blockButtons = true;
    if (this.edit == false) {
      this.create();
    } else {
      this.update();
    }
  }

  showReport(data: any) {
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-xl modal-dialog-centered',
    };
    config.initialState = {
      idprogDel: data.certificateId,
      typeEvent: this.typeEvent,
      report: data.certificateType,
      callback: (next: boolean) => {
        if (next) {
          //this.showReportDestruction();
        }
      },
    };

    this.modalService.show(ShowSchedulingReportComponentComponent, config);
  }

  generateUniqueNumber() {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const millisecond = date.getMilliseconds();

    const uniqueNumber =
      hour * 10000 + minute * 100 + second + millisecond / 10;

    return Math.floor(uniqueNumber);
  }

  async create() {
    let idProgDelivery = this.progEntrega.id;
    let folio = this.progEntrega.folio;
    let userAuth = this.auth.decodeToken();

    let cause = '';
    if (!this.deliveryConstancyForm.get('reasonsNotDelivered').value) {
      cause = 'Faltante';
    } else {
      cause = 'Dañado';
    }
    if (this.deliveryConstancyForm.get('reasonsNotDelivered').value) {
      let selectedId = this.deliveryConstancyForm.get(
        'reasonsNotDelivered'
      ).value;
      let selectedReason = this.selectReasonNoDelive.data.find(
        (item: Reason) => item.id === selectedId
      ).reason;

      this.goods.forEach(good => {
        let body = {
          id: good.id,
          reasonsNotAccepted:
            this.deliveryConstancyForm.get('reasonsNotAccepted').value,
          reasonsNotDelivered: this.deliveryConstancyForm.get(
            'reasonsNotDelivered'
          ).value,
          reasonsNotWithdrawn:
            this.deliveryConstancyForm.get('reasonsNotRetired').value,
          causeNotDelivered: cause,
          observation: selectedReason,
        };

        this.updateProgrammingGoodDelivery(body);
      });
    }

    //CREATE CERTIFICADO DE ENTREGA
    let deliveryForm = this.deliveryConstancyForm.getRawValue();
    deliveryForm.certificateId = this.generateUniqueNumber();
    deliveryForm.deliveryScheduleId = idProgDelivery;
    deliveryForm.folio = folio;
    deliveryForm.userCreation = userAuth.username;
    deliveryForm.userModification = userAuth.username;
    deliveryForm.creationDate = moment(new Date()).format('YYYY-MM-DD');
    deliveryForm.modificationDate = moment(new Date()).format('YYYY-MM-DD');
    deliveryForm.participateCommissioned = 'N';
    deliveryForm.oficioDate =
      deliveryForm.oficioDate != null
        ? moment(deliveryForm.oficioDate).format('YYYY-MM-DD')
        : null;
    deliveryForm.closing = null;
    deliveryForm.reasonsNotAccepted =
      this.deliveryConstancyForm.get('reasonsNotAccepted').value;
    deliveryForm.reasonsNotDelivered = this.deliveryConstancyForm.get(
      'reasonsNotDelivered'
    ).value;
    deliveryForm.reasonsNotRetired =
      this.deliveryConstancyForm.get('reasonsNotRetired').value;

    //deliveryForm.certificateType = 1;

    const created = await this.createCertificateDelivery(deliveryForm);

    //ACTUALIZA PROGRAMACION ENTREGA BIENES
    this.goods.map(async (item: any, _i: number) => {
      const index = _i + 1;
      let total = Number(item[this.lsColumnaTot]);
      total = total + Number(item[this.lsColumna]);
      let colDestino = '';
      switch (this.lsColumnaTot) {
        case 'sunGoodEnt':
          colDestino = 'amountDelivered';
          break;
        case 'sumGoodNoEnt':
          colDestino = 'amountNotDelivered';
          break;

        case 'sumGoodNoAce':
          colDestino = 'anountNotAccelted';
          break;
        case 'sumGoodNoRet':
          colDestino = 'amountNotWhithdrawn';
          break;
      }
      const bodyConstanceDelivery: any = {};
      bodyConstanceDelivery['id'] = item.id;
      bodyConstanceDelivery['goodId'] = item.goodId;
      bodyConstanceDelivery[this.lsColumnaTot] = total;
      bodyConstanceDelivery[colDestino] = total;
      //Actualiza la tabla de programacion entrega bienes
      const updated = await this.updateProgrammingDeliveryGood(
        bodyConstanceDelivery
      );

      const bodyConstanceGood: any = {};
      bodyConstanceGood.certificateId = deliveryForm.certificateId; //incresar el certificateId
      bodyConstanceGood.transactionId = item.transactionId;
      bodyConstanceGood.siabGoodNumber = item.siabGoodNumber;
      bodyConstanceGood.goodId = item.goodId;
      bodyConstanceGood.causeNotDelivered = deliveryForm.reasonsNotDelivered =
        this.deliveryConstancyForm.get('reasonsNotDelivered').value;
      bodyConstanceGood.quantity = item[this.lsColumna];
      bodyConstanceGood.goodsDeliveryScheduleId = item.id;
      bodyConstanceGood.userCreation = userAuth.username;
      bodyConstanceGood.userModification = userAuth.username;
      bodyConstanceGood.creationDate = moment(new Date()).format('YYYY-MM-DD');
      bodyConstanceGood.modificationDate = moment(new Date()).format(
        'YYYY-MM-DD'
      );

      //Actualiza la tabla de certificado bienes
      const createConstGood = await this.createCertificateGood(
        bodyConstanceGood
      );

      if (index == this.goods.length) {
        this.onLoadToast('success', 'Se creo el certificado de constancia');
        this.blockButtons = false;
        this.event.emit(deliveryForm);
        this.showReport(deliveryForm);
        this.close();
      }
    });
  }

  updateProgrammingGoodDelivery(body: any) {
    return new Promise((resolve, reject) => {
      this.programmingService
        .updateProgrammingDeliveryGood(body.id, body)
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            reject(error);
          },
        });
    });
  }

  async update() {
    let idProgDelivery = this.progEntrega.id;
    let folio = this.progEntrega.folio;
    let userAuth = this.auth.decodeToken();

    //CREATE CERTIFICADO DE ENTREGA
    let deliveryForm = this.deliveryConstancyForm.getRawValue();
    deliveryForm.participateCommissioned = 'N';

    deliveryForm.oficioDate =
      deliveryForm.oficioDate != null
        ? moment(deliveryForm.oficioDate).format('YYYY-MM-DD')
        : null;

    deliveryForm.writedate =
      deliveryForm.writedate != null
        ? moment(deliveryForm.writedate).format('YYYY-MM-DD')
        : null;

    deliveryForm.modificationDate = moment(new Date()).format('YYYY-MM-DD');
    deliveryForm.userModification = userAuth.username;

    let certify: any = {};
    for (const key in deliveryForm) {
      const element = deliveryForm[key];
      if (element != null) {
        certify[key] = element;
      }
    }

    const created = await this.updateCertificateDelivery(certify);

    this.onLoadToast('success', 'Se actualizo la constancia');
    this.event.emit(deliveryForm);
    this.showReport(deliveryForm);
    this.blockButtons = false;
    this.close();
  }

  close() {
    this.modalRef.hide();
  }

  updateProgrammingDeliveryGood(body: any) {
    return new Promise((resolve, reject) => {
      this.programmingGoodService
        .updateProgrammingDeliveryGood(body.id, body)
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            reject(error);
            this.onLoadToast(
              'error',
              'No se pudo actualizar la programacion de entrega'
            );
          },
        });
    });
  }

  createCertificateDelivery(body: Object) {
    return new Promise((resolve, reject) => {
      this.certifiDeliveryService.create(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(error);
          this.onLoadToast(
            'error',
            'No se pudo crear la constancia de entrega'
          );
        },
      });
    });
  }

  createCertificateGood(body: Object) {
    return new Promise((resolve, reject) => {
      this.certifiGoodsService.create(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(error);
          this.onLoadToast('error', 'No se pudo crear la constancia de bienes');
        },
      });
    });
  }

  getCertificateGood() {
    this.personalEstateData = [];
    const params = new ListParams();
    params['filter.certificateId'] = `$eq:${this.constanceForm.certificateId}`;
    this.certifiGoodsService.getAll(params).subscribe({
      next: (resp: any) => {
        resp.data.map(async (item: any) => {
          let body: any = {};
          body.goodId = item.goodId;
          console.log(item);
          const delGoodId: any = await this.getGoodId(item.goodId);
          console.log(delGoodId);
          body.id = delGoodId.id;
          body.transactionId = delGoodId.transactionId;
          body.siabGoodNumber = delGoodId.siabGoodNumber;
          body[this.lsColumna] = item.quantity;
          const descrip = await this.getGood(item.goodId);
          body.descriptionGood = descrip;

          this.personalEstateData.push(body);

          this.personalEstateData = [...this.personalEstateData];
        });
      },
    });
  }

  getGood(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.goodId'] = `$eq:${id}`;
      this.programmingGoodService.getProgrammingDeliveryGood(params).subscribe({
        next: (resp: any) => {
          resolve(resp.data[0].descriptionGood);
        },
      });
    });
  }
  getGoodId(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.goodId'] = `$eq:${id}`;
      this.programmingGoodService.getProgrammingDeliveryGood(params).subscribe({
        next: (resp: any) => {
          console.log(resp.data[0]);
          resolve(resp.data[0]);
        },
      });
    });
  }

  getReasonNotDelivery(params: ListParams) {
    params['filter.orderBy'] = `reason:ASC`;
    params['filter.reasonType'] = `$eq:Motivos No Entregados`;
    if (params.text) {
      params['filter.reason'] = `$ilike:${params.text}`;
    }

    this.nonDeliveryReasonsService.getAll(params).subscribe({
      next: response => {
        this.selectReasonNoDelive = new DefaultSelect(
          response.data,
          response.count
        );
      },
      error: error => {
        this.selectReasonNoDelive = new DefaultSelect();
      },
    });
  }

  reasonChange(selectedValue, id) {
    if (id == 3) {
      this.deliveryConstancyForm
        .get('reasonsNotAccepted')
        .setValue(selectedValue);
    }
    if (id == 2) {
      this.deliveryConstancyForm
        .get('reasonsNotDelivered')
        .setValue(selectedValue);
    }
    if (id == 4) {
      this.deliveryConstancyForm
        .get('reasonsNotRetired')
        .setValue(selectedValue);
    }
  }

  getReasonNotAccepted(params: ListParams) {
    params['filter.orderBy'] = `reason:ASC`;
    params['filter.reasonType'] = `$eq:Motivos No Aceptados`;
    if (params.text) {
      params['filter.reason'] = `$ilike:${params.text}`;
    }

    this.nonDeliveryReasonsService.getAll(params).subscribe({
      next: response => {
        this.selectReasonNoAcep = new DefaultSelect(
          response.data,
          response.count
        );
      },
      error: error => {
        this.selectReasonNoAcep = new DefaultSelect();
      },
    });
  }

  getReasonNotWithdrawn(params: ListParams) {
    params['filter.orderBy'] = `reason:ASC`;
    params['filter.reasonType'] = `$eq:Motivos No Retirados`;
    if (params.text) {
      params['filter.reason'] = `$ilike:${params.text}`;
    }

    this.nonDeliveryReasonsService.getAll(params).subscribe({
      next: response => {
        this.selectReasonNoWithdrawn = new DefaultSelect(
          response.data,
          response.count
        );
      },
      error: error => {
        this.selectReasonNoWithdrawn = new DefaultSelect();
      },
    });
  }

  setFormValues(data: any) {
    if (data) {
      data.certificateId
        ? this.deliveryConstancyForm.controls['certificateId'].setValue(
            data.certificateId
          )
        : null;
      data.publicDeed
        ? this.deliveryConstancyForm.controls['publicDeed'].setValue(
            data.publicDeed
          )
        : null;
      data.writedate
        ? this.deliveryConstancyForm.controls['writedate'].setValue(
          moment(data.writedate ? data.writedate.split('T')[0] : null).format('DD/MM/YYYY')
          )
        : null;
      data.adjudicator
        ? this.deliveryConstancyForm.controls['adjudicator'].setValue(
            data.adjudicator
          )
        : null;
      data.publicNotary
        ? this.deliveryConstancyForm.controls['publicNotary'].setValue(
            data.publicNotary
          )
        : null;
      data.cveState
        ? this.deliveryConstancyForm.controls['cveState'].setValue(
            data.cveState
          )
        : null;
      data.transport
        ? this.deliveryConstancyForm.controls['transport'].setValue(
            data.transport
          )
        : null;
      data.marck
        ? this.deliveryConstancyForm.controls['marck'].setValue(data.marck)
        : null;
      data.model
        ? this.deliveryConstancyForm.controls['model'].setValue(data.model)
        : null;
      data.plates
        ? this.deliveryConstancyForm.controls['plates'].setValue(data.plates)
        : null;
      data.serie
        ? this.deliveryConstancyForm.controls['serie'].setValue(data.serie)
        : null;
      data.driverName
        ? this.deliveryConstancyForm.controls['driverName'].setValue(
            data.driverName
          )
        : null;
      data.oficioNum
        ? this.deliveryConstancyForm.controls['oficioNum'].setValue(
            data.oficioNum
          )
        : null;
      data.oficioDate
        ? this.deliveryConstancyForm.controls['oficioDate'].setValue(
          moment(data.oficioDate ? data.oficioDate.split('T')[0] : null).format('DD/MM/YYYY')
        )
        : null;
      data.acreditPerson
        ? this.deliveryConstancyForm.controls['acreditPerson'].setValue(
            data.acreditPerson
          )
        : null;
      data.virtue
        ? this.deliveryConstancyForm.controls['virtue'].setValue(data.virtue)
        : null;
      data.reasonsNotAccepted
        ? this.deliveryConstancyForm.controls['reasonsNotAccepted'].setValue(
            data.reasonsNotAccepted
          )
        : null;
      data.reasonsNotDelivered
        ? this.deliveryConstancyForm.controls['reasonsNotDelivered'].setValue(
            data.reasonsNotDelivered
          )
        : null;
      data.reasonsNotRetired
        ? this.deliveryConstancyForm.controls['reasonsNotRetired'].setValue(
            data.reasonsNotRetired
          )
        : null;
      data.teName
        ? this.deliveryConstancyForm.controls['teName'].setValue(data.teName)
        : null;
      data.tePosition
        ? this.deliveryConstancyForm.controls['tePosition'].setValue(
            data.tePosition
          )
        : null;
      data.clientIden
        ? this.deliveryConstancyForm.controls['clientIden'].setValue(
            data.clientIden
          )
        : null;
      data.clientIdennNum
        ? this.deliveryConstancyForm.controls['clientIdennNum'].setValue(
            data.clientIdennNum
          )
        : null;
      data.procClientIdennNum
        ? this.deliveryConstancyForm.controls['procClientIdennNum'].setValue(
            data.procClientIdennNum
          )
        : null;
      data.repLegal
        ? this.deliveryConstancyForm.controls['repLegal'].setValue(
            data.repLegal
          )
        : null;
      data.repLegalPosition
        ? this.deliveryConstancyForm.controls['repLegalPosition'].setValue(
            data.repLegalPosition
          )
        : null;
      data.repLegalIden
        ? this.deliveryConstancyForm.controls['repLegalIden'].setValue(
            data.repLegalIden
          )
        : null;
      data.repLegalIdenNum
        ? this.deliveryConstancyForm.controls['repLegalIdenNum'].setValue(
            data.repLegalIdenNum
          )
        : null;
      data.repLegalIdenProg
        ? this.deliveryConstancyForm.controls['repLegalIdenProg'].setValue(
            data.repLegalIdenProg
          )
        : null;
      data.companyName
        ? this.deliveryConstancyForm.controls['companyName'].setValue(
            data.companyName
          )
        : null;
      data.positionCompany
        ? this.deliveryConstancyForm.controls['positionCompany'].setValue(
            data.positionCompany
          )
        : null;
      data.deliveryName
        ? this.deliveryConstancyForm.controls['deliveryName'].setValue(
            data.deliveryName
          )
        : null;
      data.postDelivery
        ? this.deliveryConstancyForm.controls['postDelivery'].setValue(
            data.postDelivery
          )
        : null;
      data.deliveryIden
        ? this.deliveryConstancyForm.controls['deliveryIden'].setValue(
            data.deliveryIden
          )
        : null;
      data.deliveryNum
        ? this.deliveryConstancyForm.controls['deliveryNum'].setValue(
            data.deliveryNum
          )
        : null;
      data.deliveryProcIden
        ? this.deliveryConstancyForm.controls['deliveryProcIden'].setValue(
            data.deliveryProcIden
          )
        : null;
      data.witnessName1
        ? this.deliveryConstancyForm.controls['witnessName1'].setValue(
            data.witnessName1
          )
        : null;
      data.witnessName2
        ? this.deliveryConstancyForm.controls['witnessName2'].setValue(
            data.witnessName2
          )
        : null;
      data.authorizeReceive
        ? this.deliveryConstancyForm.controls['authorizeReceive'].setValue(
            data.authorizeReceive
          )
        : null;
      data.certifiesPersonality
        ? this.deliveryConstancyForm.controls['certifiesPersonality'].setValue(
            data.certifiesPersonality
          )
        : null;
      data.oicParticipates
        ? this.deliveryConstancyForm.controls['oicParticipates'].setValue(
            data.oicParticipates
          )
        : null;
      data.oicName
        ? this.deliveryConstancyForm.controls['oicName'].setValue(data.oicName)
        : null;
      data.oicCall
        ? this.deliveryConstancyForm.controls['oicCall'].setValue(data.oicCall)
        : null;
      data.closing
        ? this.deliveryConstancyForm.controls['closing'].setValue(data.closing)
        : null;
    }
  }

  updateCertificateDelivery(body: any) {
    return new Promise((resolve, reject) => {
      this.certifiDeliveryService.update(body).subscribe({
        next: resp => {
          this.deliveryConstancyForm.patchValue(resp.data);
          resolve(resp);
        },
        error: error => {
          reject(error);
          this.onLoadToast(
            'error',
            'No se pudo crear la constancia de entrega'
          );
        },
      });
    });
  }

  selectGood(event: any) {
    if (event.isSelected == false) {
      this.goodSelected = {};
      return;
    }
    this.goodSelected = event.data;
    console.log(this.goodSelected);
    console.log(this.typeConstancy);
  }
  async separate() {
    this.blockButtons = true;
    if (this.goodSelected && Object.keys(this.goodSelected).length > 0) {
      let idProgDelivery = this.progEntrega.id;
      let folio = this.progEntrega.folio;
      let userAuth = this.auth.decodeToken();

      let deliveryForm = this.deliveryConstancyForm.getRawValue();
      deliveryForm.certificateId = this.generateUniqueNumber();
      deliveryForm.deliveryScheduleId = idProgDelivery;
      deliveryForm.folio = folio;
      deliveryForm.userCreation = userAuth.username;
      deliveryForm.userModification = userAuth.username;
      deliveryForm.creationDate = moment(new Date()).format('YYYY-MM-DD');
      deliveryForm.modificationDate = moment(new Date()).format('YYYY-MM-DD');
      deliveryForm.oficioDate =
        deliveryForm.oficioDate != null
          ? moment(deliveryForm.oficioDate).format('YYYY-MM-DD')
          : null;
      deliveryForm.closing = null;
      deliveryForm.reasonsNotAccepted =
        this.deliveryConstancyForm.get('reasonsNotAccepted').value;
      deliveryForm.reasonsNotDelivered = this.deliveryConstancyForm.get(
        'reasonsNotDelivered'
      ).value;
      deliveryForm.reasonsNotRetired =
        this.deliveryConstancyForm.get('reasonsNotRetired').value;
      const created = await this.createCertificateDelivery(deliveryForm);
      //ACTUALIZA PROGRAMACION ENTREGA BIENES
      //this.goodSelected.map(async (item: any, _i: number) => {
      //const index = _i + 1;
      let total = Number(this.goodSelected[this.lsColumnaTot]);
      total = total + Number(this.goodSelected[this.lsColumna]);

      const bodyConstanceDelivery: any = {};
      bodyConstanceDelivery['id'] = this.goodSelected.id;
      bodyConstanceDelivery['goodId'] = this.goodSelected.goodId;
      bodyConstanceDelivery[this.lsColumnaTot] = total;
      console.log(bodyConstanceDelivery);
      //Actualiza la tabla de programacion entrega bienes
      const updated = await this.updateProgrammingDeliveryGood(
        bodyConstanceDelivery
      );

      const bodyConstanceGood: any = {};
      bodyConstanceGood.certificateId = deliveryForm.certificateId; //incresar el certificateId
      bodyConstanceGood.transactionId = this.goodSelected.transactionId;
      bodyConstanceGood.siabGoodNumber = this.goodSelected.siabGoodNumber;
      bodyConstanceGood.goodId = this.goodSelected.goodId;
      bodyConstanceGood.quantity = this.goodSelected[this.lsColumna];
      bodyConstanceGood.goodsDeliveryScheduleId = this.goodSelected.id;
      bodyConstanceGood.userCreation = userAuth.username;
      bodyConstanceGood.userModification = userAuth.username;
      bodyConstanceGood.creationDate = moment(new Date()).format('YYYY-MM-DD');
      bodyConstanceGood.modificationDate = moment(new Date()).format(
        'YYYY-MM-DD'
      );

      //Actualiza la tabla de certificado bienes
      const createConstGood = await this.createCertificateGood(
        bodyConstanceGood
      );

      //if (index == this.goods.length) {
      this.onLoadToast('success', 'Se creo el certificado de constancia');
      // this.event.emit(deliveryForm);
      // this.showReport(deliveryForm);
      // this.close();
      //}
      this.blockButtons = false;
      // Filtrar la lista para eliminar el objeto con el id correspondiente
      this.personalEstateData = this.personalEstateData.filter(
        objeto => objeto.goodId !== this.goodSelected.goodId
      );
      //});
    } else {
      this.alert('warning', 'Advertencia', 'Favor de seleccionar un bien');
      this.blockButtons = false;
    }
  }
}

interface Reason {
  id: number;
  reason: string;
}
