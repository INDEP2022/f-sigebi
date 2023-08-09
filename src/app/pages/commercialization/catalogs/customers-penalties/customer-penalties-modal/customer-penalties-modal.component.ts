import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICustomersPenalties } from 'src/app/core/models/catalogs/customer.model';
import { IComerClients } from 'src/app/core/models/ms-customers/customers-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BankMovementType } from 'src/app/core/services/ms-bank-movement/bank-movement.service';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-customer-penalties-modal',
  templateUrl: './customer-penalties-modal.component.html',
  styles: [],
})
export class CustomerPenaltiesModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Registro de Penalización y Cambio de Estatus';
  edit: boolean = false;

  form: FormGroup = new FormGroup({});
  //customersPenalties: ICustomersPenalties;
  customersPenalties: any;

  penalty: any;
  penalties: ICustomersPenalties;
  today: Date;

  clientId: number;
  eventId: number;
  lotId: number;
  publicLot: number;

  selectClient = new DefaultSelect();
  selectEvent = new DefaultSelect();
  selectLot = new DefaultSelect();
  selectPenalty = new DefaultSelect();
  selectUser = new DefaultSelect();

  clientIdAny: any;
  eventIdAny: any;

  user: string;
  failureDate: Date;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  countPenalty: number;
  countPenaltyHist: number;

  countAll: number;

  prueba: IComerClients[] = [];

  @Output() data = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private clientPenaltyService: ClientPenaltyService,
    private modalRef: BsModalRef,
    private comerClientsService: ComerClientsService,
    private comerEventService: ComerEventService,
    private lotService: LotService,
    private bankMovementType: BankMovementType,
    private authService: AuthService,
    private securityService: SecurityService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
    /*this.clientId = this.customersPenalties.clientId?.id;
    this.eventId = this.customersPenalties.eventId?.id;
    this.lotId = this.customersPenalties.lotId?.id;
    this.publicLot = this.customersPenalties.lotId?.publicLot;
    this.form.patchValue({
      clientId: this.clientId,
      eventId: this.eventId,
      lotId: this.lotId,
    });*/
  }

  private prepareForm() {
    this.form = this.fb.group({
      clientId: [null, [Validators.required]],
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      typeProcess: [
        null,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      eventId: [null, [Validators.required]],
      lotId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      refeOfficeOther: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      userPenalty: [null, [Validators.required]],
      penaltiDate: [null, [Validators.required]],
      publicLot: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      user: [
        null,
        [
          //Validators.required,
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      pFlag: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      registernumber: [null, []],
    });
    if (this.customersPenalties != null) {
      this.edit = true;

      //this.form.patchValue(this.customersPenalties);
      this.clientIdAny = this.customersPenalties.clientId;
      this.eventIdAny = this.customersPenalties.eventId;

      /*let clie: IComerClients = this.clientIdAny.id as IComerClients;
      this.form.patchValue({...this.customersPenalties, id: clie.id});
      console.log(clie);
      this.selectClient = new DefaultSelect([clie], 1);*/
      this.form.patchValue(this.customersPenalties);
      this.getClientUp(new ListParams(), this.clientIdAny.id);
      this.form.get('clientId').setValue(this.clientIdAny.id);
      //this.form.get('eventId').setValue(this.eventIdAny.eventTpId);

      //this.getClientUp(new ListParams(), this.clientIdAny.id);
      //this.form.controls['clientId'].setValue(this.clientIdAny.id);

      console.log(this.form.controls['clientId'].value);

      console.log(String(this.clientIdAny.id));

      /*this.getClientUp(new ListParams(), String(this.clientIdAny.id));
      //this.form.controls['clientId'].setValue(this.clientIdAny.id);
      this.getEventUp(new ListParams(), String(this.eventIdAny.eventTpId));
      //this.getLotUp(new ListParams());
      this.form.patchValue(this.customersPenalties);*/

      //this.form.controls['clientId'].setValue(this.customersPenalties.clientId.id);

      console.log(this.customersPenalties);

      if (this.form.get('startDate').value) {
        const dbReleaseDate = this.form.get('startDate').value;
        const formattedDate1 = formatDate(dbReleaseDate, 'dd/MM/yyyy', 'en-US');
        this.form.get('startDate').setValue(formattedDate1);
        this.form
          .get('startDate')
          .setValue(this.addDays(new Date(dbReleaseDate), 1));
      }

      if (this.form.get('endDate').value) {
        const dbBlackListDate = this.form.get('endDate').value;
        const formattedDate2 = formatDate(
          dbBlackListDate,
          'dd/MM/yyyy',
          'en-US'
        );
        this.form.get('endDate').setValue(formattedDate2);
        this.form
          .get('endDate')
          .setValue(this.addDays(new Date(dbBlackListDate), 1));
      }

      if (this.form.get('penaltiDate').value) {
        const dbFreeDate = this.form.get('penaltiDate').value;
        const formattedDate3 = formatDate(dbFreeDate, 'dd/MM/yyyy', 'en-US');
        this.form.get('penaltiDate').setValue(formattedDate3);
        this.form
          .get('penaltiDate')
          .setValue(this.addDays(new Date(dbFreeDate), 1));
      }
    }
    const user: any = this.authService.decodeToken() as any;
    this.user = user.username;
    console.log(this.user);
    this.form.get('user').setValue(this.user);
    this.form.get('user').disable();
    this.form.get('publicLot').disable();
    setTimeout(() => {
      this.getClient(new ListParams());
      this.getEvent(new ListParams());
      //this.getLot(new ListParams());
      this.getPenalty(new ListParams());
      this.getUser(new ListParams());
    }, 1000);
  }

  getUser(params: ListParams) {
    this.securityService.getAllUsersTracker(params).subscribe({
      next: resp => {
        this.selectUser = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.selectUser = new DefaultSelect();
      },
    });
  }

  getPenalty(params: ListParams) {
    this.bankMovementType.getAllTPenalty(params).subscribe({
      next: resp => {
        this.selectPenalty = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.selectPenalty = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getClient(params: ListParams) {
    this.comerClientsService.getAllV2(params).subscribe({
      next: resp => {
        /*id
        reasonName*/
        console.log(resp.data);
        this.selectClient = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.selectClient = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getClientUp(params: ListParams, id?: string | number) {
    params['filter.id'] = `$eq:${id}`;
    this.comerClientsService.getAllV2(params).subscribe({
      next: resp => {
        /*id
        reasonName*/
        console.log(resp.data);
        this.prueba = resp.data;
        this.selectClient = new DefaultSelect(this.prueba, resp.count);
      },
      error: err => {
        this.selectClient = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getEvent(params: ListParams) {
    this.comerEventService.getAllFilter(params).subscribe({
      next: resp => {
        this.selectEvent = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.selectEvent = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getEventUp(params: ListParams, id?: string | number) {
    params['filter.eventTpId'] = `$eq:${id}`;
    this.comerClientsService.getAll(params).subscribe({
      next: resp => {
        /*id
        reasonName*/
        console.log(resp.data);
        this.selectEvent = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.selectEvent = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getLot(params: ListParams) {
    this.lotService.getAllComerLot(params).subscribe({
      next: resp => {
        this.selectLot = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.selectLot = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getLotUp(params: ListParams, id?: string | number) {
    params['filter.eat_events.idEvent'] = `$eq:${id}`;
    this.lotService.getAllComerLot(params).subscribe({
      next: resp => {
        /*id
        reasonName*/
        console.log(resp.data);
        this.selectLot = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.selectLot = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  changeClient(event: any) {
    /*console.log(event);
    var formatted = new DatePipe('en-EN').transform(event.blackListDate, 'dd/MM/yyyy', 'UTC');
    this.form.controls['penaltiDate'].setValue(formatted);*/
    console.log(event);
  }

  changeEvent(event: any) {
    if (event) {
      this.failureDate = event.failureDate;
      console.log(event, this.failureDate);
      this.getLotUp(new ListParams(), event.id);
    }
  }

  validateLotePublic() {
    this.clientPenaltyService.getAllV2().subscribe({});
  }

  changeLot(event: any) {
    if (event) {
      console.log(event.lotPublic, event);
      this.form.controls['publicLot'].setValue(event.lotPublic);
    }
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  clearFreeDate(propertyName: string) {
    this.form.get(propertyName).setValue(null);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;

    const clientId: any = this.form.get('clientId');
    const lotId = this.form.get('lotId');
    const eventId: any = this.form.get('eventId');
    const endDate = this.form.get('endDate');
    const penaltyId = this.customersPenalties.id;
    const pFlag = this.customersPenalties.pFlag;
    const penaltiDate = this.form.get('penaltiDate');
    const publicLot = this.customersPenalties.publicLot;
    const refeOfficeOther = this.form.get('refeOfficeOther');
    const registernumber = this.customersPenalties.registernumber;
    const startDate = this.form.get('startDate');
    const typeProcess = this.form.get('typeProcess');
    const user = this.customersPenalties.user;
    const userPenalty = this.customersPenalties.userPenalty;
    let model1: any = {
      //customerId: clientId,
      /*clientId: this.form.controls['clientId'].value,
      //customerId: 
      batchId: lotId.value,
      eventId: eventId.value,
      finalDate: endDate.value,
      penaltyId: this.form.controls['id'].value,
      pFlag: pFlag,
      penalizesDate: penaltiDate.value,
      batchPublic: publicLot,
      referenceJobOther: refeOfficeOther.value,
      recordNumber: registernumber,
      initialDate: startDate.value,
      processType: typeProcess.value,
      user: user,
      usrPenalize: userPenalty,
      nbOrigin: null,*/

      customerId: this.clientIdAny.id,
      batchId: lotId.value,
      penaltyId: this.form.controls['id'].value,
      eventId: this.eventIdAny.eventTpId,
      batchPublic: publicLot,
      initialDate: startDate.value,
      finalDate: endDate.value,
      processType: typeProcess.value,
      referenceJobOther: refeOfficeOther.value,
      user: user,
      pFlag: pFlag,
      recordNumber: registernumber,
      usrPenalize: userPenalty,
      penalizesDate: penaltiDate.value,
      nbOrigin: null,
    };
    console.log(model1);
    this.clientPenaltyService.updateCustomers1(model1).subscribe({
      next: data => {
        this.handleSuccess();
        this.modalRef.hide();
      },
      error: (error: any) => {
        this.alert('warning', `No es Posible Actualizar el Cliente`, '');
        //this.modalRef.hide();
      },
    });
    //this.modalRef.hide();
  }

  ValidateLot(
    eventId1: number | string,
    publicLot: number | string,
    clientId: number | string
  ) {
    /*params['filter.eventId'] = `$eq:${eventId}`;
    params['filter.publicLot'] = `$eq:${publicLot}`;
    params['filter.clientId'] = `$eq:${clientId}`;
    */
    let body = {
      customerId: clientId,
      batchPublic: publicLot,
      eventId: eventId1,
    };
    this.clientPenaltyService.getAllV2Post(body).subscribe({
      next: resp => {
        if (resp.count > 0) {
          console.log(resp);
        } else {
          console.log(resp);
        }
      },
      error: err => {},
    });
  }

  ValidateLotHist(
    eventId1: number | string,
    publicLot: number | string,
    clientId: number | string
  ) {
    /*this.params2.getValue()['filter.eventId'] = `$eq:${eventId}`;
    this.params2.getValue()['filter.publicLot'] = `$eq:${publicLot}`;
    this.params2.getValue()['filter.clientId'] = `$eq:${clientId}`;
    let params = {
      ...this.params2.getValue()
    };*/
    let body = {
      customerId: clientId,
      batchPublic: publicLot,
      eventId: eventId1,
    };

    this.clientPenaltyService.getAllHistPost(body).subscribe({
      next: resp => {
        if (resp.count > 0) {
          console.log(resp);
        } else {
          console.log(resp);
        }
      },
      error: err => {},
    });
  }

  async value() {
    const result = this.countPenalty;
    return result;
    //console.log(result);
  }

  async value2() {
    const result2 = this.countPenaltyHist;
    return result2;
    //console.log(result2);
  }

  create() {
    this.loading = true;
    const clientId = this.form.get('clientId'); //
    const lotId = this.form.get('lotId'); //
    const eventId = this.form.get('eventId'); //
    const endDate: string | null =
      this.form.get('endDate').value !== null
        ? this.convertDateFormat(this.form.get('endDate').value)
        : null;
    const id = this.form.get('id'); //
    const pFlag = this.form.get('pFlag');
    const penaltiDate: string | null =
      this.form.get('penaltiDate').value !== null
        ? this.convertDateFormat(this.form.get('penaltiDate').value)
        : null; //
    const publicLot = this.form.get('publicLot');
    const refeOfficeOther = this.form.get('refeOfficeOther');
    const registernumber = this.form.get('registernumber');
    const startDate: string | null =
      this.form.get('startDate').value !== null
        ? this.convertDateFormat(this.form.get('startDate').value)
        : null;
    const typeProcess = this.form.get('typeProcess');
    const user = this.form.get('user');
    const userPenalty = this.form.get('userPenalty');
    const model: any = {
      //clientId: clientId.value,
      /*customerId: clientId.value,
      batchId: lotId.value,
      eventId: eventId.value,
      batchPublic: publicLot.value,
      penaltyDate: penaltiDate,
      penaltyId: id.value,
      referenceJobOther: refeOfficeOther.value,
      userPenalty: userPenalty.value,
      lotId: lotId.value,
      initialDate: startDate,
      finalDate: endDate,
      processType: typeProcess.value,
      pFlag: pFlag.value,
      user: user.value,
      registernumber: registernumber.value,
      nbOrigin: null,*/
      customerId: clientId.value,
      batchId: lotId.value,
      penaltyId: id.value,
      eventId: eventId.value,
      batchPublic: publicLot.value,
      initialDate: startDate,
      finalDate: endDate,
      processType: typeProcess.value,
      referenceJobOther: refeOfficeOther.value,
      user: user.value,
      pFlag: pFlag.value,
      recordNumber: registernumber.value,
      usrPenalize: userPenalty.value,
      penalizesDate: penaltiDate,
      nbOrigin: null,
    };
    console.log(model);

    let body = {
      customerId: clientId.value,
      batchPublic: publicLot.value,
      eventId: eventId.value,
    };

    this.clientPenaltyService.getAllHistPost(body).subscribe({
      next: resp => {
        if (resp.count > 0) {
          console.log(resp);
          this.alert(
            'warning',
            `El Lote ${publicLot.value} y el evento ${eventId}`,
            'Ya fue utilizado en alguna penalización'
          );
          return;
          console.log(resp);
        } else {
          this.clientPenaltyService.getAllV2Post(body).subscribe({
            next: resp => {
              if (resp.count > 0) {
                console.log(resp);
                this.alert(
                  'warning',
                  `El Lote ${publicLot.value} y el evento ${eventId}`,
                  'Ya fue utilizado en alguna penalización'
                );
                return;
                console.log(resp);
              } else {
                this.clientPenaltyService.create(model).subscribe({
                  next: data => {
                    this.loading = false;
                    this.handleSuccess();
                    //this.modalRef.hide();
                  },
                  error: error => {
                    this.alert(
                      'warning',
                      `Ya existe un registro con el penaltyId:${id.value} y customerId:${clientId.value}`,
                      ''
                    );
                    this.loading = false;
                    console.log(error);
                  },
                });
                console.log(resp);
              }
            },
            error: err => {},
          });
          console.log(resp);
        }
      },
      error: err => {},
    });

    /*this.ValidateLot(eventId.value, publicLot.value, clientId.value);
    this.ValidateLotHist(eventId.value, publicLot.value, clientId.value);*/

    /*if (this.form.valid) {
      this.clientPenaltyService.create(model).subscribe({
        next: data => {
          this.loading = false;
          this.handleSuccess();
          //this.modalRef.hide();
        },
        error: error => {
          this.alert('warning', `No es Posible Crear el Cliente`, '');
          this.loading = false;
          console.log(error);
        },
      });
    } else {
      /*this.alert(
        'warning',
        'El Formulario no es Válido. Revise los Campos Requeridos',
        ''
      );
      this.loading = false;
    }*/
  }

  convertDateFormat(inputDate: string | Date): string {
    if (inputDate instanceof Date) {
      return formatDate(inputDate, 'yyyy-MM-dd', 'en-US');
    } else if (typeof inputDate === 'string') {
      const parts = inputDate.split('/');
      if (parts.length !== 3) {
        throw new Error('Fecha en Formato Incorrecto: ' + inputDate);
      }
      return parts[2] + '-' + parts[1] + '-' + parts[0];
    } else {
      throw new Error('Formato de Fecha Inválido: ' + inputDate);
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', 'Penalización', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
