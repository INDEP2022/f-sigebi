import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { REGULAR_BILLING_GENERATION_ASSETS_COLUMNS } from './regular-billing-generation-assets-columns';
//XLSX
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerInvoiceFacPapelService } from 'src/app/core/services/ms-invoice/ms-comer-invoice-fac-papel.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-regular-billing-generation-assets',
  templateUrl: './regular-billing-generation-assets.component.html',
  styles: [],
})
export class RegularBillingGenerationAssetsComponent
  extends BasePage
  implements OnInit
{
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  form: FormGroup;
  status = new DefaultSelect([
    { id: 1, description: 'Procesados' },
    { id: 3, description: 'No procesados por validación' },
    { id: 0, description: 'No procesados' },
    { id: null, description: 'Todos' },
  ]);
  @ViewChild('fileExcel', { static: true }) file: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private massiveGoodService: MassiveGoodService,
    private comerInvoiceFacPapel: ComerInvoiceFacPapelService,
    private fb: FormBuilder,
    private comerInvoiceService: ComerInvoiceService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...REGULAR_BILLING_GENERATION_ASSETS_COLUMNS },
      hideSubHeader: false,
    };
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      status: [null],
    });
  }

  ngOnInit(): void {
    this.dataFilter
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              notGood: () => (searchFilter = SearchFilter.EQ),
              insertDate: () => (searchFilter = SearchFilter.EQ),
              Invoice: () => (searchFilter = SearchFilter.EQ),
              series: () => (searchFilter = SearchFilter.ILIKE),
              observations: () => (searchFilter = SearchFilter.ILIKE),
              eventId: () => (searchFilter = SearchFilter.EQ),
              status: () => (searchFilter = SearchFilter.EQ),
              lotPublic: () => (searchFilter = SearchFilter.EQ),
              downloadValidation: () => (searchFilter = SearchFilter.ILIKE),
              userinsert: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getAllComerPapel();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems > 0) this.getAllComerPapel();
    });
  }

  async importExcell(event: any) {
    this.alertQuestion('warning', '¿Desea cargar el archivo en CSV?', '').then(
      async ans => {
        if (ans.isConfirmed) {
          let file = event.target.files[0];

          const response = await this.importCSV(file);
          this.file.nativeElement.value = '';
          if (!response) {
            this.alert(
              'warning',
              'Atención',
              'No se puede copiar el archivo de excel'
            );
            return;
          }

          await this.pkComerVNR(7545034);
          await this.pkComerVNRCancel(7545034, 'FCOMER086', 'C_VNR');

          this.paramsList = new BehaviorSubject(new ListParams());
          this.columnFilters = [];
          this.paramsList.getValue()[
            'filter.sessionId'
          ] = `${SearchFilter.EQ}:7545034`;
          this.getAllComerPapel();
        }
      }
    );
  }

  async pkComerVNR(sesion: number) {
    return firstValueFrom(
      this.comerInvoiceService.pkComerVNR(sesion).pipe(
        map(() => true),
        catchError(() => of(false))
      )
    );
  }

  async pkComerVNRCancel(pSession: number, pScreen: string, pAction: string) {
    const body = {
      pScreen,
      pAction,
      pSession,
    };
    return firstValueFrom(
      this.comerInvoiceService.pkComerVNRCancel(body).pipe(
        map(() => true),
        catchError(() => of(false))
      )
    );
  }

  async importCSV(file: any) {
    const user = this.authService.decodeToken().preferred_username;
    return firstValueFrom(
      this.massiveGoodService
        .importExcellGoodsInvoice({
          pSession: 7545034,
          user,
          file,
        })
        .pipe(
          map(() => true),
          catchError(() => of(false))
        )
    );
  }

  exportAsXLSX(): void {
    const { status } = this.form.value;
    this.massiveGoodService.getCSVStatus(status).subscribe({
      next: resp => {
        const linkSource = `data:application/xlsx;base64,${resp.resultExcel.base64File}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = linkSource;
        downloadLink.download = 'cancelacion_papel' + '.xlsx';
        downloadLink.target = '_blank';
        downloadLink.click();
        downloadLink.remove();
      },
      error: () => {
        this.alert(
          'warning',
          'Atención',
          'No se pudo copiar el archivo de excel'
        );
      },
    });
  }

  getAllComerPapel() {
    this.loading = true;
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.comerInvoiceFacPapel.getAll(params).subscribe({
      next: resp => {
        this.loading = false;
        this.totalItems = resp.count;
        this.dataFilter.load(resp.data);
        this.dataFilter.refresh();
      },
      error: () => {
        this.loading = false;
        this.totalItems = 0;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
      },
    });
  }
}
