import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { REPORT_GOOD_COLUMNS } from './report-good-columns';
import {
  conservationStatusData,
  phisycalStatusData,
} from './report-good-option';

@Component({
  selector: 'app-report-good',
  templateUrl: './report-good.component.html',
  styleUrls: ['./report-good.component.scss'],
})
export class ReportGoodComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  paragraphs: LocalDataSource = new LocalDataSource();
  showSearchForm: boolean = true;
  loadingReport: boolean = false;
  form: FormGroup = new FormGroup({});
  typeRelevant = new DefaultSelect();
  transferences = new DefaultSelect();
  measureUnits = new DefaultSelect();
  conservationStatus = new DefaultSelect(conservationStatusData);
  physicalStatusData = new DefaultSelect(phisycalStatusData);
  userInfo: any;
  delRegUserLog: string = '';

  get path() {
    return 'good/api/v1/status-good?sortBy=status:ASC';
  }
  constructor(
    private goodProcessService: GoodProcessService,
    private typeRelevantService: TypeRelevantService,
    private authorityService: AuthorityService,
    private regionalDelegationService: RegionalDelegationService,
    private stateService: StateOfRepublicService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private fb: FormBuilder,
    private goodsQueryService: GoodsQueryService,
    private programmingService: ProgrammingRequestService,
    private goodFinderService: GoodFinderService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REPORT_GOOD_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getInfoUserLog();
    this.getTypeRelevantSelect(new ListParams());
    this.getTransferentSelect(new ListParams());
    this.getUnitMeasure(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      goodId: [null, [Validators.maxLength(100)]],
      inventoryNumber: [null, [Validators.maxLength(50)]],
      goodDescription: [null, [Validators.maxLength(100)]],
      idRelevantType: [null, [Validators.maxLength(100)]],
      requestId: [null, [Validators.maxLength(50)]],
      status: [null, [Validators.maxLength(100)]],
      uniqueKey: [null, [Validators.maxLength(100)]],
      fileNumber: [null, [Validators.maxLength(50)]],
      measureTlUnitView: [null, [Validators.maxLength(100)]],
      descriptionPhysicalStatus: [null, [Validators.maxLength(100)]],
      descriptionConservationStatus: [null, [Validators.maxLength(50)]],
      transferId: [null, [Validators.maxLength(100)]],
    });
  }

  getInfoUserLog() {
    this.programmingService.getUserInfo().subscribe(data => {
      this.userInfo = data;

      this.delRegUserLog = this.userInfo.department;
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getGoodsResDevInv());
    });
  }

  getGoodsResDevInv() {
    this.loading = true;
    this.params.getValue()[
      'filter.delegationNumber'
    ] = `$eq:${this.delRegUserLog}`;

    this.goodFinderService.goodFinder(this.params.getValue()).subscribe({
      next: resp => {
        this.paragraphs.load(resp.data);
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        this.paragraphs.load([]);
        this.paragraphs.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  /*getTypeRelevant(id: number) {
    return new Promise((resolve, reject) => {
      this.typeRelevantService.getById(id).subscribe({
        next: response => {
          resolve(response.description);
        },
        error: error => {
          resolve('Sin tipo relevante');
        },
      });
    });
  }*/

  getAuthorityName(id: number) {
    return new Promise((resolve, reject) => {
      this.authorityService.getById(id).subscribe({
        next: response => {
          resolve(response.authorityName);
        },
        error: error => {
          resolve('Sin Autoridad');
        },
      });
    });
  }

  getRegionalDelName(id: number) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService.getById(id).subscribe({
        next: response => {
          resolve(response.description);
        },
        error: error => {
          resolve('Sin Delegación regional');
        },
      });
    });
  }

  getStateName(id: number) {
    return new Promise((resolve, reject) => {
      this.stateService.getById(id).subscribe({
        next: response => {
          resolve(response.descCondition);
        },
        error: error => {
          resolve('Sin estado');
        },
      });
    });
  }

  getTransferentName(id: number) {
    return new Promise((resolve, reject) => {
      this.transferentService.getById(id).subscribe({
        next: response => {
          resolve(response.nameTransferent);
        },
        error: error => {
          resolve('Sin transferente');
        },
      });
    });
  }

  getStationName(id: number) {
    return new Promise((resolve, reject) => {
      this.stationService.getById(id).subscribe({
        next: response => {
          resolve(response.stationName);
        },
        error: () => {
          resolve('Sin Emisora');
        },
      });
    });
  }

  getTypeRelevantSelect(params: ListParams) {
    params['sortBy'] = 'description:ASC';
    this.typeRelevantService.getAll(params).subscribe({
      next: data => {
        this.typeRelevant = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.typeRelevant = new DefaultSelect();
      },
    });
  }

  getTransferentSelect(params?: ListParams) {
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    this.transferentService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.nameAndId = `${data.id} - ${data.nameTransferent}`;
          return data;
        });
        this.transferences = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.transferences = new DefaultSelect();
      },
    });
  }

  getUnitMeasure(params: ListParams) {
    params['filter.measureTlUnit'] = `$ilike:${params.text}`;
    params.limit = 20;
    this.goodsQueryService
      .getCatMeasureUnitView(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.measureUnits = new DefaultSelect(resp.data, resp.count);
        },
        error: error => {
          this.measureUnits = new DefaultSelect();
        },
      });
  }

  search() {
    const goodId = this.form.get('goodId').value;
    const inventoryNumber = this.form.get('inventoryNumber').value;
    const goodDescription = this.form.get('goodDescription').value;
    const idRelevantType = this.form.get('idRelevantType').value;
    const requestId = this.form.get('requestId').value;
    const status = this.form.get('status').value;
    const uniqueKey = this.form.get('uniqueKey').value;
    const fileNumber = this.form.get('fileNumber').value;
    const measureTlUnitView = this.form.get('measureTlUnitView').value;
    const descriptionPhysicalStatus = this.form.get(
      'descriptionPhysicalStatus'
    ).value;
    const descriptionConservationStatus = this.form.get(
      'descriptionConservationStatus'
    ).value;
    const transferId = this.form.get('transferId').value;

    if (goodId) this.params.getValue()['filter.goodId'] = `$eq:${goodId}`;
    if (inventoryNumber)
      this.params.getValue()['filter.inventoryNumber'] = inventoryNumber;
    if (goodDescription)
      this.params.getValue()[
        'filter.goodDescription'
      ] = `$ilike:${goodDescription}`;
    if (idRelevantType)
      this.params.getValue()['filter.idRelevantType'] = idRelevantType;
    if (requestId) this.params.getValue()['filter.requestId'] = requestId;
    if (status) this.params.getValue()['filter.status'] = `$ilike:${status}`;
    if (uniqueKey) this.params.getValue()['filter.uniqueKey'] = uniqueKey;
    if (fileNumber) this.params.getValue()['filter.fileNumber'] = fileNumber;
    if (measureTlUnitView)
      this.params.getValue()[
        'filter.measureTlUnitView'
      ] = `$eq:${measureTlUnitView}`;
    if (descriptionPhysicalStatus)
      this.params.getValue()[
        'filter.descriptionPhysicalStatus'
      ] = `$ilike:${descriptionPhysicalStatus}`;
    if (descriptionConservationStatus)
      this.params.getValue()[
        'filter.descriptionConservationStatus'
      ] = `$ilike:${descriptionConservationStatus}`;
    if (transferId) {
      this.params.getValue()['filter.transferId'] = `$eq:${transferId}`;
    }

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsResDevInv());
  }

  cleanForm() {
    this.loading = true;
    this.form.reset();
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsResDevInv());
  }

  async reportGoods() {
    const formValues = this.form.getRawValue();

    const infoForm = Object.values(formValues).some(value => !!value);

    if (!infoForm) {
      this.alert('warning', 'Advertencia', 'Realice al menos un filtro');
      return;
    }

    this.loadingReport = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());

    if (this.totalItems > 0) {
      params.getValue()[
        'filter.regionalDelegationId'
      ] = `$eq:${this.delRegUserLog}`;
      params.getValue().limit = this.totalItems;
      this.goodProcessService.goodResDevInvReport(params.getValue()).subscribe({
        next: response => {
          this.downloadExcel(response.base64File, 'Reporte_Bienes.xlsx');
          this.loadingReport = false;
        },
        error: error => {
          if (error.message == 'Invalid array length') {
            this.alert(
              'warning',
              'No se puede generar archivo Excel',
              'Disminuya la cantidad de bienes a exportar'
            );
          }

          this.alert('warning', 'No se puede generar archivo Excel', '');
        },
      });
    } else {
      this.alert(
        'warning',
        'Advertencia',
        'La delegación regional no cuenta con bienes'
      );
      this.loadingReport = false;
    }
  }

  downloadExcel(excel: any, nameReport: string) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excel}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.download = nameReport;
    downloadLink.click();
    this.alert(
      'success',
      'Acción Correcta',
      'Archivo descargado correctamente'
    );
  }
}
