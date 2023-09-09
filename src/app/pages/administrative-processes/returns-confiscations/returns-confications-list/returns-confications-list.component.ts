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
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';
//Models
//Services
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
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

  constructor(
    private datePipe: DatePipe,
    private goodService: GoodService,
    private expedientService: ExpedientService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private modalService: BsModalService,
    private screenStatusService: ScreenStatusService
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
      /*rowClassFunction: (row: any) => {
        console.log('rowClassFunction ', row);
        if (row.data.estatus.active === '1') {
          return 'text-success';
        } else {
          return 'text-danger';
        }
      },*/
      /*edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },*/
      /*mode: '',
      rowClassFunction: (row: any) => {
        if (row.data.estatus.active === '1') {
          return 'text-success';
        } else {
          return 'text-danger';
        }
      },*/
      columns: COLUMNS,
    };
    this.filterParamsGoods();
  }

  ngOnInit(): void {
    this.prepareForm();
    //this.data.load(goodsData);
    /**
     * Instance renderComponent
     **/
    /*this.columns.dateConfiscation.editor={
      ...this.columns.dateConfiscation.editor,
      onComponentInitFunction: (instance: any) => {
        instance.toggle.subscribe((data: any) => {
          alert(data)
           //this.otherFn(data);
        });
      }
    }*/
  }

  private prepareForm(): void {
    //Form
    this.form = this.fb.group({
      idExpedient: [null, [Validators.required]],
      preliminaryInquiry: [
        { value: null, disabled: true },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      criminalCase: [
        { value: null, disabled: true },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      identifies: [{ value: null, disabled: true }],
      noCourt: [{ value: null, disabled: true }],
    });
    //Massive Application Form
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
              case 'dateRenderDecoDev':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'promoterUserDecoDevo':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'quantity':
                searchFilter = SearchFilter.EQ;
                break;
              case 'appraisedValue':
                searchFilter = SearchFilter.ILIKE;
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
          this.getGoods(this.form.get('idExpedient').value);
          let i = 0;
          console.log('entra ', i++);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods(this.form.get('idExpedient').value));
    let i = 0;
    console.log('entra2 ', i++);
  }

  getExpedientById(): void {
    this.formMA.reset();
    this.goods = [];
    console.log('Lenght Goods', this.goods.length);
    this.data.load(this.goods);
    this.data.refresh();
    let _id = this.form.controls['idExpedient'].value;
    this.loading = true;
    this.expedientService.getById(_id).subscribe(
      response => {
        console.log(response);
        //TODO: Validate Response
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getGoods(response.id);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontrarón registros', '');
        }
      },
      error => (this.loading = false)
    );
  }

  getGoods(id: string | number): void {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log('Params Filter-> ', params);

    this.goods = [];
    this.goodService.getByExpedient(id, params).subscribe({
      next: response => {
        console.log('response getGoogByExp ', response.data);
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i] != null && response.data[i] != undefined) {
            this.usersService
              .getAllSegUsersbykey(response.data[i].promoterUserDecoDevo)
              .subscribe({
                next: resp => {
                  console.log(
                    'response getAllSegUsersbykey ',
                    resp.data.length
                  );
                  let dataB = {
                    id: response.data[i].goodId,
                    description: response.data[i].description,
                    extDomProcess: response.data[i].extDomProcess,
                    dateRenderDecoDev: response.data[i].scheduledDateDecoDev,
                    promoterUserDecoDevo: resp.data[0].name,
                    quantity: response.data[i].quantity,
                    appraisedValue: response.data[i].appraisedValue,
                    tesofeDate: response.data[i].tesofeDate,
                    tesofeFolio: response.data[i].tesofeFolio,
                    goodId: response.data[i].goodId,
                    estatus: response.data[i].estatus,
                  };
                  console.log('data ', dataB);
                  this.goods.push(dataB);
                  this.data.load(this.goods);
                  this.data.refresh();
                  this.totalItems = response.count;
                },
                error: err => {
                  let dataB = {
                    id: response.data[i].goodId,
                    description: response.data[i].description,
                    extDomProcess: response.data[i].extDomProcess,
                    dateRenderDecoDev: response.data[i].scheduledDateDecoDev,
                    promoterUserDecoDevo: response.data[i].promoterUserDecoDevo,
                    quantity: response.data[i].quantity,
                    appraisedValue: response.data[i].appraisedValue,
                    tesofeDate: response.data[i].tesofeDate,
                    tesofeFolio: response.data[i].tesofeFolio,
                    goodId: response.data[i].goodId,
                    estatus: response.data[i].estatus,
                  };
                  console.log('data ', dataB);
                  this.goods.push(dataB);
                  this.data.load(this.goods);
                  this.data.refresh();
                  this.totalItems = response.count;
                  this.loading = false;
                },
              });
            this.loading = false;
          }
        }
      },
      error: err => {
        this.loading = false;
      },
      /*let data = response.data.map((item: IGood) => {
          //console.log(item);
          item.promoter = item.promoterUserDecoDevo;

          let dateDecoDev = item.scheduledDateDecoDev;
          item.dateRenderDecoDev = this.datePipe.transform(
            dateDecoDev,
            'dd/MM/yyyy'
          );

          let dateTeso = item.tesofeDate;

          item.tesofeDate = this.datePipe.transform(dateTeso, 'dd/MM/yyyy');
          return item;
        });*/

      //console.log('getGoods-> ', response);
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  massiveApplication(): void {
    console.log('form ', this.formMA);
    let maVal = this.formMA.value;
    this.alertQuestion(
      'warning',
      'Actualización Masiva',
      'Desea Actualizar Todos los Bienes?'
    ).then(question => {
      if (question.isConfirmed) {
        this.putGoodUpMasive();
        /*
        //Ejecutar el servicio
        if (maVal.dateConfiscation !== null) {
          goodsData.map(good => {
            let date = `${maVal.dateConfiscation.getFullYear()}-
                ${maVal.dateConfiscation.getMonth() + 1}-
                ${maVal.dateConfiscation.getDate()}`;

            good.dateConfiscation = date;
          });
          //Update Table
          this.data.refresh();
        }

        if (maVal.promoter !== null) {
          goodsData.map(good => {
            good.promoter = maVal.promoter;
          });
          //Update Table
          this.data.refresh();
        }

        this.onLoadToast('success', 'Elementos Actualizados', '');
        */
        this.onLoadToast('success', 'Elementos Actualizados', '');
      }
    });
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

  onSaveConfirm(event: any) {
    console.log('evento-> ', event.data);
    //this.putGoodUp(event.newData);
    event.confirm.resolve();
    //this.goodService.update()
    if (this.rowSelected) {
      this.putGoodUp(event.newData);
    } else {
      this.onLoadToast('error', 'Debe Seleccionar un Registro', '');
    }

    //this.onLoadToast('success', 'Elemento Actualizado', '');
  }

  putGoodUp(params?: any) {
    console.log('data up -> ', params);
    /* let item = {
      id: params.id,
      goodId: params.goodId,
      scheduledDateDecoDev: null
      promoterUserDecoDevo: ,
    }; */
    /*this.goodService.updateGood(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp UpdateGood-> ', resp);
      }
    });*/
  }

  putGoodUpMasive() {
    //console.log('data up -> ', this.data['data'].length);
    for (let i = 0; i < this.data['data'].length; i++) {
      //console.log("this.data['data'][i] ", this.data['data'][i]);
      let item = {
        id: this.data['data'][i].id,
        goodId: this.data['data'][i].goodId,
        scheduledDateDecoDev: this.formatDate(
          this.formMA.get('dateConfiscation').value
        ),
        promoterUserDecoDevo: this.formMA.get('promoter').value,
      };
      this.loading = true;
      console.log('item a upd ', item);
      this.goodService.updateGood(item).subscribe(
        resp => {
          if (resp != null && resp != undefined) {
            console.log('Resp UpdateGood-> ', resp);
            //let id = this.form.get('idExpedient').value;
            //this.getGoods(id);
            this.loading = false;
          }
        },
        err => {}
      );
    }
    setTimeout(() => {
      this.loading = true;
      let id = this.form.get('idExpedient').value;
      this.getGoods(id);
    }, 3000);
    this.loading = false;
    //this.getExpedientById();
  }

  paramsUser(user: any) {
    let params = {
      page: 1,
      limit: 10,
      'filter.user': `$ilike:${user}`,
    };
    //this.getAllSegUser1(params);
  }

  dateFormat(date: any) {
    let dateLocal: any;
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
    let config: ModalOptions = {
      initialState: {
        data,
        dataChild: 'Modal Hijo',
        callback: (data: any) => {
          console.log('Entra al callback');
          console.log(data);
          let id = this.form.get('idExpedient').value;
          this.getGoods(id);
        },
      },

      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.childModal = this.modalService.show(EditModalConfComponent, config);
  }
}
