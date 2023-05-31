// FIXME: Poner tabla
/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { MODAL_CONFIG } from '../../../../common/constants/modal-config';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { NOTIFICATION_COLUMNS } from './notification-file-update-columns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-notification-file-update',
  templateUrl: './notification-file-update.component.html',
  styleUrls: ['./notification-file-update.component.scss'],
})
export class NotificationFileUpdateComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  override loading: boolean = true;
  totalItems: number = 0;
  dataFactGen: INotification[] = [];
  verBoton: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParamsLocal = new BehaviorSubject<FilterParams>(new FilterParams());

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: { ...NOTIFICATION_COLUMNS },
    };
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
    this.getParams();
  }

  getParams() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.form
          .get('noExpediente')
          .setValue(
            params['noExpediente'] ? Number(params['noExpediente']) : undefined
          );
      });
    this.onLoadListNotifications();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: [
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(11),
        ],
      ],
    });
  }

  public get noExpediente() {
    return this.form.get('noExpediente');
  }

  mostrarInfo(): any {
    console.log(this.form.value);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onLoadListNotifications();
      this.verBoton = true;
    }
  }

  onLoadListNotifications() {
    const param = new FilterParams();
    const params = new ListParams();
    if (this.form.get('noExpediente').value != null) {
      param.addFilter('expedientNumber', this.form.get('noExpediente').value);
      this.notificationService.getAllFilter(param.getParams()).subscribe({
        next: data => {
          this.dataFactGen = data.data;
          // this.dataFactGen[0].description = data.data[0].departament.description;
          this.loading = false;
        },
        error: err => {
          this.dataFactGen = [];
          this.loading = false;
          this.onLoadToast('error', 'Error', err.error.message);
        },
      });
      this.verBoton = false;
    } else {
      this.verBoton = true;
      this.loading = false;
    }
  }

  getDicts() {
    this.loading = true;
    // let params = {
    //   ...this.params.getValue(),
    //   ...this.columnFilters,
    // };
    // this.deductiveService.getAll(params).subscribe({
    //   next: response => {
    //     this.deductives = response.data;
    //     this.totalItems = response.count || 0;
    //     this.data.load(response.data);
    //     this.data.refresh();
    //     this.loading = false;
    //   },
    //   error: error => (this.loading = false),
    // });
  }

  openForm(dict?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      dict,
      callback: (next: boolean) => {
        if (next) this.getDicts();
      },
    };
    this.modalService.show(EditFormComponent, modalConfig);
  }

  showDeleteAlert(deductive: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        // ...
        // this.delete(deductive.id);
      }
    });
  }

  cleanExpediente() {
    this.verBoton = true;
    this.form.get('noExpediente').setValue('');
  }
}
