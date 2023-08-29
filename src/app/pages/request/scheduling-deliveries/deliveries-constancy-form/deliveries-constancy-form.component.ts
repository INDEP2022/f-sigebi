import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProgrammingDeliveryGood } from 'src/app/core/models/good-programming/programming-delivery-good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { CertificatesDeliveryService } from 'src/app/core/services/ms-delivery-constancy/certificates-delivery.service';
import { CertificatesGoodsService } from 'src/app/core/services/ms-delivery-constancy/certificates-goods.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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

  listTypeConstances = new DefaultSelect();
  typeReceptor: string = '';
  lsColumna: string = '';
  lsColumnaTot: string = '';

  selectEntity = new DefaultSelect();
  selectReasonNoAcep = new DefaultSelect();
  selectReasonNoDelive = new DefaultSelect();
  selectReasonNoWithdrawn = new DefaultSelect();

  btnTitle: string = 'Guardar';

  public event: EventEmitter<any> = new EventEmitter();

  private programmingGoodService = inject(ProgrammingGoodService);
  private certifiDeliveryService = inject(CertificatesDeliveryService);
  private certifiGoodsService = inject(CertificatesGoodsService);
  private auth = inject(AuthService);
  private goodService = inject(GoodService);

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationStateService: DelegationStateService
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
    this.regDele = this.progEntrega.delRegId;
    this.listTypeConstances = new DefaultSelect(
      typeContances,
      typeContances.length
    );
    this.isEdit();
    this.personalEstateData = this.goods;
    setTimeout(() => {
      this.setColumns();
      this.validateClientSeccion();
    }, 300);
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
      this.deliveryConstancyForm.patchValue(this.constanceForm);
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
    console.log(this.typeReceptor);
    return (event.target as HTMLInputElement).value;
  }

  setColumns() {
    console.log(this.table);

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
        console.log(data);

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
    if (this.edit == false) {
      this.create();
    } else {
      this.update();
    }
  }

  generateReport() {}

  async create() {
    let idProgDelivery = this.progEntrega.id;
    let folio = this.progEntrega.folio;
    let userAuth = this.auth.decodeToken();

    //GENERAR REPORTE
    //this.generateReport()

    //CREATE CERTIFICADO DE ENTREGA
    let deliveryForm = this.deliveryConstancyForm.getRawValue();
    deliveryForm.certificateId = 999953; //ingresar el dato
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
    const created = await this.createCertificateDelivery(deliveryForm);

    //ACTUALIZA PROGRAMACION ENTREGA BIENES
    this.goods.map(async (item: any, _i: number) => {
      const index = _i + 1;
      let total = Number(item[this.lsColumnaTot]);
      total = total + Number(item[this.lsColumna]);

      const bodyConstanceDelivery: any = {};
      bodyConstanceDelivery['id'] = item.id;
      bodyConstanceDelivery['goodId'] = item.goodId;
      bodyConstanceDelivery[this.lsColumnaTot] = total;

      console.log(bodyConstanceDelivery);
      //Actualiza la tabla de programacion entrega bienes
      const updated = await this.updateProgrammingDeliveryGood(
        bodyConstanceDelivery
      );

      const bodyConstanceGood: any = {};
      bodyConstanceGood.certificateId = 999953; //incresar el certificateId
      bodyConstanceGood.transactionId = item.transactionId;
      bodyConstanceGood.siabGoodNumber = item.siabGoodNumber;
      bodyConstanceGood.goodId = item.goodId;
      bodyConstanceGood.quantity = item[this.lsColumna];
      bodyConstanceGood.goodsDeliveryScheduleId = item.id;
      bodyConstanceGood.userCreation = userAuth.username;
      bodyConstanceGood.userModification = userAuth.username;
      bodyConstanceGood.creationDate = moment(new Date()).format('YYYY-MM-DD');
      bodyConstanceGood.modificationDate = moment(new Date()).format(
        'YYYY-MM-DD'
      );

      console.log(bodyConstanceGood);
      //Actualiza la tabla de certificado bienes
      const createConstGood = await this.createCertificateGood(
        bodyConstanceGood
      );

      if (index == this.goods.length) {
        this.onLoadToast('success', 'Se creo el certificado de constacia');
        this.event.emit(deliveryForm);
        this.close();
      }
    });
  }

  async update() {
    let idProgDelivery = this.progEntrega.id;
    let folio = this.progEntrega.folio;
    let userAuth = this.auth.decodeToken();

    //GENERAR REPORTE
    //this.generateReport()

    //CREATE CERTIFICADO DE ENTREGA
    let deliveryForm = this.deliveryConstancyForm.getRawValue();
    deliveryForm.oficioDate =
      deliveryForm.oficioDate != null
        ? moment(deliveryForm.oficioDate).format('YYYY-MM-DD')
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
    console.log(certify);

    const created = await this.updateCertificateDelivery(certify);

    this.onLoadToast('success', 'Se actualizo la constancia');
    this.event.emit(true);
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
        console.log(resp);
        resp.data.map(async (item: any) => {
          let body: any = {};
          body.goodId = item.goodId;
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

  updateCertificateDelivery(body: any) {
    return new Promise((resolve, reject) => {
      this.certifiDeliveryService.update(body).subscribe({
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
}
