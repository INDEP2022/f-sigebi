import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITempTracker } from 'src/app/core/models/ms-good-tracker/vtempTracker.model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodViewTrackerService } from 'src/app/core/services/ms-good-tracker/good-v-tracker.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { MovementsConsultsComponent } from '../movements-consults/movements-consults.component';
import { MOVEMENTS_COLUMNS } from './columns';

@Component({
  selector: 'app-movements-goods-surveillance',
  templateUrl: './movements-goods-surveillance.component.html',
  styles: [],
})
export class MovementsGoodsSurveillanceComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  private selectedGooods: any[] = [];

  DATA: any[] = [
    {
      noBien: '12',
      description: 'Descripción',
      keycontract: 'CVE/ERDF',
      ingretDate: '23/07/2010',
      adresss: 'Cll 23',
      oneTwo: '112',
      ind: '12',
      ammount: '12121',
      region: 'Region 1',
    },
  ];

  constructor(
    private modalService: BsModalService,
    private survillanceService: SurvillanceService,
    private goodViewTrackerService: GoodViewTrackerService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: {
        name: {
          title: 'Selección',
          sort: false,
          type: 'custom',
          showAlways: true,
          filter: false,
          valuePrepareFunction: (isSelected: boolean, row: any) =>
            this.isGoodSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodSelect(instance),
        },
        ...MOVEMENTS_COLUMNS,
      },
    };
  }

  ngOnInit(): void {
    /* this.data.load(this.DATA);
    this.data.refresh(); */
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'goodnumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'contract_start_date':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getMoventsGood();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMoventsGood());
  }

  getMoventsGood() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.survillanceService.getContract(params).subscribe(
      response => {
        // this.bank = response.data;
        console.log(response);
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  openModal(data?: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getMoventsGood());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MovementsConsultsComponent, config);
  }

  edit(data: any) {
    console.log(data);
    this.openModal(data);
  }

  downloadReport(reportName: string, params: any) {
    //this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
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
      },
    });
  }

  createTmpTracker(model: ITempTracker) {
    return new Promise<boolean>((res, _rej) => {
      this.goodViewTrackerService.createTmpTravker(model).subscribe({
        next: resp => {
          console.log(resp);
          res(true);
        },
        error: err => {
          res(false);
        },
      });
    });
  }

  deleteTmpTracker(model: ITempTracker) {
    return new Promise<boolean>((res, _rej) => {
      this.goodViewTrackerService.deleteTmpTravker(model).subscribe({
        next: resp => {
          console.log(resp);
          res(true);
        },
        error: err => {
          res(false);
        },
      });
    });
  }

  enterAndPrint() {
    console.log(this.selectedGooods);
    const identificators: any[] = [];
    let vban: boolean = false;
    this.selectedGooods.forEach(async good => {
      const identificator = this.obtenerFechaHoraActual();
      const goodNumber = good.goodnumber;
      identificators.push({ identificator, goodNumber });
      const model: ITempTracker = {
        identificator: identificator,
        goodNumber: goodNumber,
      };
      vban = await this.createTmpTracker(model);
    });
    ///////////// llamar al reporte aqui
    const params = {
      pn_folio: '',
    };
    this.downloadReport('blank', params);
    /////////////////////////////////////
    console.log('El otro array', identificators);
    identificators.forEach(async model => {
      const resp = await this.deleteTmpTracker(model);
    });
  }

  isGoodSelected(_good: any) {
    const exists = this.selectedGooods.find(
      good => good.goodnumber == _good.goodnumber
    );
    return exists ? true : false;
  }

  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }

  goodSelectedChange(good: any, selected: boolean) {
    if (selected) {
      good.select = true;
      this.selectedGooods.push(good);
    } else {
      good.select = false;
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.goodnumber != good.goodnumber
      );
    }
  }

  obtenerFechaHoraActual(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}
