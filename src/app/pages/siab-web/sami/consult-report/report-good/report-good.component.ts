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
    private programmingService: ProgrammingRequestService
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
      inventoryNum: [null, [Validators.maxLength(50)]],
      goodDescription: [null, [Validators.maxLength(100)]],
      typeRelevantId: [null, [Validators.maxLength(100)]],
      solicitudId: [null, [Validators.maxLength(50)]],
      statusGood: [null, [Validators.maxLength(100)]],
      uniqueKey: [null, [Validators.maxLength(100)]],
      fileNum: [null, [Validators.maxLength(50)]],
      unitMeasurement: [null, [Validators.maxLength(100)]],
      physicalStatus: [null, [Validators.maxLength(100)]],
      conservationStatus: [null, [Validators.maxLength(50)]],
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
      'filter.regionalDelegationId'
    ] = `$eq:${this.delRegUserLog}`;

    this.goodProcessService.goodResDevInv(this.params.getValue()).subscribe({
      next: response => {
        const info = response.data.map(async data => {
          const typeRelevatName: any = await this.getTypeRelevant(
            data.typeRelevantId
          );

          const authorityName: any = await this.getAuthorityName(
            data.authorityId
          );

          const regDelegationName: any = await this.getRegionalDelName(
            data.regionalDelegationId
          );
          const stateName: any = await this.getStateName(data.stateKey);
          const transferentName: any = await this.getTransferentName(
            data.transferId
          );

          const stationName: any = await this.getStationName(data.stationId);
          data.relevantTypeName = typeRelevatName;
          data.authorityName = authorityName;
          data.delegationName = regDelegationName;
          data.stateName = stateName;
          data.transferentName = transferentName;
          data.stationName = stationName;
          return data;
        });

        Promise.all(info).then(data => {
          this.paragraphs.load(data);
          this.totalItems = response.count;
          this.loading = false;
        });
      },
      error: error => {},
    });
  }

  getTypeRelevant(id: number) {
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
  }

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
    const inventoryNum = this.form.get('inventoryNum').value;
    const goodDescription = this.form.get('goodDescription').value;
    const typeRelevantId = this.form.get('typeRelevantId').value;
    const solicitudId = this.form.get('solicitudId').value;
    const statusGood = this.form.get('statusGood').value;
    const uniqueKey = this.form.get('uniqueKey').value;
    const fileNum = this.form.get('fileNum').value;
    const unitMeasurement = this.form.get('unitMeasurement').value;
    const physicalStatus = this.form.get('physicalStatus').value;
    const conservationStatus = this.form.get('conservationStatus').value;
    const transferId = this.form.get('transferId').value;

    if (goodId) this.params.getValue()['filter.goodId'] = `$eq:${goodId}`;
    if (inventoryNum)
      this.params.getValue()['filter.inventoryNum'] = inventoryNum;
    if (goodDescription)
      this.params.getValue()['filter.goodDescription'] = goodDescription;
    if (typeRelevantId)
      this.params.getValue()['filter.typeRelevantId'] = typeRelevantId;
    if (solicitudId) this.params.getValue()['filter.solicitudId'] = solicitudId;
    if (statusGood) this.params.getValue()['filter.statusGood'] = statusGood;
    if (uniqueKey) this.params.getValue()['filter.uniqueKey'] = uniqueKey;
    if (fileNum) this.params.getValue()['filter.fileNum'] = fileNum;
    if (unitMeasurement)
      this.params.getValue()['filter.unitMeasurement'] = unitMeasurement;
    if (physicalStatus)
      this.params.getValue()['filter.physicalStatus'] = physicalStatus;
    if (conservationStatus)
      this.params.getValue()['filter.conservationStatus'] = conservationStatus;
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
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsResDevInv());
  }

  reportGoods() {
    this.loadingReport = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()[
      'filter.regionalDelegationId'
    ] = `$eq:${this.delRegUserLog}`;
    this.goodProcessService.goodResDevInvReport(params.getValue()).subscribe({
      next: response => {
        this.downloadExcel(response.base64File, 'Reporte_Bienes.xlsx');
        this.loadingReport = false;
      },
      error: error => {},
    });
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
