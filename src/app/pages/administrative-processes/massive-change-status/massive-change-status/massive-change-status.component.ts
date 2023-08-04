import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodMassiveService } from 'src/app/core/services/ms-good/status-good-massive.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { previewData } from 'src/app/pages/documents-reception/goods-bulk-load/interfaces/goods-bulk-load-table';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { COLUMNS } from './columns';

interface NotData {
  id: number;
  reason: string;
}
interface IDs {
  No_bien: number;
}
@Component({
  selector: 'app-massive-change-status',
  templateUrl: './massive-change-status.component.html',
  styleUrls: ['./massive-change-status.component.scss'],
})
export class MassiveChangeStatusComponent extends BasePage implements OnInit {
  fileName: string = 'Seleccionar archivo';
  tableSource: previewData[] = [];
  data: LocalDataSource = new LocalDataSource();
  ids: IDs[];
  form: FormGroup;
  goods: any[] = [];
  availableToUpdate: any[] = [];
  idsNotExist: NotData[] = [];
  idsNotUpdated: any[] = [];
  idsUpdated: any[] = [];
  showError: boolean = false;
  showStatus: boolean = false;
  availableToAssing: boolean = false;
  $trackedGoods = this.store.select(getTrackedGoods);
  ngGlobal: any;
  get goodStatus() {
    return this.form.get('goodStatus');
  }
  get observation() {
    return this.form.get('observation');
  }

