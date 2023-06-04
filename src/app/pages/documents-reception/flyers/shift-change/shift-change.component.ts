import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { firstValueFrom } from 'rxjs';
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
  newUser: string;
  preUser: string;

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
        }
      },
      error: err => {
        // console.log(err);
      },
    });
  }

  // async save() {
  //   if (!this.turnForm.valid) {
  //     this.turnForm.markAllAsTouched();
  //     this.turnForm.updateValueAndValidity();
  //     return;
  //   }
  //   const body = {
  //     flyerNumber: this.notifData.wheelNumber,
  //     reassignmentDate: format(new Date(), 'dd-MM-yyyy'),
  //     officialNumber: this.notifData.officeNumber,
  //     personPrevious: this.formControls.prevUser.value?.user,
  //     areaDestinationPrevious: this.notifData.departamentDestinyNumber,
  //     personNew: this.formControls.newUser.value?.user,
  //     argument: this.formControls.argument.value,
  //   };
  //   this.preUser
  //   console.log(
  //     this.turnForm.value,
  //     body,
  //     this.selectedDictums,
  //     this.selectedProceedings
  //   );
  //   this.loading = true;
  //   try {
  //     await firstValueFrom(this.historyOfficeService.create(body));
  //   } catch (ex) {
  //     this.loading = false;
  //     this.alert('error', 'Error ', 'Los ids ya fueron creados');
  //     return;
  //   }
  //   try {
  //     await firstValueFrom(
  //       this.procedureManageService.updateForWheelNumber(
  //         this.notifData.wheelNumber,
  //         {
  //           tiKeyNewPerson: this.formControls.newUser.value?.user,
  //         }
  //       )
  //     );
  //     this.updateNotification();
  //   } catch (ex) {
  //     //console.log(ex);
  //     this.alert('error', 'Error ', 'Error al crear histórico');
  //     this.loading = false;
  //   }
  //   this.historyOfficeService.create(body).subscribe({
  //     next: () => {
  //       this.updateFlyerCopy();
  //     },
  //     error: err => {
  //       console.log(err);
  //       this.loading = false;
  //       this.alert('error', 'Turno no actualizado', err.error.message);
  //     },
  //   });
  // }

  // updateFlyerCopy() {
  //   const body = {
  //     copyNumber: 1,
  //     flierNumber: this.notifData.wheelNumber,
  //     copyuser: this.formControls.newUser.value?.user,
  //   };
  //   this.flyerCopiesService.update(body).subscribe({
  //     next: () => {
  //       this.updateNotification();
  //     },
  //     error: err => {
  //       console.log(err);
  //       this.loading = false;
  //       this.alert(
  //         'error',
  //         'Turno no actualizado',
  //         'Hubo un error al actualizar el turno'
  //       );
  //     },
  //   });
  // }
  async save() {
    if (!this.turnForm.valid) {
      this.turnForm.markAllAsTouched();
      this.turnForm.updateValueAndValidity();
      return;
    }
    const body = {
      flyerNumber: this.notifData.wheelNumber,
      reassignmentDate: format(new Date(), 'dd-MM-yyyy'),
      officialNumber: this.notifData.officeNumber,
      personPrevious: this.formControls.prevUser.value?.user,
      areaDestinationPrevious: this.notifData.departamentDestinyNumber,
      personNew: this.formControls.newUser.value?.user,
      argument: this.formControls.argument.value,
    };
    // this.preUser
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
      await firstValueFrom(this.historyOfficeService.update(body));
      this.alert('info', ' ', 'Actualizado correctamente');
      // return;
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
    } catch (ex) {
      //console.log(ex);
      this.alert('error', 'Turno no actualizado', '');
      this.loading = false;
    }
    // this.historyOfficeService.create(body).subscribe({
    //   next: () => {
    //     this.updateFlyerCopy();
    //   },
    //   error: err => {
    //     console.log(err);
    //     this.loading = false;
    //     this.alert('error', 'Turno no actualizado', err.error.message);
    //   },
    // });
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
        this.updateDictums();
        this.updateProceedings();
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
    if (this.selectedDictums.length > 0) {
      this.dictationService.updateDictaEntregaRTurno(this.dictation).subscribe({
        next: resp => {
          console.log(resp);
        },
        error: () => {},
      });
    }
  }

  // UPDATE ACTAS //
  updateProceedings() {
    if (this.selectedProceedings.length > 0) {
      // this.selectedProceedings.forEach(p => {
      this.proceedingsService.updateActasEntregaRTurno(this.acta).subscribe({
        next: resp => {
          console.log(resp);
        },
        error: err => {
          console.log(err);
        },
      });
      // });
    }
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
    console.log(event.data.id);
    console.log(event.data.delegationDictNumber);
    // this.selectedDictums = event.selected;
    // console.log({ selectedDictums: this.selectedDictums });
    let params: IUpdateDelDictation = {
      id: event.data.id,
      delegationDictNumber: event.data.delegationDictNumber,
    };
    this.dictation = params;
  }

  selectProceedings(event: any) {
    console.log(event);
    // console.log(event.data.id);
    // console.log(event.data.delegationDictNumber);
    // this.selectedDictums = event.selected;
    // console.log({ selectedDictums: this.selectedDictums });
    // let params: IUpdateActasEntregaRecepcionDelegation = {
    //   id: event.data.id,
    //   delegationDictNumber: event.data.delegationDictNumber,
    // };
    // this.acta = params;
    // this.selectedProceedings = event.selected;
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
          this.historyColumns[0].personNew;
          //param['filter.flyerNumber'] = `$eq:${this.newUser}`;
          //params.page = lparams.page;
          //params.limit = lparams.limit;
          param.addFilter(
            'user',
            this.historyColumns[0].personNew,
            SearchFilter.EQ
          );
          this.docRegisterService
            .getUsersSegAreas(param.getParams())
            .subscribe({
              next: resp => {
                //this.users = new DefaultSelect(data.data, data.count);
                this.usersFilter = resp.data;
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
