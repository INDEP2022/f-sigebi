import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsReview } from 'src/app/core/services/ms-good/goods-review.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IGoodsReview } from '../../../../core/models/ms-good/goods-review.model';
import { COLUMNS } from './columns';
//import { async } from '../../../../common/helpers/helpers';

@Component({
  selector: 'app-goods-review-status',
  templateUrl: './goods-review-status.component.html',
  styles: [],
})
export class GoodsReviewStatusComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columns: IGoodsReview[] = [];
  delegations = new DefaultSelect();
  delegacionId: any;
  delegationNumber: any; // BLK_CONTROL.DELEGACION
  responsable: any; // BLK_CONTROL.RESPONSABLE
  goodsExcel: any;
  selectedGender: string = 'all';
  jsonToCsv: any[] = [];
  rowSelected: boolean = false;
  selectedRow: any = null;
  selectOnClick: boolean = false;
  permitSelect = true;
  @Output() onSelect = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsMotivesrev: GoodsReview,
    private departmentService: DepartamentService,
    private excelService: ExcelService,
    private goodService: GoodService,
    private segAcessXAreasService: SegAcessXAreasService,
    private token: AuthService,
    private goodprocessService: GoodprocessService,
    private readonly historyGoodService: HistoryGoodService,
    private delegationService: DelegationService,
    private dynamicCatalogsService: DynamicCatalogsService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMotives());
    this.prepareForm();
    this.getDataPupInicializaForma();
  }

  handleGenderChange() {
    console.log('Selected gender: ' + this.selectedGender);
    this.loading = true;
    this.getMotives();
  }

  async getMotives() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
    };

    if (this.selectedGender == 'movables') {
      params['filter.goodType'] = `$eq:M`;
    } else if (this.selectedGender == 'immovables') {
      params['filter.goodType'] = `$eq:I`;
    }

    this.goodsMotivesrev.getAll(params).subscribe({
      next: async (response: any) => {
        let result = response.data.map(async (item: any) => {
          const detailsDelegation: any = await this.getDelegation(
            item.delegation
          );
          item['descriptionGood'] = item.goodNumber
            ? item.goodNumber.description
            : null;
          item['goodDetails'] = item.goodNumber;
          item['goodNumber'] = item.goodNumber ? item.goodNumber.id : null;
          item['detailsDelegation'] = detailsDelegation
            ? detailsDelegation.description
            : null;
        });

        Promise.all(result).then(async (resp: any) => {
          // this.columns = response.data;
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
          console.log(response);
        });
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  async getDelegation(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    params['filter.phaseEdo'] = `$eq:2`;
    return new Promise((resolve, reject) => {
      this.delegationService.getAll(params).subscribe({
        next: response => {
          // this.loading = false;
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          // this.loading = false;
          console.log(err);
        },
      });
    });
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      option: [null, [Validators.required]],
    });
  }

  showInfo() {}
  shot() {}
  delete(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  // CARGAR EXCEL / CSV //
  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  // LEER EXCEL / CSV //
  async readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      const excelImport = this.excelService.getData<any>(binaryExcel);
      await this.attentionMassive(excelImport);
      // this.data1.load(excelImport);
      // this.showPagination = false;
      // this.totalItems = this.data1.count();
    } catch (error) {
      this.alert('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  // FUNCIÓN DE BOTÓN DE ATENCIÓN MASIVA //
  async attentionMassive(excelImport: any) {
    console.log('excelImport', excelImport);
    if (excelImport.length == 0) {
      this.alert('error', 'No hay data cargada en el archivo', 'Error');
      return;
    }
    let EXISTE: number = 0;
    let ATENCION = 1;
    let ACTUALIZA = 0;
    let vl_ID_EVENTO = 0;
    let ESTATUSB: number;
    let ESTATUSF: string;
    this.alertQuestion(
      'info',
      '¿Está seguro de dar por atendidos los bienes del archivo?',
      ''
    ).then(async question => {
      if (question.isConfirmed) {
        // TEXT_IO.GET_LINE(LFIARCHIVO, LST_CADENA);
        // V_NO_BIEN:= GETWORDCSV(LST_CADENA, 1);

        for (let i = 0; i < excelImport.length; i++) {
          if (excelImport[i].goodNumber != null) {
            EXISTE = 0;
            ATENCION = 1;
            ACTUALIZA = 0;
            vl_ID_EVENTO = 0;

            let obj = {
              goodNumber: excelImport[i].goodNumber,
              attended: 0,
              manager: this.responsable,
            };
            const good: any = await this.getGoodReturn(obj);
            console.log('good', good);

            if (good != null) {
              EXISTE = good.goodNumber.id;
              vl_ID_EVENTO = good.eventId.id;
              ESTATUSB = good.status;
            } else {
              this.alert(
                'warning',
                `Verifique las condiciones de atención de proceso REV del bien: ${excelImport[i].goodNumber}`,
                ''
              );
            }

            if (EXISTE > 0) {
              let obj_: any = {
                goodNumber: excelImport[i].goodNumber,
                eventId: good.eventId.id,
                goodType: good.goodType,
                status: good.status,
                manager: this.responsable,
                delegation: good.delegation,
                attended: 1,
              };

              const updateGoodMotivRev = await this.updateGoodMotivosRev(obj_);

              if (updateGoodMotivRev == true) {
                ACTUALIZA = 1;
              } else {
                this.alert(
                  'warning',
                  `El bien: ${excelImport[i].goodNumber} no se pudo atender en MOTIVOSREV`,
                  ''
                );
              }

              let objGood: any = {
                goodNumber: excelImport[i].goodNumber,
                attended: 0,
              };
              const getGoodAttended: any = await this.getGoodAndAttendedReturn(
                objGood
              );
              if (getGoodAttended != null) {
                ATENCION = getGoodAttended;
              } else {
                ATENCION = 0;
              }

              if (ATENCION == 0 && ACTUALIZA == 1) {
                let objScreen = {
                  goodNumber: excelImport[i].goodNumber,
                  status: ESTATUSB,
                };
                const screenXStatus: any = await this.getScreenXStatus(
                  objScreen
                );

                if (screenXStatus != null) {
                  ESTATUSF = screenXStatus;
                } else {
                  this.alert(
                    'warning',
                    `No se identificó el estatus final para el bien: ${excelImport[i].goodNumber}`,
                    ''
                  );
                  ACTUALIZA = 0;
                }

                let objUpdateGood: any = {
                  id: excelImport[i].goodNumber,
                  goodId: excelImport[i].goodNumber,
                  status: ESTATUSF,
                };
                const updateGood: any = await this.updateGoodStatus(
                  objUpdateGood
                );

                if (updateGood == null) {
                  ACTUALIZA = 0;
                  this.alert(
                    'error',
                    `Error al actualizar el estatus del bien: ${excelImport[i].goodNumber}`,
                    ''
                  );
                }

                if (ACTUALIZA == 1) {
                  var currentDate = new Date();
                  var futureDate = new Date(currentDate.getTime() + 5 * 1000); // A

                  const historyGood: IHistoryGood = {
                    propertyNum: excelImport[i].goodNumber,
                    status: ESTATUSF,
                    changeDate: futureDate,
                    userChange: this.token.decodeToken().preferred_username,
                    statusChangeProgram: 'FMATENCBIENESREV',
                    reasonForChange: 'POR ESTATUS REV MASIVO',
                    registryNum: null,
                    extDomProcess: null,
                  };
                  const insertHistoric: any = await this.putInsertHistoric(
                    historyGood
                  );
                } else {
                  let obj__: any = {
                    goodNumber: excelImport[i].goodNumber,
                    eventId: vl_ID_EVENTO,
                    goodType: good.goodType,
                    status: good.status,
                    manager: this.responsable,
                    delegation: good.delegation,
                    attended: 0,
                  };

                  const updateGoodMotivRev = await this.updateGoodMotivosRev(
                    obj__
                  );
                }
              }
            }
          }
        }
      }
    });
  }

  // OBTENER - BIENES_MOTIVOSREV
  async getGoodReturn(data: any) {
    const params = new ListParams();
    params['filter.goodNumber'] = `$eq:${data.goodNumber}`;
    params['filter.attended'] = `$eq:${data.attended}`;
    params['filter.manager'] = `$eq:${data.manager}`;
    return new Promise((resolve, reject) => {
      this.goodsMotivesrev.getAll(params).subscribe({
        next: response => {
          console.log('res', response);
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // UPDATE - BIENES_MOTIVOSREV
  async updateGoodMotivosRev(params: any) {
    return new Promise((resolve, reject) => {
      this.goodService.updateGoodsRev(params).subscribe({
        next: response => {
          console.log('res', response);
          resolve(true);
        },
        error: err => {
          resolve(false);
        },
      });
    });
  }

  // OBTENER SOLO GOOD Y ATTENDED - BIENES_MOTIVOSREV
  async getGoodAndAttendedReturn(data: any) {
    const params = new ListParams();
    params['filter.goodNumber'] = `$eq:${data.goodNumber}`;
    params['filter.attended'] = `$eq:${data.attended}`;
    return new Promise((resolve, reject) => {
      this.goodsMotivesrev.getAll(params).subscribe({
        next: response => {
          console.log('res', response);
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // OBTENER STATUS - SCREENXSTATUS
  async getScreenXStatus(data: any) {
    return new Promise((resolve, reject) => {
      this.goodprocessService.getAppliesControl(data).subscribe({
        next: response => {
          console.log('res', response);
          resolve(response.data[0].estatus_nuevo_bien);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // UPDATE - BIENES
  async updateGoodStatus(params: any) {
    return new Promise((resolve, reject) => {
      this.goodService.updateWithParams(params).subscribe({
        next: response => {
          console.log('res', response);
          resolve(true);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // INSERTAR - HISTORY GOOD
  async putInsertHistoric(historyGood: any) {
    this.historyGoodService.create(historyGood).subscribe({
      next: response => {
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  // PUP_INICIALIZA_FORMA
  async getDataPupInicializaForma() {
    const user = this.token.decodeToken().preferred_username;
    const dataUserToolbar: any = await this.getDataUser(user);
    if (dataUserToolbar != null)
      this.delegationNumber = dataUserToolbar.delegationNumber;

    let obj = {
      otvalor: user,
    };
    const areaCorresp: any = await this.getAreaCorresp(obj);
    if (areaCorresp != null) this.responsable = areaCorresp;
  }

  // consulta tabla: SEG_ACCESO_X_AREAS
  async getDataUser(user: any) {
    const params = new ListParams();
    params['filter.user'] = `$eq:${user}`;
    params['filter.assigned'] = `$eq:S`;
    return new Promise((resolve, reject) => {
      this.segAcessXAreasService.getAll(params).subscribe({
        next: (resp: any) => {
          console.log('resp', resp);
          const data = resp.data[0];
          resolve(data);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // consulta tabla: TVALTABLA1 -- Esperando endpoint --
  async getAreaCorresp(data: any) {
    return new Promise((resolve, reject) => {
      this.dynamicCatalogsService.getOtValor(data).subscribe({
        next: (resp: any) => {
          console.log('resp', resp);
          const data = resp.data[0].otvalor;
          resolve(data);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // Exporta a excel 'csv'
  async exportar() {
    const filename: string = 'Data';
    const jsonToCsv = await this.returnJsonToCsv();
    console.log('jsonToCsv', jsonToCsv);
    this.jsonToCsv = jsonToCsv;
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
  }

  async returnJsonToCsv() {
    return this.data.getAll();
  }

  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row.data;
    this.rowSelected = true;
  }

  confirm() {
    if (!this.rowSelected) return;
    this.onSelect.emit(this.selectRow);
    this.modalRef.hide();
  }

  async attention() {
    if (!this.selectedRow) {
      this.alert('error', 'No se ha seleccionado ninguna fila', 'Error');
      return;
    }

    let EXISTE: number = 0;
    let ATENCION = 1;
    let ACTUALIZA = 0;
    let vl_ID_EVENTO = 0;
    let ESTATUSB: number;
    let ESTATUSF: string;

    this.alertQuestion(
      'info',
      '¿Está seguro de dar por atendidos los bienes del archivo?',
      ''
    ).then(async question => {
      if (question.isConfirmed) {
        EXISTE = 0;
        ATENCION = 1;
        ACTUALIZA = 0;
        vl_ID_EVENTO = 0;

        let obj = {
          goodNumber: this.selectedRow.goodNumber,
          attended: 0,
          manager: this.selectedRow.manager,
        };
        const good: any = await this.getGoodReturn(obj);
        console.log('good', good);

        if (good != null) {
          EXISTE = good.goodNumber.id;
          vl_ID_EVENTO = good.eventId.id;
          ESTATUSB = good.status;
        } else {
          this.alert(
            'warning',
            `Verifique las condiciones de atención de proceso REV del bien: ${this.selectedRow.goodNumber}`,
            ''
          );
          return;
        }

        if (EXISTE > 0) {
          let obj_: any = {
            goodNumber: this.selectedRow.goodNumber,
            eventId: good.eventId.id,
            goodType: good.goodType,
            status: good.status,
            manager: this.selectedRow.manager,
            delegation: good.delegation,
            attended: 1,
          };

          const updateGoodMotivRev = await this.updateGoodMotivosRev(obj_);

          if (updateGoodMotivRev == true) {
            ACTUALIZA = 1;
          } else {
            this.alert(
              'warning',
              `El bien: ${this.selectedRow.goodId} no se pudo atender en MOTIVOSREV`,
              ''
            );
          }

          let objGood: any = {
            goodNumber: this.selectedRow.goodNumber,
            attended: 0,
          };
          const getGoodAttended: any = await this.getGoodAndAttendedReturn(
            objGood
          );
          if (getGoodAttended != null) {
            ATENCION = getGoodAttended;
          } else {
            ATENCION = 0;
          }

          if (ATENCION == 0 && ACTUALIZA == 1) {
            let objScreen = {
              goodNumber: this.selectedRow.goodNumber,
              status: ESTATUSB,
            };
            const screenXStatus: any = await this.getScreenXStatus(objScreen);

            if (screenXStatus != null) {
              ESTATUSF = screenXStatus;
            } else {
              this.alert(
                'warning',
                `No se identificó el estatus final para el bien: ${this.selectedRow.goodId}`,
                ''
              );
              ACTUALIZA = 0;
            }

            let objUpdateGood: any = {
              id: this.selectedRow.goodNumber,
              goodNumber: this.selectedRow.goodNumber,
              status: ESTATUSF,
            };
            const updateGood: any = await this.updateGoodStatus(objUpdateGood);

            if (updateGood == null) {
              ACTUALIZA = 0;
              this.alert(
                'error',
                `Error al actualizar el estatus del bien: ${this.selectedRow.goodNumber}`,
                ''
              );
            }

            if (ACTUALIZA == 1) {
              var currentDate = new Date();
              var futureDate = new Date(currentDate.getTime() + 5 * 1000); // A

              const historyGood: IHistoryGood = {
                propertyNum: this.selectedRow.goodNumber,
                status: ESTATUSF,
                changeDate: futureDate,
                userChange: this.token.decodeToken().preferred_username,
                statusChangeProgram: 'FMATENCBIENESREV',
                reasonForChange: 'POR ESTATUS REV MASIVO',
                registryNum: null,
                extDomProcess: null,
              };
              const insertHistoric: any = await this.putInsertHistoric(
                historyGood
              );
            } else {
              let obj__: any = {
                goodNumber: this.selectedRow.goodNumber,
                eventId: vl_ID_EVENTO,
                goodType: good.goodType,
                status: good.status,
                manager: this.selectedRow.manager,
                delegation: good.delegation,
                attended: 0,
              };

              const updateGoodMotivRev = await this.updateGoodMotivosRev(obj__);
            }
          }
        }
      }
    });
  }
}
