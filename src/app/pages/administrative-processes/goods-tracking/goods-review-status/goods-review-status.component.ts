import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { COLUMNS } from './columns';
@Component({
  selector: 'app-goods-review-status',
  templateUrl: './goods-review-status.component.html',
  styles: [],
})
export class GoodsReviewStatusComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  delegationNumber: any; // BLK_CONTROL.DELEGACION
  responsable: any; // BLK_CONTROL.RESPONSABLE
  goodsExcel: any;
  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodService: GoodService,
    private segAcessXAreasService: SegAcessXAreasService,
    private token: AuthService,
    private goodprocessService: GoodprocessService,
    private readonly historyGoodService: HistoryGoodService
  ) {
    super();
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
    this.getDataPupInicializaForma();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      option: [null, [Validators.required]],
    });
  }

  showInfo() {}

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
              EXISTE = good.goodNumber;
              vl_ID_EVENTO = good.eventId;
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
                eventId: good.eventId,
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
                  status: excelImport[i].status,
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
      this.goodService.getAll(params).subscribe({
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
      this.goodService.getAll(params).subscribe({
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
      this.goodService.getAll(params).subscribe({
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

    const areaCorresp: any = await this.getAreaCorresp(user);
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
  async getAreaCorresp(user: any) {
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
}
