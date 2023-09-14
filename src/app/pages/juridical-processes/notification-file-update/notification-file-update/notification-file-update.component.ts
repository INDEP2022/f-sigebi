// FIXME: Poner tabla
/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
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
  @Output() formSubmitted = new EventEmitter<any>();
  formData: any;
  override loading: boolean = true;
  totalItems: number = 0;
  columnFilters: any = [];
  //dataFactGen: INotificationUpdate[] = [];
  dataFactGen: LocalDataSource = new LocalDataSource();
  verBoton: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParamsLocal = new BehaviorSubject<FilterParams>(new FilterParams());
  filter: string;
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
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: { ...NOTIFICATION_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.dataFactGen
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'wheelNumber'
              ? (field = `filter.${filter.field}`)
              : (field = `filter.${filter.field}`);
            filter.field == 'wheelNumber'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getFilterExpedientNumber());
        }
      });

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
    if (this.form.get('noExpediente').value != null) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getFilterExpedientNumber());
      //this.filterColumn();
      this.verBoton = false;
    } else {
      this.verBoton = true;

      this.loading = false;
    }
  }

  getFilterExpedientNumber() {
    const param = new FilterParams();
    const params = new ListParams();
    this.loading = true;
    this.params.getValue()[
      'filter.expedientNumber'
    ] = `$eq:${this.form.controls['noExpediente'].value}`;

    let para = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.notificationService.getAllFilterExpedient(para).subscribe({
      next: data => {
        if (data.count > 0) {
          this.totalItems = data.count || 0;
          this.dataFactGen.load(data.data);
          this.dataFactGen.refresh();
          //console.log(data.data);
          this.loading = false;
        }
      },
      error: err => {
        this.loading = false;
        this.onLoadToast('error', 'Error', err.error.message);
      },
    });
  }

  getDicts() {
    this.loading = false;
    this.onLoadListNotifications();
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
    //this.onLoadListNotifications();
  }
}
