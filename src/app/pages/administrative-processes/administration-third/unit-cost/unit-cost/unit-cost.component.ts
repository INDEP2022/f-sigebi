import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IUnitCostDet } from 'src/app/core/models/administrative-processes/unit-cost-det.model';
import { IUnitCost } from 'src/app/core/models/administrative-processes/unit-cost.model';
import { UnitCostDetService } from 'src/app/core/services/unit-cost/unit-cost-det.service';
import { UnitCostService } from 'src/app/core/services/unit-cost/unit-cost.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { UnitCostDetFormComponent } from '../unit-cost-det-form/unit-cost-det-form.component';
import { UnitCostFormComponent } from '../unit-cost-form/unit-cost-form.component';
import { COSTKEY_COLUMNS, VALIDITYCOST_COLUMNS } from './unit-cost-columns';

@Component({
  selector: 'app-unit-cost',
  templateUrl: './unit-cost.component.html',
  styles: [],
})
export class UnitCostComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  settings2 = { ...this.settings };
  columns1: IUnitCost[] = [];
  columns2: IUnitCostDet[] = [];
  totalItems1: number = 0;
  totalItems2: number = 0;

  columnFilters1: any = [];
  columnFilters2: any = [];

  validityAndCost: boolean = false;

  idCost: string;

  constructor(
    private unitCostService: UnitCostService,
    private unitCostDetService: UnitCostDetService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: { ...COSTKEY_COLUMNS },
    };
    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: { ...VALIDITYCOST_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'processNumber':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}.description`;
                break;
              case 'serviceNumber':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}.description`;
                break;
              case 'serviceTypeNumber':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}.description`;
                break;
              case 'shiftNumber':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}.description`;
                break;
              case 'varCostNumber':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}.description`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.getUnitCostAll();
        }
      });
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getUnitCostAll());

    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'costId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cveZoneContract':
                searchFilter = SearchFilter.EQ;
                break;
              case 'startDate':
                searchFilter = SearchFilter.EQ;
                break;
              case 'finalDate':
                searchFilter = SearchFilter.EQ;
                break;
              case 'costUnitarian':
                searchFilter = SearchFilter.EQ;
                break;
              case 'porceInflation':
                searchFilter = SearchFilter.EQ;
                break;
              case 'amount':
                searchFilter = SearchFilter.EQ;
                break;
              case 'vig':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.getUnitCostDetAll();
        }
      });
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getUnitCostDetAll());
  }

  getUnitCostAll() {
    this.loading = true;

    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };

    this.unitCostService.getAll(params).subscribe({
      next: response => {
        this.columns1 = response.data;
        this.data1.load(this.columns1);
        this.data1.refresh();
        this.totalItems1 = response.count || 0;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  selectValidity(event: any) {
    this.validityAndCost = true;
    console.log(event.data.costId);
    this.idCost = event.data.costId;
    this.getUnitCostDetAll(event.data.costId);
  }

  getUnitCostDetAll(id?: string) {
    this.loading = true;
    console.log(id);
    if (id) {
      this.params2.getValue()['filter.costId'] = id;
    }
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };

    this.unitCostDetService.getAll(params).subscribe({
      next: response => {
        this.columns2 = response.data;
        this.data2.load(this.columns2);
        this.data2.refresh();
        this.totalItems2 = response.count || 0;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems2 = 0;
      },
    });
  }

  openForm(unitCost?: IUnitCost) {
    let config: ModalOptions = {
      initialState: {
        unitCost,
        callback: (next: boolean) => {
          if (next) this.getUnitCostAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UnitCostFormComponent, config);
  }

  openForm2(unitCostDet?: any) {
    const unitCostDet1 = unitCostDet != null ? unitCostDet.data : null;
    const idCost = this.idCost;
    console.log(unitCostDet1);
    let config: ModalOptions = {
      initialState: {
        unitCostDet1,
        idCost,
        callback: (next: boolean) => {
          if (next) {
            this.params2
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getUnitCostDetAll());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UnitCostDetFormComponent, config);
  }

  /*openForm2(unitCostDet?: any) {
    const unitCostDet1 = unitCostDet != null ? unitCostDet.data : null;
    console.log(unitCostDet1);
    const idCost = this.idCost;
    let config: ModalOptions = {
      initialState: {
        unitCostDet1,
        idCost,
        callBack: (next: boolean) => {
          if (next) {
            this.params2
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getUnitCostDetAll());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UnitCostDetFormComponent, config);
  }*/

  showDeleteAlert(unitCost?: IUnitCost) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(unitCost.costId);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  showDeleteAlert2(unitCostDet?: IUnitCostDet) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete2(unitCostDet.costId);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.unitCostService.remove(id).subscribe({
      next: () => this.getUnitCostAll(),
    });
  }

  delete2(id: number) {
    this.unitCostDetService.remove(id).subscribe({
      next: () => this.getUnitCostDetAll(),
    });
  }

  confirm(): void {
    this.loading = true;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    //console.log(linkSource);
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();

    // console.log(this.flyersForm.value);
    let params = { ...this.form.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    //let newWin = window.open(pdfurl, 'test.pdf');
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }
}
