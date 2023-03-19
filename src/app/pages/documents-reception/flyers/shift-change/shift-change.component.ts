import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { Router } from '@angular/router';
import { format } from 'date-fns';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from '../../../../common/repository/interfaces/list-params';
import { IUserRowSelectEvent } from '../../../../core/interfaces/ng2-smart-table.interface';
import { IOpinion } from '../../../../core/models/catalogs/opinion.model';
import { INotification } from '../../../../core/models/ms-notification/notification.model';
import { IProceedingDeliveryReception } from '../../../../core/models/ms-proceedings/proceeding-delivery-reception';
import { IUserAccessAreaRelational } from '../../../../core/models/ms-users/seg-access-area-relational.model';
import { AffairService } from '../../../../core/services/catalogs/affair.service';
import { DocReceptionRegisterService } from '../../../../core/services/document-reception/doc-reception-register.service';
import { NotificationService } from '../../../../core/services/ms-notification/notification.service';
import { ProceedingsDeliveryReceptionService } from '../../../../core/services/ms-proceedings/proceedings-delivery-reception.service';
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
    `,
  ],
})
export class RdFShiftChangeComponent extends BasePage implements OnInit {
  turnForm = this.fb.group({
    wheelNumber: new FormControl<number>(null, Validators.required),
    affair: new FormControl<string>(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
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
  dictumColumns: IOpinion[] = [];
  dictumSettings = { ...this.settings };
  proceedingColumns: IProceedingDeliveryReception[] = [];
  proceedingSettings = { ...this.settings };
  selectedDictums: IOpinion[] = [];
  selectedProceedings: IProceedingDeliveryReception[] = [];
  notifData: INotification = null;
  pageParams: IJuridicalShiftChangeParams = null;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private fileUpdComService: FileUpdateCommunicationService,
    private docRegisterService: DocReceptionRegisterService,
    private notifService: NotificationService,
    private affairService: AffairService,
    private fileUpdateService: JuridicalFileUpdateService,
    private proceedingsDelRecService: ProceedingsDeliveryReceptionService
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
  }

  private get formControls() {
    return this.turnForm.controls;
  }

  ngOnInit(): void {
    //TODO: Deshablitar controles de fecha
    this.checkParams();
  }

  checkParams() {
    if (this.pageParams != null) {
      if (this.pageParams.iden) {
        this.getNotification();
        this.getDictums();
      }
      if (this.pageParams.exp) {
        this.getProceedings();
      }
    }
  }

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
          this.formControls.receiptDate.setValue(
            format(new Date(notif.receiptDate), 'd/MM/yyyy')
          );
          this.formControls.captureDate.setValue(
            format(new Date(notif.captureDate), 'd/MM/yyyy')
          );
          if (notif.affairKey != null)
            this.affairService.getById(notif.affairKey).subscribe({
              next: data => {
                this.formControls.affair.setValue(data.description);
              },
            });
          this.fileUpdateService
            .getRecipientUser({ copyNumber: 1, flierNumber: notif.wheelNumber })
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
                    error: () => {},
                  });
              },
              error: () => {},
            });
        }
      },
      error: () => {},
    });
  }

  getDictums() {
    // TODO: llenar dictamenes al tener filtros dinamicos
  }

  getProceedings() {
    const param = new FilterParams();
    param.addFilter('numFile', this.pageParams.exp);
    this.proceedingsDelRecService.getAll(param.getParams()).subscribe({
      next: data => {
        if (data.count > 0) {
          console.log(data.data);
          this.proceedingColumns = data.data;
        }
      },
      error: err => {
        console.log(err);
      },
    });
  }

  save() {
    this.turnForm.markAllAsTouched();
  }

  return() {
    let params = this.fileUpdComService.fileDataUpdateParams;
    if (params == null) {
      params = {
        pGestOk: null,
        pNoTramite: null,
        dictamen: false,
      };
    } else {
      params.dictamen = false;
    }
    this.fileUpdComService.fileDataUpdateParams = params;
    this.router.navigateByUrl('/pages/juridical/file-data-update');
  }

  showHistory() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(ShiftChangeHistoryComponent, modalConfig);
  }

  selectDictums(event: IUserRowSelectEvent<IOpinion>) {
    console.log(event);
    this.selectedDictums = event.selected;
  }

  selectProceedings(event: IUserRowSelectEvent<IProceedingDeliveryReception>) {
    console.log(event);
    this.selectedProceedings = event.selected;
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
}
