import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { BehaviorSubject, firstValueFrom, takeUntil } from 'rxjs';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IDictation,
  IUpdateDelDictation,
} from 'src/app/core/models/ms-dictation/dictation-model';
import { IHistoryOfficial } from 'src/app/core/models/ms-historyofficial/historyofficial.model';
import { IUpdateActasEntregaRecepcionDelegation } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from '../../../../common/repository/interfaces/list-params';
import { INotification } from '../../../../core/models/ms-notification/notification.model';
import { IProceedingDeliveryReception } from '../../../../core/models/ms-proceedings/proceeding-delivery-reception';
import { IUserAccessAreaRelational } from '../../../../core/models/ms-users/seg-access-area-relational.model';
import { DocReceptionRegisterService } from '../../../../core/services/document-reception/doc-reception-register.service';
import { CopiesXFlierService } from '../../../../core/services/ms-flier/copies-x-flier.service';
import { HistoryOfficialService } from '../../../../core/services/ms-historyofficial/historyOfficial.service';
import { NotificationService } from '../../../../core/services/ms-notification/notification.service';
import { ProceedingsDeliveryReceptionService } from '../../../../core/services/ms-proceedings/proceedings-delivery-reception.service';
import { ProcedureManagementService } from '../../../../core/services/proceduremanagement/proceduremanagement.service';
import { IJuridicalShiftChangeParams } from '../../../juridical-processes/file-data-update/interfaces/file-data-update-parameters';
import { FileUpdateCommunicationService } from '../../../juridical-processes/file-data-update/services/file-update-communication.service';
import { JuridicalFileUpdateService } from '../../../juridical-processes/file-data-update/services/juridical-file-update.service';
import {
  SHIFT_CHANGE_DICTUM_COLUMNS,
  SHIFT_CHANGE_EXAMPLE_DATA,
  SHIFT_CHANGE_PROCEEDINGS_COLUMNS,
} from './shift-change-columns';
import { ShiftChangeHistoryComponent } from './shift-change-history/shift-change-history.component';

export interface IUpdateObjectsActas {
  selectedProceedings: IUpdateActasEntregaRecepcionDelegation[];
  selectedDictums: IUpdateDelDictation[];
}