  //Variables de navegación
  params = new BehaviorSubject<ListParams>(new ListParams());
  newLimit = new FormControl(10);
  totalItems: number = 0;

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private readonly goodServices: GoodService,
    private readonly goodMassiveServices: StatusGoodMassiveService,
    private massiveGoodService: MassiveGoodService,
    private historyStatusGoodService: HistoryGoodService,
    private globalVarService: GlobalVarsService,
    private goodTrackerService: GoodTrackerService,
    private router: Router,
    private store: Store
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
    this.settings.rowClassFunction = (row: { data: { avalaible: any } }) =>
      row.data.avalaible != null
        ? row.data.avalaible
          ? 'bg-success text-white'
          : 'bg-dark text-white'
        : '';
  }

  ngOnInit(): void {
    this.buildForm();
    this.$trackedGoods.subscribe({
      next: response => {
        if (response !== undefined) {
          this.loadGood(response);
        }
        this.loading = false;
      },
      error: err => {
        console.log(err);
      },
    });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      this.paginator(params.page, params.limit);
    });

    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          if (this.ngGlobal.REL_BIENES) {
            console.log(this.ngGlobal.REL_BIENES);
            const paramsF = new FilterParams();
            paramsF.addFilter('identificator', this.ngGlobal.REL_BIENES);
            this.goodTrackerService
              .getAllTmpTracker(paramsF.getParams())
              .subscribe(res => {
                console.log(res);
                this.loading = true;
                let count = 0;
                res['data'].forEach(good => {
                  count = count + 1;
                  this.goodServices.getById(good.goodNumber).subscribe({
                    next: response => {
                      console.log(response)
                      this.goods.push({
                        ...JSON.parse(JSON.stringify(response)).data[0],
                        avalaible: null,
                      });
                      console.log(this.goods);
                      this.addStatus();
                      /* this.validGood(JSON.parse(JSON.stringify(response)).data[0]); */ //!SE TIENE QUE REVISAR
                    },
                    error: err => {
                      if (err.error.message === 'No se encontrarón registros')
                        this.idsNotExist.push({
                          id: good.goodNumber,
                          reason: err.error.message,
                        });
                    },
                  });
                  if (count === res['data'].length) {
                    this.loading = false;
                    this.showError = true;
                    this.availableToAssing = true;
                  }
                });
              });
          }
        },
      });
  }

  private buildForm() {
    this.form = this.fb.group({
      goodStatus: [null, [Validators.required]],
      observation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  //Llenado de excel
  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data.load([]);
      this.goods = [];
      this.availableToUpdate = [];
      this.idsNotExist = [];
      this.goodStatus.reset();
      this.observation.reset();
      this.showError = false;
      this.showStatus = false;

      this.ids = this.excelService.getData(binaryExcel);
      if (this.ids[0].No_bien === undefined) {
        this.alert(
          'error',
          'Ocurrio un error al leer el archivo',
          'El archivo no cuenta con la estructura requerida'
        );
        return;
      } else {
        this.loadGood(this.ids);
        this.alert('success', 'Archivo subido', '');
      }
    } catch (error) {
      this.alert('error', 'Ocurrio un error al leer el archivo', '');
    }
  }

  loadDescription() {
    console.log(this.goodStatus.value);
  }

  loadGood(data: any[]) {
    this.loading = true;
    let count = 0;
    data.forEach(good => {
      count = count + 1;
      this.goodServices.getById(good.No_bien).subscribe({
        next: response => {
          this.goods.push({
            ...JSON.parse(JSON.stringify(response)).data[0],
            avalaible: null,
          });
          console.log(this.goods);
          this.addStatus();
          /* this.validGood(JSON.parse(JSON.stringify(response)).data[0]); */ //!SE TIENE QUE REVISAR
        },
        error: err => {
          if (err.error.message === 'No se encontrarón registros')
            this.idsNotExist.push({
              id: good.goodNumber,
              reason: err.error.message,
            });
        },
      });
      if (count === data.length) {
        this.loading = false;
        this.showError = true;
        this.availableToAssing = true;
      }
    });
  }

  addStatus() {
    /* this.data.load(this.goods); */
    this.paginator();
    this.data.refresh();
  }

  paginator(noPage: number = 1, elementPerPage: number = 10) {
    const indiceInicial = (noPage - 1) * elementPerPage;
    const indiceFinal = indiceInicial + elementPerPage;

    let paginateData = this.goods.slice(indiceInicial, indiceFinal);
    this.data.load(paginateData);
  }

  //Asigna estatus
  assignsStatus() {
    console.log(this.goodStatus.value);
    if (this.goodStatus.value != null) {
      if (this.observation.value != null) {
        for (let good of this.goods) {
          console.log(good);
          this.massiveGoodService.getBanVal(good.status).subscribe(
            res => {
              console.log({ msg: 'res banval', data: res.data[0].count });
              const count = res.data[0].count;
              if (count == 0) {
                good.avalaible = false;
                this.idsNotExist.push({
                  id: good.goodId,
                  reason: `Bien no disponible para actualización: `,
                });
                //Pintar la fila no_disponible
              } else if (count > 0) {
                good.avalaible = true;
                good.status = this.goodStatus.value.status;
                this.availableToUpdate.push({
                  goodId: good.goodId,
                  message: 'disponible para actualizar',
                });
                if (this.goodStatus.value.status == 'CAN') {
                  good.observations = `${this.observation.value}. ${good.observations}`;
                }
              }
            },
            err => {
              console.log({ msg: 'err banval', data: err });
            }
          );
        }
        this.alert('success', 'Se asignó estatus a los Bienes', '');
        this.paginator();
      } else {
        this.alert('warning', 'Debe especificar el motivo del cambio.', '');
      }
    } else {
      this.alert('warning', 'Debe especificar el Estatus', '');
    }
  }

  applyStatus() {
    for (let good of this.data['data']) {
      if (good.avalaible) {
        const model: IGood = {
          id: good.id,
          goodId: good.goodId,
          status: good.status,
          observations: good.observations,
        };

        this.goodServices.update(model).subscribe(
          res => {
            const modelHistory: IHistoryGood = {
              propertyNum: good.goodId,
              status: this.goodStatus.value.status,
              changeDate: new Date().toISOString(),
              userChange:
                localStorage.getItem('username') == 'sigebiadmon'
                  ? localStorage.getItem('username')
                  : localStorage.getItem('username').toLocaleUpperCase(),
              statusChangeProgram: 'FACTADBCAMBIOESTAT',
              reasonForChange: this.observation.value,
            };

            this.historyStatusGoodService.create(modelHistory).subscribe(
              res => {
                this.idsUpdated.push(good);
                this.data.refresh();
              },
              err => {
                this.alert(
                  'error',
                  'No se registró el cambio en Historico estatus de bienes',
                  ''
                );
              }
            );
          },
          err => {
            this.idsNotUpdated.push(good);
          }
        );
      } else {
        this.idsNotUpdated.push(good);
      }
    }
    this.alert('success', 'Se aplicó el cambio de estatus en los Bienes', '');
    this.availableToAssing = false;
  }

  /*  applyStatus() {
    for (let good of this.data['data']) {
      if (good.avalaible) {
        const model: IGood = {
          id: good.id,
          goodId: good.goodId,
          status: good.status,
          observations: good.observations,
        };

        this.goodServices.update(model).subscribe(
          res => {
            const modelHistory: IHistoryGood = {
              propertyNum: good.goodId,
              status: this.goodStatus.value.status,
              changeDate: new Date().toISOString(),
              userChange:
                localStorage.getItem('username') == 'sigebiadmon'
                  ? localStorage.getItem('username')
                  : localStorage.getItem('username').toLocaleUpperCase(),
              statusChangeProgram: 'FACTADBCAMBIOESTAT',
              reasonForChange: this.observation.value,
            };

            this.historyStatusGoodService.create(modelHistory).subscribe(
              res => {
                this.idsUpdated.push(good);
                this.data.refresh();
              },
              err => {
                this.alert(
                  'error',
                  'No se registró el cambio en Historico estatus de bienes',
                  ''
                );
              }
            );
          },
          err => {
            this.idsNotUpdated.push(good);
          }
        );
      } else {
        this.idsNotUpdated.push(good);
      }
    }
    this.alert('success', 'Se aplicó el cambio de estatus en los Bienes', '');
    this.availableToAssing = false;
  } */

  changeStatusGood() {
    if (this.goods.length === 0) {
      this.alert('error', 'ERROR', 'Debe cargar la lista de bienes');
      return;
    }
    this.goods.forEach(good => {
      good.status = this.goodStatus.value;
      if (this.goodStatus.value === 'CAN') {
        good.observations = `${this.observation.value}. ${good.observations}`;
      }
      this.goodServices.update(good).subscribe({
        next: response => {
          console.log(response);
        },
        error: err => {
          this.loading = false;
          this.idsNotExist.push({ id: good.id, reason: err.error.message });
        },
      });
    });
    this.alert(
      'success',
      'Actualizado',
      'Se ha cambiado el status de los bienes seleccionados'
    );
    this.addStatus();
    this.showStatus = true;
  }

  goToRastreador() {
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FACTADBCAMBIOESTAT' },
    });
  }

  clearAll() {
    this.data.load([]);
    this.goodStatus.reset();
    this.observation.reset();
    this.idsNotExist = [];
    this.idsNotUpdated = [];
    this.idsUpdated = [];
    this.goods = [];
    this.availableToAssing = false;
    this.showError = false;
  }

  /* validGood(good: IGood) {
    console.log(good.status)
    this.goodMassiveServices.checkStatusMasiv(good.status).subscribe({
      next: response => {
        console.log(response);
      },
      error: err => {
        console.log(err);
        console.log('No entro');
        this.goods = this.goods.filter(item => item.id != good.id);
        this.idsNotExist.push({
          id: good.id,
          reason: 'No se puede cambiar el Status en esta pantalla',
        });
        this.addStatus();
      },
    });
  } */

  /* goToGoodTracker() {
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FACTADBUBICABIEN' },
    });
  } */
}
