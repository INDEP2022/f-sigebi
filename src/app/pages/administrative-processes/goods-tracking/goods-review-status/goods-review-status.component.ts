import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodService: GoodService,
    private segAcessXAreasService: SegAcessXAreasService,
    private token: AuthService
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

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      const excelImport = this.excelService.getData<any>(binaryExcel);

      this.attentionMassive(excelImport);
      // this.data1.load(excelImport);
      // this.totalItems = this.data1.count();
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  goodSelected: any;
  attentionMassive(excelImport: any) {
    let EXISTE: number = 0;
    let ATENCION = 1;
    let ACTUALIZA = 0;
    let vl_ID_EVENTO = 0;
    let ESTATUSB: number;
    this.alertQuestion(
      'info',
      '¿Está seguro de dar por atendidos los bienes del archivo?',
      ''
    ).then(async question => {
      if (question.isConfirmed) {
        // TEXT_IO.GET_LINE(LFIARCHIVO, LST_CADENA);
        // V_NO_BIEN:= GETWORDCSV(LST_CADENA, 1);

        EXISTE = 0;
        ATENCION = 1;
        ACTUALIZA = 0;
        vl_ID_EVENTO = 0;

        let obj = {
          goodNumber: this.goodSelected.goodNumber,
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
            `Verifique las condiciones de atención de proceso REV del bien: ${obj.goodNumber}`,
            ''
          );
        }

        if (EXISTE > 0) {
          let obj: any = {
            goodNumber: good.goodNumber,
            eventId: good.eventId,
            goodType: good.goodType,
            status: good.status,
            manager: this.responsable,
            delegation: good.delegation,
            attended: 1,
          };

          const updateGood = await this.updateGoodMotivosRev(obj);

          if (updateGood == null) {
          }
          // BEGIN
          //           UPDATE BIENES_MOTIVOSREV
          //              SET ATENDIDO = 1
          //            WHERE     NO_BIEN = V_NO_BIEN
          //                  AND RESPONSABLE = : BLK_CONTROL.RESPONSABLE
          //                  AND ATENDIDO = 0;

          // ACTUALIZA:= 1;
          // --LIRH En caso de que no se pueda actulizar el bien se usara la variable para regresar el estatus a 0
          //           EXCEPTION WHEN OTHERS THEN
          // LIP_MENSAJE('El bien: ' || V_NO_BIEN || ' no se pudo atender en MOTIVOSREV', 'S');
          // ACTUALIZA:= 0;
          // END;
        }
      }
    });
  }

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
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
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
