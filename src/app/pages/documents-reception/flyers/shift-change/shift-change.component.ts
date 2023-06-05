import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
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
  dictumSettings = { ...this.settings };
  proceedingColumns: IProceedingDeliveryReception[] = [];
  proceedingSettings = { ...this.settings };
  // selectedDictums: IDictation[] = [];
  selectedDictums: IUpdateDelDictation[] = [];
  // selectedProceedings: IProceedingDeliveryReception[] = [];
  selectedProceedings: IUpdateActasEntregaRecepcionDelegation[] = [];
  notifData: INotification = null;
  pageParams: IJuridicalShiftChangeParams = null;
  origin: any;
  acta: IUpdateActasEntregaRecepcionDelegation;
  dictation: IUpdateDelDictation;
  paramsDict = new BehaviorSubject(new ListParams());
  paramsActas = new BehaviorSubject(new ListParams());
  totalItemsDic: number;
  totalItemsActas: number;
  newUser: string;
  preUser: string;
  delegationNew: number;
  subdelegationNew: number;
  idDelActa: number;
  idDelDicta: number;
  idArea: number;
  user: IUserAccessAreaRelational;
  flyerNumber: number;
  historyColumns: IHistoryOfficial[] = [];
  usersFilter: IUserAccessAreaRelational[] = [];

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
    private proceedingsService: ProceedingsService
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
  }

  private get formControls() {
    return this.turnForm.controls;
  }

  ngOnInit(): void {
    //TODO: Deshablitar controles de fecha
    this.checkParams();
    this.filterHistoryUser();
    // console.log('AQUÍ', this.pageParams.affair);
  }

  checkParams() {
    if (this.pageParams?.iden) {
      if (this.pageParams.iden) {
        this.getNotification();
        this.getDictums();
      }
      if (this.pageParams.exp) {
        this.getProceedings();
      }
    } else {
      this.router.navigate(['/pages/juridical/file-data-update']);
    }
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
          // if (notif.affairKey != null)
          //   this.affairService.getById(notif.affairKey).subscribe({
          //     next: data => {
          //       this.formControls.affair.setValue(data.description);
          //     },
          //   });
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
                        this.preUser = data.data[0].userAndName;
                        // console.log(this.preUser);
                      }
                    },
                    error: error => {
                      console.log('ERROR', error.error.message);
                    },
                  });
              },
              error: () => {
                this.usErrorUserPrev = true;
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
    const param = new FilterParams();
    param.addFilter('wheelNumber', this.pageParams.iden);
    this.dictationService.getAllWithFilters(param.getParams()).subscribe({
      next: data => {
        if (data.count > 0) {
          //console.log('DICTUMS', data.data);
          this.dictumColumns = data.data;
          this.totalItemsDic = data.count;
        }
      },
      error: err => {
        // console.log('DICTUMS', err.error.message);
      },
    });
  }

  getProceedings() {
    const param = new FilterParams();
    param.addFilter('numFile', this.pageParams.exp);
    this.proceedingsDelRecService.getAll(param.getParams()).subscribe({
      next: data => {
        if (data.count > 0) {
          //console.log(data.data);
          this.proceedingColumns = data.data;
          this.totalItemsActas = data.count;
        }
      },
      error: err => {
        // console.log(err);
      },
    });
  }

  async save() {
    if (!this.turnForm.valid) {
      this.turnForm.markAllAsTouched();
      this.turnForm.updateValueAndValidity();
      return;
    }

    // this.preUser;
    const body: IHistoryOfficial = {
      numberSteeringwheel: this.notifData.wheelNumber,
      datereassignment: format(new Date(), 'dd/MM/yyyy'),
      numberJob: this.notifData.officeNumber,
      personbefore: this.formControls.prevUser.value?.user,
      areaDestinationbefore: this.notifData.departamentDestinyNumber,
      personnew: this.formControls.newUser.value?.user,
      areaDestinationnew: this.idArea,
      argument: this.formControls.argument.value,
      numberRecord: this.notifData.registerNumber,
      cveJobExternal: this.notifData.officeExternalKey,
      numberOftheDestinationbefore: this.notifData.delDestinyNumber,
      numberSubdelDestinationbefore: this.notifData.subDelDestinyNumber,
      numberOftheDestinationnew:
        this.formControls.prevUser.value?.delegationNumber,
      numberSubdelDestinationnew:
        this.formControls.newUser.value?.subdelegationNumber,
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
    } catch (ex) {
      this.loading = false;
      // await firstValueFrom(this.historyOfficeService.update(body));
      this.alert('error', ' ', 'Turno no actualizado');
      return;
    }
    try {
      await firstValueFrom(
        this.procedureManageService.updateForWheelNumber(
          this.notifData.wheelNumber,
          {
            tiKeyNewPerson: this.formControls.newUser.value?.user,
          }
        )
      );
      this.updateNotification();
      this.users = new DefaultSelect();
    } catch (ex) {
      //console.log(ex);
      this.alert('error', 'Turno no actualizado', '');
      this.loading = false;
    }
  }

  updateNotification() {
    const body = {
      delDestinyNumber: this.formControls.newUser.value?.delegationNumber,
      subDelDestinyNumber: this.formControls.newUser.value?.subdelegationNumber,
      departamentDestinyNumber:
        this.formControls.newUser.value?.departamentNumber,
    };
    this.notifService.update(this.notifData.wheelNumber, body).subscribe({
      next: () => {
        this.updateProcedureUser();
        // this.updateDictums();
        // this.updateProceedings();
        this.loading = true;
        this.preUser = this.newUser;
        this.filterHistoryUser();
        this.alert(
          'success',
          'Usuario Turnado Exitosamente',
          `Se actualizó el usuario turnado al volante ${this.pageParams.iden}`
        );
      },
      error: err => {
        // console.log(err);
        this.loading = false;
        this.alert(
          'error',
          'Turno no actualizado',
          'Hubo un error al actualizar el turno'
        );
      },
    });
  }

  updateProcedureUser() {
    this.procedureManageService
      .update(this.pageParams.pNoTramite, {
        userTurned: this.formControls.newUser.value?.user,
      })
      .subscribe({
        next: res => {
          console.log(res);
        },
        error: () => {},
      });
  }

  // UPDATE DICTÁMENES //
  updateDictums() {
    this.dictationService.updateDictaEntregaRTurno(this.dictation).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: () => {
        this.alert('info', 'La delegacion actual es igual a la anterior', '');
      },
    });
  }

  // UPDATE ACTAS //
  updateProceedings() {
    this.proceedingsService.updateActasEntregaRTurno(this.acta).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {
        this.alert('info', 'La delegacion actual es igual a la anterior', '');
      },
    });
    // });
  }

  goBack() {
    let params = this.fileUpdComService.fileDataUpdateParams;
    params = {
      pGestOk: 1,
      pNoTramite: this.pageParams?.pNoTramite,
      dictamen: false,
    };
    // if (params == null) {
    // } else {
    //   params.dictamen = false;
    // }
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

  // selectDictums(event: IUserRowSelectEvent<IDictation>) {
  //   this.selectedDictums = event.selected;
  //   console.log({ selectedDictums: this.selectedDictums });
  // }

  // selectProceedings(event: IUserRowSelectEvent<IProceedingDeliveryReception>) {
  //   console.log(event);
  //   this.selectedProceedings = event.selected;
  // }

  selectDictums(event: any) {
    this.idDelDicta = event.data.id;
    let params: IUpdateDelDictation = {
      ofDictaNumber: event.data.id,
      delegationDictateNumber:
        this.formControls.newUser?.value.delegationNumber,
    };
    this.dictation = params;
    console.log(this.dictation);
    this.updateDictums();
  }

  selectProceedings(event: any) {
    this.idDelActa = event.data.id;
    let params: IUpdateActasEntregaRecepcionDelegation = {
      minutesNumber: event.data.id,
      delegation2Number: this.formControls.newUser?.value.delegationNumber,
    };
    this.acta = params;
    console.log(this.acta);
    this.updateProceedings();
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
        // data.data.forEach(data => {
        //   this.delegationNew = data.delegation1Number;
        //   this.subdelegationNew = data.;
        //   this.idArea = data.departament1Number;
        //   console.log(data);
        // });
      },
      error: () => {
        this.users = new DefaultSelect();
      },
    });
  }

  filterHistoryUser() {
    this.loading = true;
    const param = new FilterParams();
    const params = new ListParams();
    const data1: any = {};
    //param.addFilter('flyerNumber', this.flyerNumber);
    params['filter.flyerNumber'] = `$eq:${this.pageParams.iden}`;
    // console.log(this.pageParams.iden);
    this.historyOfficeService.getFilterUser(params).subscribe({
      next: data => {
        if (data.count > 0) {
          this.historyColumns = data.data;
          this.historyColumns[0].personnew;
          //param['filter.flyerNumber'] = `$eq:${this.newUser}`;
          //params.page = lparams.page;
          //params.limit = lparams.limit;
          param.addFilter(
            'user',
            this.historyColumns[0].personnew,
            SearchFilter.EQ
          );
          this.docRegisterService
            .getUsersSegAreas(param.getParams())
            .subscribe({
              next: resp => {
                //this.users = new DefaultSelect(data.data, data.count);
                this.usersFilter = resp.data;

                console.log(this.usersFilter);
                this.newUser = this.usersFilter[0].userAndName;
                if (
                  this.usersFilter[0].userAndName != null ||
                  this.usersFilter[0].userAndName != undefined
                ) {
                  this.newUser = this.usersFilter[0].userAndName;
                }
                //console.log(this.preUser);
              },
              error: () => {
                this.users = new DefaultSelect();
              },
            });
          //console.log(this.historyColumns[0].personNew);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
