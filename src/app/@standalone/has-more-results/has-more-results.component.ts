import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, skip } from 'rxjs';
import { API_VERSION } from 'src/app/common/helpers/helpers';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

export const SettingTableDefault = {
  selectMode: '',
  selectedRowIndex: -1,
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    add: false,
    edit: false,
    delete: false,
  },
  attr: {
    class: 'table-bordered',
  },
  pager: {
    display: false,
  },
  hideSubHeader: true,
  mode: 'external',
  add: {},
  edit: {
    editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
  },
  delete: {
    deleteButtonContent: '<i class="fa fa-trash text-danger mx-2"></i>',
    confirmDelete: true,
  },
  columns: {},
  noDataMessage: 'No se encontraron registros',
  rowClassFunction: (row: any) => {},
};

/**
 * @params columns: {
        id: {
          title: 'Identificador',
        },
        expedientNumber: {
          title: 'Número de expediente',
        },
        wheelNumber: {
          title: 'Número de volante',
        },
        typeDict: {
          title: 'Tipo de dictamen',
        },
        status: {
          title: 'Estatus',
        },
      },
    *@params totalItems: data ? data.count : 0,
    *@params ms: 'dictation',
    *@params path: 'dictation',
    *@instance modalRef = this.modalService.show(HasMoreResultsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    *@return modalRef.content.onClose.pipe(take(1)).subscribe()
 */
@Component({
  selector: 'app-has-more-results',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './has-more-results.component.html',
  styleUrls: ['./has-more-results.component.css'],
})
export class HasMoreResultsComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  @Input() path = '';
  @Input() title = 'Por definir';
  @Input() ms = 'notification';
  @Input() columns: any;
  @Input() settingTable = {};
  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  queryParams: { [key: string]: string };
  selection = new Map();
  settings = SettingTableDefault;
  constructor(
    private modalRef: BsModalRef,
    private httpClient: HttpClient // protected mJobManagementService: MJobManagementService
  ) {}

  ngOnInit(): void {
    // this.prepareForm();
    // this.getMJobManagements();
    this.settings = { ...SettingTableDefault, ...this.settingTable };
    // this.settings.actions = false;
    this.getData();
    this.settings.columns = this.columns;
    this.params.pipe(skip(1)).subscribe((params: ListParams) => {
      this.getData(params);
    });
  }

  isLoading = false;

  onClickSelect(event: any) {
    console.log('EVENT', event);
    this.close(event.data);
  }

  close(data?: any) {
    this.onClose.emit(data);
    this.modalRef.hide();
  }

  getData(params: ListParams = new ListParams()) {
    this.isLoading = true;
    console.log(`${environment.API_URL}${this.ms}/${API_VERSION}/${this.path}`);
    console.log(this.queryParams);
    // Object.keys(this.queryParams).forEach((key: any) => {
    // params[key] = this.queryParams[key];
    // });
    this.queryParams['page'] = params.page as any;
    this.queryParams['limit'] = params.limit as any;
    this.httpClient
      .get<IListResponse<any>>(
        `${environment.API_URL}${this.ms}/${API_VERSION}/${this.path}`,
        { params: this.queryParams }
      )
      .subscribe({
        next: (res: IListResponse<any>) => {
          this.totalItems = res.count;
          console.log('DATA', res);
          this.data = res.data;
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
        },
      });
  }
}
