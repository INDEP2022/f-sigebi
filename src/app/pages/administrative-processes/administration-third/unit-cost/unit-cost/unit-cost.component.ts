import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IUnitCostDet } from 'src/app/core/models/administrative-processes/unit-cost-det.model';
import { IUnitCost } from 'src/app/core/models/administrative-processes/unit-cost.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { StrategyServiceTypeService } from 'src/app/core/services/ms-strategy/strategy-service-type.service';
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
  validity: string;
  cveZone: string;
  rowValidityAndCost: any;

  import: number;

  costUnitarian1: number;
  porceInflation1: number;

  vCont: number = 0;

  value: number;
  buttonCost: boolean = false;

  constructor(
    private unitCostService: UnitCostService,
    private unitCostDetService: UnitCostDetService,
    private modalService: BsModalService,
    private strategyServiceTypeService: StrategyServiceTypeService,
    private authService: AuthService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
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
    this.buttonCost = false;
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

  selectDetValidity(event: any) {
    if (event) {
      this.buttonCost = true;
      console.log(event.data);
      this.rowValidityAndCost = event.data;
      this.validity = this.rowValidityAndCost.validity;
      this.cveZone = this.rowValidityAndCost.cveZoneContract;
      this.costUnitarian1 = this.rowValidityAndCost.costUnitarian;
      this.porceInflation1 = this.rowValidityAndCost.porceInflation;
      this.totalAmount();
      console.log(
        this.validity,
        this.cveZone,
        this.costUnitarian1,
        this.porceInflation1
      );
    } else {
      this.buttonCost = false;
    }
  }

  totalAmount() {
    this.import =
      (this.costUnitarian1 ?? 0) +
      ((this.porceInflation1 ?? 0) / 100) * 1 * (this.costUnitarian1 ?? 0);
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

  calculate() {
    this.alertQuestion(
      'warning',
      '¿Está seguro que desea generar el cálculo?',
      ''
    ).then(question => {
      if (question.isConfirmed) {
        if (Number(this.validity) == 1) {
          const fechaActual = new Date();
          const date = fechaActual.getFullYear();
          if (
            date == null ||
            date == undefined ||
            this.idCost == null ||
            this.idCost == undefined
          ) {
            this.onLoadToast('warning', 'No se puede generar el cálculo', ``);
          }
          //this.idCost;
          console.log(date, this.idCost, this.cveZone);

          this.costCalculation(date, this.idCost, this.cveZone);
        } else {
          this.onLoadToast('warning', 'No se encuentra vigente', ``);
        }
      }
    });
  }

  costCalculation(dateYear: number, idCos: string, cveZone: string) {
    /*let vCont: number = 0;
    let value: number;
    if (dateYear && idCos && cveZone) {
      this.params.getValue()['filter.costId'] = idCos;
      this.params.getValue()['filter.actDate'] = dateYear;
      this.params.getValue()['filter.zoneContractKey'] = cveZone;
    }
    let params = {
      ...this.params.getValue(),
    };
    this.strategyServiceTypeService.getAllTmp(params).subscribe({
      next: response => {
        if (response.count > 0) {
          this.onLoadToast(
            'warning',
            `El calculo del costo ${idCos}, para el año ${dateYear}`,
            `de la zona ${cveZone} ya ha sido realizado.`
          );
          return;

        } else {
          console.log('caso contrario');
        }
      }, error: err => {
        console.log(err);
      }
    });*/

    this.value = this.import + this.import * (this.porceInflation1 / 100);
    //: ESTRATEGIA_DET_COSTOS.COSTO_UNITARION:=VALOR;
    const user1 = this.authService.decodeToken() as any;
    console.log(user1);
    const currentDate = new Date();
    let body = {
      id: '',
      costId: idCos,
      changeDate: currentDate,
      user: user1.username,
      actDate: dateYear,
      zoneContractKey: cveZone,
      nbOrigin: '',
    };
    this.strategyServiceTypeService.createTmp(body).subscribe({
      next: data => {
        this.onLoadToast('success', `Costo Actualizado`, `Correctamente`);
      },
      error: err => {
        this.onLoadToast(
          'warning',
          `El cálculo del costo ${idCos}, para el año ${dateYear}`,
          `de la zona ${cveZone} ya ha sido realizado.`
        );
      },
    });
  }

  insertTmpCost(dateYear: number, idCos: string, cveZone: string) {}

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

  report() {
    let params = {
      //PN_DEVOLUCION: this.data,
    };
    this.siabService.fetchReport('blank', params).subscribe(response => {
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      } else {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      }
    });
  }

  /*confirm(): void {
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
  }*/
}
