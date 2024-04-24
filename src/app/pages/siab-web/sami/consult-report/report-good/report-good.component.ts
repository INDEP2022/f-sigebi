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
      'filter.no_delegacion'
    ] = `$eq:${this.delRegUserLog}`;

    this.goodFinderService.goodFinderJoin(this.params.getValue()).subscribe({
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
    const id_bien = this.form.get('goodId').value;
    const no_inventario = this.form.get('inventoryNumber').value;
    const descripcion_bien = this.form.get('goodDescription').value;
    const tipo_relevante_descricpcion = this.form.get('idRelevantType').value;
    const id_solicitud = this.form.get('requestId').value;
    const estatus = this.form.get('status').value;
    const clave_unica = this.form.get('uniqueKey').value;
    const no_expediente = this.form.get('fileNumber').value;
    const unidad_view_unit_of_measure_tl =
      this.form.get('measureTlUnitView').value;
    const descripcion_estado_fisico = this.form.get(
      'descriptionPhysicalStatus'
    ).value;
    const descripcion_estado_conservacion = this.form.get(
      'descriptionConservationStatus'
    ).value;
    const id_transferente = this.form.get('transferId').value;

    if (id_bien) this.params.getValue()['filter.id_bien'] = `$eq:${id_bien}`;
    if (no_inventario)
      this.params.getValue()['filter.no_inventario'] = `$eq:${no_inventario}`;
    if (descripcion_bien)
      this.params.getValue()[
        'filter.descripcion_bien'
      ] = `$ilike:${descripcion_bien}`;
    if (tipo_relevante_descricpcion)
      this.params.getValue()[
        'filter.tipo_relevante_descricpcion'
      ] = `$ilike:${tipo_relevante_descricpcion}`;
    if (id_solicitud)
      this.params.getValue()['filter.id_solicitud'] = id_solicitud;
    if (estatus) this.params.getValue()['filter.estatus'] = `$ilike:${estatus}`;
    if (clave_unica) this.params.getValue()['filter.clave_unica'] = clave_unica;
    if (no_expediente)
      this.params.getValue()['filter.no_expediente'] = no_expediente;
    if (unidad_view_unit_of_measure_tl)
      this.params.getValue()[
        'filter.unidad_view_unit_of_measure_tl'
      ] = `$eq:${unidad_view_unit_of_measure_tl}`;
    if (descripcion_estado_fisico)
      this.params.getValue()[
        'filter.descripcion_estado_fisico'
      ] = `$ilike:${descripcion_estado_fisico}`;
    if (descripcion_estado_conservacion)
      this.params.getValue()[
        'filter.descripcion_estado_conservacion'
      ] = `$ilike:${descripcion_estado_conservacion}`;
    if (id_transferente) {
      this.params.getValue()[
        'filter.solicitudes_id_transferente'
      ] = `$eq:${id_transferente}`;
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
      this.params.getValue()[
        'filter.no_delegacion'
      ] = `$eq:${this.delRegUserLog}`;
      params.getValue().limit = this.totalItems;
      this.goodFinderService
        .goodFinderJoinCsv(this.params.getValue())
        .subscribe({
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
