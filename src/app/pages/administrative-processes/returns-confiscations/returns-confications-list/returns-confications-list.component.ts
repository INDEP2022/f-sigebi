import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Models
//Services
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IAcceptGoodStatusScreen } from 'src/app/core/models/ms-good/good';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { SearchExpedientComponent } from 'src/app/pages/final-destination-process/donation-acts/donation-acts/search-expedient/search-expedient.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { EditModalConfComponent } from '../edit-modal-conf/edit-modal-conf.component';

//Provisional Data
//import { goodsData } from './data';

@Component({
  selector: 'app-returns-confications-list',
  templateUrl: './returns-confications-list.component.html',
  styles: [],
})
export class ReturnsConficationsListComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  formMA: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  goods: any[] = [];
  //goodsD = goodsData;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  //Columns
  columns = COLUMNS;

  //localdata: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  user1 = new DefaultSelect();
  childModal: BsModalRef;
  expedientNumber: number;
  constructor(
    private datePipe: DatePipe,
    private goodService: GoodService,
    private expedientService: ExpedientService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private modalService: BsModalService,
    private screenStatusService: ScreenStatusService,
    private goodProcessService: GoodProcessService
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
      edit: {
        editButtonContent:
          '<i class="fa fa-pencil-alt text-warning pl-4 mx-2"></i>',
      },
      rowClassFunction: (row: any) => {
        if (row.data.disponible == true) {
          return 'bg-success text-black';
        } else {
          return 'bg-dark text-white';
        }
      },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.filterParamsGoods();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      id: [{ value: null, disabled: true }, [Validators.required]],
      preliminaryInquiry: [{ value: null, disabled: true }],
      criminalCase: [{ value: null, disabled: true }],
      identifies: [],
      noCourt: [],
    });
    this.formMA = this.fb.group({
      dateConfiscation: [null, Validators.required],
      promoter: [null, [Validators.required]],
    });
  }

  filterParamsGoods() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                field = 'filter.goodId';
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'extDomProcess':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'scheduledDateDecoDev':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'promoterUserDecoDevo':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'quantity':
                searchFilter = SearchFilter.EQ;
                break;
              case 'appraisedValue':
                searchFilter = SearchFilter.EQ;
                break;
              case 'tesofeDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'tesofeFolio':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGoods();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems > 0) this.getGoods();
    });
  }

  getGoods(): void {
    if (!this.expedientNumber) return;
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodService.getByExpedient(this.expedientNumber, params).subscribe({
      next: response => {
        let result = response.data.map(async item => {
          let resValGoodScreen = await this.valGoodStatusScreen(item.id);
          console.log(resValGoodScreen);
          if (
            resValGoodScreen &&
            !item.appraisedValue &&
            !item.scheduledDateDecoDev &&
            !item.promoterUserDecoDevo &&
            !item.tesofeDate &&
            !item.tesofeFolio
          )
            item['disponible'] = true;
          else item['disponible'] = false;
        });
        Promise.all(result).then(resp => {
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
        });
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  async valGoodStatusScreen(good: number) {
    let obj: IAcceptGoodStatusScreen = {
      pNumberGood: good,
      pVcScreen: 'FACTADBCONDEVYDEC',
    };
    return new Promise((resolve, reject) => {
      this.goodProcessService._getacceptGoodStatusScreen(obj).subscribe({
        next(value) {
          console.log(value);
          if (typeof value === 'number') {
            resolve(value);
          } else {
            resolve(value.data);
          }
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }

  async massiveApplication() {
    console.log('form ', this.formMA);
    const { dateConfiscation, promoter } = this.formMA.value;
    let message = '';
    if (!dateConfiscation && !promoter)
      return this.alert(
        'warning',
        'Debe seleccionar un promovente o una fecha decomiso',
        ''
      );
    else if (!dateConfiscation && promoter)
      message = 'Se actualizará el Promovente de los bienes disponibles';
    else if (dateConfiscation && !promoter)
      message = 'Se actualizará el Fecha Decomiso de los bienes disponibles';
    else if (dateConfiscation && promoter)
      message =
        'Se actualizará el Promovente y la Fecha Decomiso de los bienes disponibles';

    let data = await this.data.getAll();
    if (data.length == 0) {
      return this.alert('warning', 'No hay bienes para actualizar', '');
    } else if (data.length > 0) {
      let dataDispo = data.filter(item => item['disponible'] == true);
      if (dataDispo.length == 0) {
        return this.alert(
          'warning',
          'No hay bienes disponibles para actualizar',
          ''
        );
      }
    }
    this.alertQuestion('question', message, '¿Desea continuar?').then(
      question => {
        if (question.isConfirmed) {
          this.putGoodUpMasive(dateConfiscation, promoter);
        }
      }
    );
  }

  selectRow(row: any) {
    //console.log('Selected Row-> ', row);
    console.log('data row -> ', row);
    this.selectedRow = row;
    if (row != null) {
      this.rowSelected = true;
    } else {
      this.rowSelected = false;
    }
  }

  async putGoodUpMasive(dateConfiscation: any, promoter: any) {
    let data = await this.data.getAll();
    let fine = 0;
    let result = data.map(async item => {
      if (item['disponible']) {
        let body = {
          id: item.id,
          goodId: item.goodId,
          scheduledDateDecoDev: await this.dateFormat(dateConfiscation),
          promoterUserDecoDevo: promoter,
        };
        let res = await this.updateGood(body);
        if (res) fine = fine + 1;
      }
    });
    Promise.all(result).then(resp => {
      this.alert('success', 'Se actualizaron los bienes correctamente', '');
      this.getGoods();
    });
  }

  updateGood(body: any) {
    return new Promise((resolve, reject) => {
      this.goodService.updateGood(body).subscribe({
        next(value) {
          resolve(true);
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }

  async dateFormat(date: any): Promise<string> {
    let dateLocal: string = '';
    dateLocal = this.datePipe.transform(date, 'yyyy-MM-dd');
    return dateLocal;
  }

  getAllSegUser1(params: ListParams) {
    this.usersService.getAllSegUsers2(params).subscribe({
      next: resp => {
        this.user1 = new DefaultSelect(resp.data, resp.count);
        console.log('Resp.data0.0 -> ', resp);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  changeUser1(event: any) {
    console.log(event);
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  }

  openModal(data: any) {
    if (!data['disponible'])
      return this.alert(
        'warning',
        'El bien no está disponible para actualizar',
        ''
      );
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (data: any) => {
          if (data) this.getGoods();
        },
      },

      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.childModal = this.modalService.show(EditModalConfComponent, config);
  }

  searchExpediente() {
    const modalConfig = {
      initialState: {},
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {
      otherColumns: {
        id: {
          title: 'No. Expediente',
          type: 'string',
          sort: false,
        },
        preliminaryInquiry: {
          title: 'Averiguación Previa',
          type: 'string',
          sort: false,
        },
        criminalCase: {
          title: 'Causa Penal',
          type: 'string',
          sort: false,
        },
      },
    };

    let modalRef = this.modalService.show(
      SearchExpedientComponent,
      modalConfig
    );
    modalRef.content.onSave.subscribe((next: any) => {
      if (next) {
        this.form.patchValue(next);
        this.expedientNumber = next.id;
        this.getGoods();
        this.getAllSegUser1(new ListParams());
      }
    });
  }
  resetForm() {
    this.form.reset();
    this.expedientNumber = null;
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}
