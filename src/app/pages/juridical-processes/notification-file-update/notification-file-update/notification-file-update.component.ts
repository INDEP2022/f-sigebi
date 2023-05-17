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
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MODAL_CONFIG } from '../../../../common/constants/modal-config';
import { EditFormComponent } from '../edit-form/edit-form.component';
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
  COLUMNS = {
    wheelNumber: {
      title: 'No Volante',
    },
    affairKey: {
      title: 'Asunto',
    },
    observations: {
      title: 'Descripción',
    },
    captureDate: {
      title: 'Fecha Captura',
    },
    protectionKey: {
      title: 'Clave Amparo',
    },
    preliminaryInquiry: {
      title: 'Averiguación Previa',
    },
    criminalCase: {
      title: 'Causa Penal',
    },
    expedientNumber: {
      title: 'No Expediente',
    },
  };

  dataFactGen: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = this.COLUMNS;
    this.settings.actions.delete = true;
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
      noExpediente: ['', [Validators.required]],
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
    }
  }

  onLoadListNotifications() {
    const param = new FilterParams();
    param.addFilter('expedientNumber', this.form.get('noExpediente').value);
    this.notificationService.getAllFilter(param.getParams()).subscribe({
      next: data => {
        this.dataFactGen = data.data;
        // this.dataFactGen[0].description = data.data[0].departament.description;
        this.loading = false;
      },
      error: () => {
        this.dataFactGen = [];
        this.loading = false;
      },
    });
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
}
