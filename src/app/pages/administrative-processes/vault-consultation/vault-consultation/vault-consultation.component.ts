import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ISafe } from 'src/app/core/models/catalogs/safe.model';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalListGoodsComponent } from '../modal-list-goods/modal-list-goods.component';
import { COUNT_SAFE_COLUMNS } from './vault-consultation-column';

@Component({
  selector: 'app-vault-consultation',
  templateUrl: './vault-consultation.component.html',
  styles: [],
})
export class VaultConsultationComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  form: FormGroup;
  idSelected: number = 0;
  vaults: ISafe[] = [];
  columnFilters: any = [];
  excelLoading: boolean = true;
  vault: ISafe;
  origin: string = '';
  origin2: string = '';
  origin3: string = '';
  origin4: string = '';
  paramsScreen: IParamsVault = {
    PAR_MASIVO: '', // PAQUETE
  };

  screenKey = 'FCONADBBOVEDAS';
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataFactGen: LocalDataSource = new LocalDataSource();
  @ViewChild('idSafe') idSafe: ElementRef;
  @ViewChild('goodNumber') goodNumber: ElementRef;
  @Input() PAR_MASIVO: string;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private safeService: SafeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...COUNT_SAFE_COLUMNS },
      noDataMessage: 'No se encontrarón registros',
    };
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log(params);
        console.log(this.paramsScreen);
        for (const key in this.paramsScreen) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            this.paramsScreen[key as keyof typeof this.paramsScreen] =
              params[key] ?? null;
          }
        }
        this.origin = params['origin2']
          ? params['origin2']
          : params['origin'] ?? null;
        this.origin2 = params['origin3'] ?? null;
        this.origin3 = params['origin4'] ?? null;
        this.origin4 = params['origin5'] ?? null;
        this.PAR_MASIVO = params['PAR_MASIVO'] ?? null;
        console.log(this.paramsScreen.PAR_MASIVO);

        if (this.origin && this.paramsScreen.PAR_MASIVO != null) {
          // this.btnSearchAppointment();
        }
      });
    if (this.paramsScreen) {
      if (this.paramsScreen.PAR_MASIVO) {
        this.search();
      } else {
        console.log('SIN PARAMETROS');
        if (!this.origin) {
          console.log(this.origin);
        }
      }
    }
    this.dataFactGen
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'idSafe' ||
            filter.field == 'description' ||
            filter.field == 'ubication' ||
            filter.field == 'manager' ||
            filter.field == 'stateCode' ||
            filter.field == 'municipalityCode' ||
            filter.field == 'cityCode' ||
            filter.field == ' localityCode'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.search();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.search());
  }

  goBack() {
    this.router.navigate(['/pages/administrative-processes/location-goods'], {
      queryParams: {
        origin2: this.screenKey,
        PAR_MASIVO: this.goodNumber,
        origin: 'FACTADBUBICABIEN',
        origin3: 'FACTGENACTDATEX',
        origin4: 'FCONADBALMACENES',
        ...this.paramsScreen,
      },
    });
  }

  openForm(provider?: ISafe) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
    };
    this.modalService.show(ModalListGoodsComponent, modalConfig);
  }

  search() {
    this.loading = true;
    this.params.getValue()['sortBy'] = `idSafe:DESC`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.safeService.getAll(params).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.totalItems = data.count;
        this.vaults = data.data;
        console.log(this.vaults);
        this.dataFactGen.load(data.data);
        this.dataFactGen.refresh();
        this.vaults = data.data.map((vault: ISafe) => {
          return {
            idSafe: vault.idSafe,
            description: vault.description,
            localityCode: vault.localityCode ? vault.localityCode : null,
            cityCode: vault.cityCode ? vault.cityCode : 0,
            manager: vault.manager,
            municipalityCode: vault.municipalityCode
              ? vault.municipalityCode
              : null,
            registerNumber: vault.registerNumber,

            stateCode: vault.stateCode ? vault.stateCode : '',
            ubication: vault.ubication,
          };
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }
  select(event: any) {
    this.idSafe = event.data.idSafe;
    console.log(this.idSafe);
    event.data
      ? this.openForm(event.data)
      : this.alert('info', 'Esta Bóveda no contiene Bienes', '');
  }
  exportToExcel(): void {
    this.excelLoading = true;
    this.safeService.exportExcel().subscribe({
      next: data => {
        this.excelLoading = false;
        this.alert(
          'warning',
          'El archivo se esta generando, favor de esperar la descarga',
          ''
        );

        this.downloadDocument('-Detalle-Bovedas', 'excel', data.base64File);
        // this.modalRef.hide();
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  //Descargar Excel
  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.excelLoading = true;
    this.alert('success', 'El reporte se ha descargado', '');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // this.fullService.generatingFileFlag.next({
    //   progress: 100,
    //   showText: false,
    // });

    return bytes.buffer;
  }
}

export interface IParamsVault {
  PAR_MASIVO: string;
}