@Component({
  selector: 'app-shift-change',
  templateUrl: './shift-change.component.html',
  styles: [
    `
      .height-limit {
        height: 34rem;
      }

      .height-min {
        height: 12rem;
      }

      ng-scrollbar {
        ::ng-deep {
          .ng-scroll-viewport {
            padding-right: 1em;
            padding-bottom: 1em;
          }
        }
      }
      h6 {
        color: gray;
      }
    `,
  ],
})
export class RdFShiftChangeComponent extends BasePage implements OnInit {
  turnForm = new FormGroup({
    wheelNumber: new FormControl<number>(null, Validators.required),
    affair: new FormControl<string>(null, [Validators.pattern(STRING_PATTERN)]),
    receiptDate: new FormControl<string | Date>(null, Validators.required),
    captureDate: new FormControl<string | Date>(null, Validators.required),
    externalRemitter: new FormControl<string>(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    prevUser: new FormControl<IUserAccessAreaRelational>(
      null,
      Validators.required
    ),
    newUser: new FormControl<IUserAccessAreaRelational>(
      null,
      Validators.required
    ),
    argument: new FormControl<string>(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
  });
  users = new DefaultSelect<IUserAccessAreaRelational>();
  data = SHIFT_CHANGE_EXAMPLE_DATA;
  dictumColumns: IDictation[] = [];
  //dictumColumns: LocalDataSource = new LocalDataSource();
  dictumSettings = { ...this.settings };
  proceedingColumns: IProceedingDeliveryReception[] = [];
  proceedingSettings = { ...this.settings };
  // selectedDictums: IDictation[] = [];
  selectedDictums: any[] = [];
  // selectedProceedings: IProceedingDeliveryReception[] = [];
  selectedProceedings: any[] = [];
  notifData: INotification = null;
  pageParams: IJuridicalShiftChangeParams = null;
  origin: any;
  acta: IUpdateActasEntregaRecepcionDelegation;
  dictation: IUpdateDelDictation;
  paramsDict = new BehaviorSubject<ListParams>(new ListParams());
  paramsActas = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItemsDic: number = 0;
  totalItemsActas: number = 0;
  newUser1: string;
  idUser: number;
  preUser: string;
  delegationNew: number;
  subdelegationNew: number;
  valid: boolean = false;
  idDelActa: number;
  idDelDicta: number;
  idArea: number;
  user: any;
  flyerNumber: number;
  historyColumns: IHistoryOfficial[] = [];
  historyUser: IHistoryOfficial = null;
  hitoryNewUser: IHistoryOfficial = null;
  usersFilter: IUserAccessAreaRelational[] = [];
  userNewFilter: IUserAccessAreaRelational[] = [];
  userHistory: string;
  usernewHistory: string;
  autoHeightDisabled: boolean;
  userSelected: any;
  checkDicta: any;

  form: ModelForm<any>;

  constructor(
    // private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private readonly authService: AuthService,
    private route: ActivatedRoute,
    private fileUpdComService: FileUpdateCommunicationService,
    private docRegisterService: DocReceptionRegisterService,
    private notifService: NotificationService,
    // private affairService: AffairService,
    private fileUpdateService: JuridicalFileUpdateService,
    private proceedingsDelRecService: ProceedingsDeliveryReceptionService,
    private dictationService: DictationService,
    private historyOfficeService: HistoryOfficialService,
    private flyerCopiesService: CopiesXFlierService,
    private procedureManageService: ProcedureManagementService,
    private proceedingsService: ProceedingsService,
    private fb: FormBuilder
  ) {
    super();
    this.dictumSettings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: { ...SHIFT_CHANGE_DICTUM_COLUMNS },
    };
    this.proceedingSettings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: { ...SHIFT_CHANGE_PROCEEDINGS_COLUMNS },
    };
    this.pageParams = this.fileUpdComService.juridicalShiftChangeParams;
    this.pageParams.iden ||= this.route.snapshot.params?.['iden'];
    this.pageParams.exp ||= this.route.snapshot.params?.['exp'];
    // console.log('PARAMS', this.pageParams);
    this.route.queryParamMap.subscribe(params => {
      this.origin = params.get('origin');
    });
    this.selectedProceedings = [];
    this.selectedDictums = [];
  }

  private get formControls() {
    return this.turnForm.controls;
  }

  ngOnInit(): void {
    //TODO: Deshablitar controles de fecha
    this.checkParams();
    this.getFilterUserHistory();
    this.filterHistoryUserBefore();
  }

