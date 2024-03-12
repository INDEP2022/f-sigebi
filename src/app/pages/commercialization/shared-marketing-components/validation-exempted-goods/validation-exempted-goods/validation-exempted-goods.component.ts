import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IPupGoodTrackerFComerGood } from 'src/app/core/models/catalogs/package.model';
import { IGoodsTransAva } from 'src/app/core/models/ms-good/goods-trans-ava.model';
import { BankMovementType } from 'src/app/core/services/ms-bank-movement/bank-movement.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { NewValidationExemptedGoodModalComponent } from '../new-validation-exempted-goods-modal/new-validation-exempted-goods-modal.component';
import { GOODS_COLUMS } from './validation-exempted-goods-columns';

@Component({
  selector: 'app-validation-exempted-goods',
  templateUrl: './validation-exempted-goods.component.html',
  styleUrls: ['./validation-exempted-goods.component.css'],
})
export class ValidationExemptedGoodsComponent
  extends BasePage
  implements OnInit
{
  goods: LocalDataSource = new LocalDataSource();
  totalItems = 0;
  params = new BehaviorSubject(new FilterParams());
  processForm: FormGroup;

  processes = new DefaultSelect();
  cycleTracker = 0;

  override settings = {
    ...this.settings,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Eliminar',
      position: 'right',
      edit: false,
      delete: true,
      add: false,
    },
    columns: GOODS_COLUMS,
  };

  constructor(
    private fb: FormBuilder,
    private globalVarService: GlobalVarsService,
    private goodService: GoodService,
    private modalService: BsModalService,
    private router: Router,
    private processService: BankMovementType,
    private massiveGoodService: MassiveGoodService,
    private lotService: LotService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getData();
    this.columnsFilter().subscribe();
    this.navigateTable();
    this.returnTracker();
    this.getProcesses();
  }

  prepareForm() {
    this.processForm = this.fb.group({
      process: [null, Validators.required],
    });
  }

  returnTracker() {
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          const ngGlobal = global;
          if (ngGlobal.REL_BIENES) {
            if (this.cycleTracker == 0) {
              this.cycleTracker++;
              console.log(ngGlobal.REL_BIENES);
              console.log(this.cycleTracker);
              const processSave = localStorage.getItem('processFCOMERBIENEX');
              this.processForm.get('process').setValue(processSave);
              this.pupGoodTracker(ngGlobal.REL_BIENES);
            }
          }
        },
      });
  }

  deleteGood(e) {
    console.log(e);
    const data = e.data;

    const bodyDelete: IGoodsTransAva = {
      goodNumber: data.goodNumber.id,
      process: data.process,
      registryNumber: data.registryNumber,
    };

    this.goodService.deleteTransAva(bodyDelete).subscribe(
      res => {
        this.alert(
          'success',
          'Registro eliminado',
          `Se eliminó el bien ${bodyDelete.goodNumber}, con proceso ${bodyDelete.process} y número de registro ${bodyDelete.registryNumber}`
        );
        this.getData();
      },
      err => {
        console.log(err);
        this.alert(
          'error',
          'Se presentó un error inesperado',
          'Intentelo nuevamente'
        );
      }
    );
  }

  navigateTable() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(value => {
      this.getData();
    });
  }

  columnsFilter() {
    return this.goods.onChanged().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(dataSource => this.buildColumnFilter(dataSource))
    );
  }

  buildColumnFilter(dataSource: any) {
    const params = new FilterParams();
    params.removeAllFilters();

    if (dataSource.action == 'filter') {
      const filters = dataSource.filter.filters;
      filters.forEach((filter: any) => {
        console.log(filter);
        const columns = this.settings.columns as any;
        let operator = columns[filter.field]?.operator;

        if (!filter.search) {
          params.removeAllFilters();
          return;
        }

        if (filter.field == 'goodNumber.description') {
          operator = SearchFilter.LIKE;
        }

        params.addFilter(
          filter.field,
          filter.search,
          operator || SearchFilter.EQ
        );
      });
      this.params.next(params);
    }
  }

  getData() {
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('id', '3987830');
    paramsF.page = this.params.getValue().page;
    paramsF.limit = this.params.getValue().limit;
    paramsF.filters = this.params.getValue().filters;

    this.goodService.getTransAvaFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.goods.load(res.data);
        this.totalItems = res.count;
        this.loading = false;
      },
      err => {
        this.alert('warning', 'No se encontraron datos', '');
        console.log(err);
        this.goods.load([]);
        this.totalItems = 0;
        this.loading = false;
      }
    );
  }

  openModalNew() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewValidationExemptedGoodModalComponent, config);
  }

  goToGoodTracker() {
    if (!this.processForm.get('process').value) {
      this.alert(
        'warning',
        'Proceso requerido',
        'Por favor, seleccione un proceso'
      );
      this.processForm.get('process').markAsTouched();
      return;
    }

    localStorage.setItem(
      'processFCOMERBIENEX',
      this.processForm.get('process').value.value
    );

    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: {
        origin: 'FCOMERBIENEX',
      },
    });
  }

  pupGoodTracker(nrelGood: number) {
    console.log(this.processForm.get('process').value);
    const body: IPupGoodTrackerFComerGood = {
      process: this.processForm.get('process').value,
      relGood: nrelGood,
    };

    this.massiveGoodService.pupGoodTrackerFComerGoodEx(body).subscribe(
      res => {
        console.log(res);
        this.alert('success', 'Proceso exitoso', res.message);
      },
      err => {
        this.alert('error', 'Error', 'No se pudo realizar el proceso');
        console.log(err);
      }
    );
  }

  getProcesses() {
    const paramsF = new FilterParams();
    paramsF.addFilter('parameter', 'COMERBIENEX');
    this.processService.getProcess(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        const newResp = res.data.map((item: any) => {
          return {
            ...item,
            bindValue: `${item.value} - ${item.description}`,
          };
        });

        this.processes = new DefaultSelect(newResp, res.count);
      },
      err => {
        this.processes = new DefaultSelect();
        this.alert('error', 'No se pudieron obtener los procesos', '');
      }
    );
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const formData = new FormData();
  }

  /* CARGA_BIENES_EXCEL(file: File) {
    const filename = file.name;
    const ext = filename.substring(filename.lastIndexOf('.') + 1) ?? '';
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(
      `${this._url}massivegood/${this._prefix}application/load-good-excel`,
      formData
    );
  } */
}