  checkParams() {
    if (this.pageParams?.iden) {
      if (this.pageParams.iden) {
        //this.autoHeightDictaDisabled = false;
        this.getNotification();
        this.paramsDict
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getDictums());
      }
      if (this.pageParams.exp) {
        //this.autoHeightActaDisabled = false;
        this.paramsActas
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getProceedings());
      }
    } else {
      this.router.navigate(['/pages/juridical/file-data-update']);
    }
  }

  getUserSelected(params: ListParams) {
    this.userSelected = params;
    console.log(
      this.userSelected.delegationNumber,
      this.userSelected.subdelegationNumber,
      this.userSelected.departamentNumber
    );
  }

  usErrorUserPrev = false;
  getNotification() {
    const param = new FilterParams();
    param.addFilter('wheelNumber', this.pageParams.iden);
    this.notifService.getAllFilter(param.getParams()).subscribe({
      next: data => {
        if (data.count > 0) {
          const notif = data.data[0];
          this.notifData = notif;
          this.formControls.wheelNumber.setValue(notif.wheelNumber);
          this.formControls.externalRemitter.setValue(notif.externalRemitter);

          this.formControls.affair.setValue(this.pageParams.affair.nameAndId);
          this.formControls.receiptDate.setValue(
            format(new Date(notif.receiptDate), 'dd/MM/yyyy')
          );
          this.formControls.captureDate.setValue(
            format(new Date(notif.captureDate), 'dd/MM/yyyy')
          );
          this.formControls.captureDate.disable();
          this.formControls.receiptDate.disable();
          this.fileUpdateService
            .getRecipientUser({
              /*  copyNumber: 1, */ flierNumber: notif.wheelNumber,
            })
            .subscribe({
              next: data => {
                param.removeAllFilters();
                param.addFilter('user', data.copyuser);
                this.docRegisterService
                  .getUsersSegAreas(param.getParams())
                  .subscribe({
                    next: data => {
                      if (data.count > 0) {
                        this.formControls.prevUser.setValue(data.data[0]);
                      }
                    },
                    error: error => {
                      console.log('ERROR', error.error.message);
                    },
                  });
              },
              error: () => {
                //this.usErrorUserPrev = true;
                this.alert(
                  'error',
                  'Advertencia',
                  'El volante no tiene turnados'
                );
              },
            });
        }
      },
      error: () => {},
    });
  }

  getDictums() {
    // TODO: llenar dictamenes al tener filtros dinamicos
    this.loading = true;
    const param = new FilterParams();
    this.paramsDict.getValue()[
      'filter.wheelNumber'
    ] = `$eq:${this.pageParams.iden}`;

    this.dictationService
      .getAllWithFilters(this.paramsDict.getValue())
      .subscribe({
        next: data => {
          if (data.count > 0) {
            this.totalItemsDic = data.count || 0;
            this.dictumColumns = data.data;
            this.loading = false;
          }
        },
        error: err => {
          // console.log('DICTUMS', err.error.message);
        },
      });
  }

  getProceedings() {
    this.loading = true;
    this.paramsActas.getValue()[
      'filter.numFile'
    ] = `$eq:${this.pageParams.exp}`;
    this.proceedingsDelRecService
      .getAll(this.paramsActas.getValue())
      .subscribe({
        next: data => {
          if (data.count > 0) {
            //console.log(data.data);
            this.proceedingColumns = data.data;
            this.totalItemsActas = data.count;
            this.loading = false;
          }
        },
        error: err => {
          // console.log(err);
        },
      });
  }

  getFilterUserHistory() {
    let historyUser1: any = null;
    const param = new FilterParams();
    const params = new FilterParams();
    this.params.getValue()[
      'filter.numberSteeringwheel'
    ] = `$eq:${this.pageParams.iden}`;

    this.historyOfficeService.getAll(this.params.getValue()).subscribe({
      next: data => {
        if (data.count > 0) {
          this.totalItems = data.count || 0;
          this.historyColumns = data.data;
          const param1 = new FilterParams();
          const param = new ListParams();
          param['filter.numberSteeringwheel'] = `$eq:${this.pageParams.iden}`;
          param.page = 0;
          param.limit = this.totalItems;
          this.historyOfficeService.getAll(param).subscribe({
            next: data1 => {
              console.log(data1.data);
              console.log(data1.data.length + this.totalItems);
              this.historyUser =
                data1.data[data1.data.length - this.totalItems];
              param1.addFilter(
                'user',
                this.historyUser.personbefore,
                SearchFilter.EQ
              );
              this.docRegisterService
                .getUsersSegAreas(param1.getParams())
                .subscribe({
                  next: resp => {
                    if (resp.count > 0) {
                      this.usersFilter = resp.data;
                      console.log(this.usersFilter);
                      this.preUser = this.usersFilter[0].userAndName;
                      this.userHistory = this.usersFilter[0].user;
                    }
                  },
                  error: () => {
                    this.users = new DefaultSelect();
                  },
                });
            },
          });
        } else {
          this.userHistory = this.turnForm.controls['newUser'].value.user;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  async save() {
    if (!this.turnForm.valid) {
      this.turnForm.markAllAsTouched();
      this.turnForm.updateValueAndValidity();
      this.validation();
      return;
    }

    if (
      this.dictumColumns.length === 0 &&
      this.proceedingColumns.length === 0
    ) {
      this.autoHeightDisabled = true;
      this.autoHeightDisabled = true;
      this.valid = false;
      this.alert('warning', 'No se encontraron datos', '');
    } else {
      const body: IHistoryOfficial = {
        numberSteeringwheel: this.notifData.wheelNumber,
        datereassignment: format(new Date(), 'dd/MM/yyyy'),
        numberJob: this.notifData.officeNumber,
        personbefore: this.usernewHistory,
        areaDestinationbefore: this.notifData.departamentDestinyNumber,
        personnew: this.userSelected.user,
        areaDestinationnew: Number(this.formControls.newUser.value?.delegation),
        argument: this.formControls.argument.value,
        numberRecord: this.notifData.registerNumber,
        cveJobExternal: this.notifData.officeExternalKey,
        numberOftheDestinationbefore: this.notifData.delDestinyNumber,
        numberSubdelDestinationbefore: this.notifData.subDelDestinyNumber,
        numberOftheDestinationnew: Number(
          this.formControls.newUser.value?.delegation.id
        ),
        numberSubdelDestinationnew: Number(
          this.userSelected.subdelegationNumber
        ),
        nbOrigin: this.origin,
      };
      console.log(
        this.turnForm.value,
        body,
        this.selectedDictums,
        this.selectedProceedings
      );
      this.loading = true;

      try {
        await firstValueFrom(this.historyOfficeService.create(body));
        this.updateProceedings();
        this.updateDictums();
        this.loading = false;
      } catch (ex) {
        this.loading = false;
        this.alert('error', ' ', 'Turno no actualizado');
        return;
      }

      try {
        await firstValueFrom(
          this.procedureManageService.updateForWheelNumber(
            this.notifData.wheelNumber,
            {
              tiKeyNewPerson: this.userSelected.user,
            }
          )
        );
        this.updateNotification();
      } catch (ex) {
        //console.log(ex);
        this.alert('error', 'Turno no actualizado', '');
        this.loading = false;
      }
    }
  }

  updateNotification() {
    const body = {
      delDestinyNumber: this.userSelected.delegationNumber,
      subDelDestinyNumber: this.userSelected.subdelegationNumber,
      departamentDestinyNumber: this.userSelected.departamentNumber,
    };
    console.log(body);

    this.notifService.update(this.notifData.wheelNumber, body).subscribe({
      next: () => {
        this.updateProcedureUser();
        this.loading = true;
        this.clean();
        this.alert(
          'success',
          'Usuario Turnado Exitosamente',
          `Se actualizó el usuario turnado al volante ${this.pageParams.iden}`
        );
      },
      error: err => {
        this.loading = false;
        this.alert(
          'error',
          'Turno no actualizado',
          'Hubo un error al actualizar el turno'
        );
      },
    });
  }

  clean() {
    this.turnForm.controls['newUser'].setValue(null);
    this.turnForm.controls['argument'].setValue(null);
    this.checkParams();
    this.valid = false;
    this.loading = false;
    this.selectedProceedings.splice(0, this.selectedProceedings.length);
    this.selectedDictums.splice(0, this.selectedDictums.length);
    //console.log(this.selectedProceedings.length, this.selectedDictums.length);
  }

  updateProcedureUser() {
    this.procedureManageService
      .update(this.pageParams.pNoTramite, {
        userTurned: this.userSelected.user,
      })
      .subscribe({
        next: res => {
          console.log(res);
          this.getFilterUserHistory();
          this.filterHistoryUserBefore();
          this.loading = false;
        },
        error: () => {},
      });
  }

  // UPDATE DICTÁMENES //
  updateDictums() {
    const data: any[] = [];
    console.log(data);
    if (this.dictumColumns.length === 0 || this.selectedDictums.length === 0) {
      data.push({
        delegationDictateNumber: null,
        ofDictaNumber: null,
      });
    } else if (
      this.dictumColumns.length > 0 &&
      this.selectedDictums.length === 0
    ) {
      this.alert('warning', 'Debe llenar los campo requeridos', ``);
    } else if (
      this.dictumColumns.length > 0 &&
      this.selectedDictums.length > 0
    ) {
      this.selectedDictums.forEach(val => {
        data.push({
          delegationDictateNumber: Number(this.userSelected.delegationNumber),
          ofDictaNumber: Number(val.id),
        });
      });
    }
    console.log(data);

    this.dictationService.updateDictaEntregaRTurno(data).subscribe({
      next: resp => {
        console.log(resp);
        this.loading = false;
      },
      error: () => {
        console.log(Error);
      },
    });
  }

  // UPDATE ACTAS //
  updateProceedings() {
    const data: any[] = [];
    console.log(data);
    if (
      this.proceedingColumns.length === 0 ||
      this.selectedProceedings.length === 0
    ) {
      data.push({
        minutesNumber: null,
        delegation2Number: null,
      });
    } else if (
      this.proceedingColumns.length > 0 &&
      this.selectedProceedings.length === 0
    ) {
      this.alert('warning', 'Debe llenar los campo requeridos', ``);
    } else if (
      this.proceedingColumns.length > 0 &&
      this.selectedProceedings.length > 0
    ) {
      this.selectedProceedings.forEach(val => {
        data.push({
          minutesNumber: Number(val.id),
          delegation2Number: Number(this.userSelected.delegationNumber),
        });
      });
    }
    console.log(data);
    this.proceedingsService.updateActasEntregaRTurno(data).subscribe({
      next: resp => {
        console.log(resp);
        this.loading = false;
      },
      error: err => {
        console.log(err.message);
      },
    });
  }

  goBack() {
    let params = this.fileUpdComService.fileDataUpdateParams;
    params = {
      pGestOk: 1,
      pNoTramite: this.pageParams?.pNoTramite,
      dictamen: false,
    };
    this.fileUpdComService.fileDataUpdateParams = params;
    if (this.origin == 'ABANDONMENT') {
      this.router.navigateByUrl(
        '/pages/juridical/abandonments-declaration-trades'
      );
    } else {
      this.router.navigate(['/pages/juridical/file-data-update'], {
        queryParams: {
          wheelNumber: this.pageParams.iden,
          previousRoute: this.route.snapshot.queryParams?.['previousRoute'],
        },
      });
    }
  }

  showHistory() {
    this.modalService.show(ShiftChangeHistoryComponent, {
      initialState: { flyerNumber: this.pageParams.iden },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  selectDictums(event: any) {
    if (this.turnForm.controls['newUser'].value === null) {
      this.alert('warning', 'Debe seleccionar un usuario', ``);
      this.selectedDictums.splice(0, this.selectedDictums.length);
      this.checkParams();
    } else {
      const existe = this.selectedDictums.some(
        (objeto: any) => objeto.id === event.data.id
      );
      console.log(existe);
      if (existe) {
        // Eliminar el objeto si ya existe en el arreglo
        const index = this.selectedDictums.findIndex(
          objeto => objeto.id === event.data.id
        );
        this.selectedDictums.splice(index, 1);
      } else {
        // Agregar el objeto al arreglo
        //event.data = this.userSelected.delegationNumber.numDelegation2;
        this.selectedDictums.push(event.data);
      }
    }

    //console.log(this.selectedDictums);
    if (
      this.selectedDictums.length === 0 &&
      this.selectedProceedings.length === 0
    ) {
      this.valid = false;
    } else {
      this.valid = true;
    }
  }

  selectProceedings(event: any) {
    console.log(event.selectedIndex);
    console.log(this.selectedProceedings);
    if (this.turnForm.controls['newUser'].value === null) {
      this.alert('warning', 'Debe seleccionar un usuario', ``);
      this.selectedDictums.splice(0, this.selectedProceedings.length);
      this.checkParams();
    } else {
      const existe = this.selectedProceedings.some(
        (objeto: any) => objeto.id === event.data.id
      );
      if (existe) {
        // Eliminar el objeto si ya existe en el arreglo
        const index = this.selectedProceedings.findIndex(
          objeto => objeto.id === event.data.id
        );
        this.selectedProceedings.splice(index, 1);
      } else {
        // Agregar el objeto al arreglo
        this.checkDicta = event.data;
        if (
          this.userSelected.delegationNumber === this.checkDicta.numDelegation2
        ) {
          this.alert('warning', 'Se asigno al turno anterior', ``);
          this.selectedProceedings.push(event.data);
        } else {
          this.selectedProceedings.push(event.data);
        }
        /*this.checkDicta = event.data;
        console.log(this.checkDicta.numDelegation2);
        this.selectedProceedings.push(event.data);**/
      }
    }
    //console.log(this.selectedProceedings);
    if (
      this.selectedProceedings.length === 0 &&
      this.selectedDictums.length === 0
    ) {
      this.valid = false;
    } else {
      this.valid = true;
    }
  }

  getUsersCopy(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);
    this.docRegisterService.getUsersSegAreas(params.getParams()).subscribe({
      next: data => {
        this.users = new DefaultSelect(data.data, data.count);

        //this.filterHistoryUser(this.turnForm.controls['newUser'].value.user);
      },
      error: () => {
        this.users = new DefaultSelect();
        this.newUser1 = 'El volante no tiene turnados';
      },
    });
  }

  filterHistoryUser(user: string) {
    this.loading = true;
    const param = new FilterParams();
    const params = new ListParams();
    const data1: any = {};

    param.addFilter('user', user, SearchFilter.EQ);
    this.docRegisterService.getUsersSegAreas(param.getParams()).subscribe({
      next: resp => {
        this.usersFilter = resp.data;
        console.log(this.usersFilter[0].userAndName);
        if (
          this.usersFilter[0].userAndName != null ||
          this.usersFilter[0].userAndName != undefined
        ) {
          this.newUser1 = this.usersFilter[0].userAndName;
          //this.
          console.log(this.usersFilter);
        }
      },
      error: () => {
        this.users = new DefaultSelect();
      },
    });
  }

  filterHistoryUserBefore() {
    let historyUser1: any = null;
    const param = new FilterParams();
    const params = new FilterParams();
    this.params.getValue()[
      'filter.numberSteeringwheel'
    ] = `$eq:${this.pageParams.iden}`;

    this.historyOfficeService.getAll(this.params.getValue()).subscribe({
      next: data => {
        if (data.count > 0) {
          this.totalItems = data.count || 0;
          this.historyColumns = data.data;
          const param1 = new FilterParams();
          const param = new ListParams();
          param['filter.numberSteeringwheel'] = `$eq:${this.pageParams.iden}`;
          param.page = 0;
          param.limit = this.totalItems;
          this.historyOfficeService.getAll(param).subscribe({
            next: data1 => {
              console.log(data1.data);
              console.log(data1.data.length + this.totalItems);
              this.hitoryNewUser =
                data1.data[data1.data.length - this.totalItems];
              param1.addFilter(
                'user',
                this.hitoryNewUser.personnew,
                SearchFilter.EQ
              );
              this.docRegisterService
                .getUsersSegAreas(param1.getParams())
                .subscribe({
                  next: resp => {
                    if (resp.count > 0) {
                      this.userNewFilter = resp.data;
                      console.log(this.userNewFilter);
                      this.newUser1 = this.userNewFilter[0].userAndName;
                      this.usernewHistory = this.userNewFilter[0].user;
                    }
                  },
                  error: () => {
                    this.users = new DefaultSelect();
                  },
                });
            },
          });
        } else {
          this.usernewHistory = this.turnForm.controls['newUser'].value.user;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  validation() {
    if (
      this.turnForm.controls['newUser'].value === null ||
      this.turnForm.controls['argument'].value === null
    ) {
      this.alert('warning', 'Debe llenar los campo requeridos', ``);
    }
  }
}
