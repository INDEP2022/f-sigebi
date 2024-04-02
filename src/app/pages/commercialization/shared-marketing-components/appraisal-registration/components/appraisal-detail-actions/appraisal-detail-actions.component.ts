import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AppraisesService } from 'src/app/core/services/ms-appraises/appraises.service';
import { MsMassiveappraiseService } from 'src/app/core/services/ms-massiveappraise/ms-massiveappraise.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import { AppraisalRegistrationChild } from '../../classes/appraisal-registration-child';

const ALLOWED_EXTENSIONS = ['xls', 'xlsx', 'csv'];
@Component({
  selector: 'appraisal-detail-actions',
  templateUrl: './appraisal-detail-actions.component.html',
  styles: [],
})
export class AppraisalDetailActionsComponent
  extends AppraisalRegistrationChild
  implements OnInit
{
  $file = new BehaviorSubject<(file: File) => any>(null);
  fileControl = new FormControl();
  @ViewChild('inputFile', { static: true })
  inputFile: ElementRef<HTMLInputElement>;
  tipeProccess: string;
  get controls() {
    return this.comerEventForm.controls;
  }
  constructor(
    private parameterComerService: ParameterModService,
    private massiveGoodService: MassiveGoodService,
    private msMassiveappraiseService: MsMassiveappraiseService,
    private appraisesService: AppraisesService
  ) {
    super();
  }

  ngOnInit(): void {}

  // ? ------------------------- DESCARGAR FORMATO

  async onDownloadFormat() {
    const { id_evento } = this.controls;
    if (!id_evento.value) {
      this.alert('warning', 'Debe ingresar el No. Evento', '');
      return;
    }

    const { isConfirmed } = await this.alertQuestion(
      'question',
      '¿Desea Descargar el Formato de Avalúo',
      ''
    );
    if (isConfirmed) {
      this.downloadFormat();
    }
  }

  // PUP_DESCARGA_FORMATO
  downloadFormat() {
    this.$downloadGoodsFormat.next();
  }

  // ?-------------------------- INSERTAR AVALUOS
  async onInsertAppraissal() {
    this.tipeProccess = 'I';
    const body = this.getPufValEventBody('I');
    console.log(body);
    await this.pufValEvent(body);
    const { id_evento, item_desc_tpsolaval } = this.controls;
    console.log(this.controls);
    const { isConfirmed } = await this.alertQuestion(
      'question',
      `¿Ingresar Avalúos del evento ${id_evento.value}, referencia ${item_desc_tpsolaval.value}?`,
      ''
    );
    if (!isConfirmed) {
      return;
    }
    this.$file.next(this.insertAppraisal);
    this.inputFile.nativeElement.click();
  }

  // ?-------------------------- Agregar AVALUOS
  async onAddAppraissal() {
    const body = this.getPufValEventBody('A');
    this.tipeProccess = 'A';
    console.log(body);
    await this.pufValEvent(body);
    const { id_evento, item_desc_tpsolaval } = this.controls;
    console.log(this.controls);
    const { isConfirmed } = await this.alertQuestion(
      'question',
      `¿Agregar Bienes a los Avaluós del evento ${id_evento.value}, referencia ${item_desc_tpsolaval.value}?`,
      ''
    );
    if (!isConfirmed) {
      return;
    }
    this.$file.next(this.insertAppraisal);
    this.inputFile.nativeElement.click();
  }
  // ?-------------------------- Actualizar AVALUOS
  async onUpdateAppraissal() {
    const body = this.getPufValEventBody('U');
    this.tipeProccess = 'U';
    console.log(body);
    await this.pufValEvent(body);
    const { id_evento, item_desc_tpsolaval } = this.controls;
    console.log(this.controls);
    const { isConfirmed } = await this.alertQuestion(
      'question',
      `¿Actualizar los Avaluós del evento ${id_evento.value}, referencia ${item_desc_tpsolaval.value}?`,
      ''
    );
    if (!isConfirmed) {
      return;
    }
    this.$file.next(this.insertAppraisal);
    this.inputFile.nativeElement.click();
  }
  insertAppraisal(file: File) {
    const { id_evento, documentType } = this.controls;
    if (documentType.value != null) {
      if (this.global.direction == 'I') {
        this.loader.load = true;
        let res = {};
        this.appraisesService.deleteTmpeatAppraisal(res).subscribe({
          next: res => {
            console.log(res);
            let params = new ListParams();
            let data = {
              pEventId: id_evento.value,
              pTypeAppraisal: documentType.value,
              v_iva: this.global.vIva,
              address: this.global.direction,
            };
            this.massiveGoodService
              .postInsertTmpcomerappraisalProperty(params, file, data)
              .subscribe({
                next: resp => {
                  console.log(resp.data);

                  const { id_evento, no_delegacion, usuario } = this.controls;
                  let data = {
                    pEvent: id_evento.value,
                    typeProcces: this.tipeProccess,
                    delagationNumber: no_delegacion.value,
                    user: usuario.value,
                    address: this.global.direction,
                    whereAppraisalId: ' ',
                    screenKey: this.screen,
                    error: resp.data[0].GLOBAL_V_TMPBIENES_ERROR,
                  };
                  this.appraisesService
                    .postInsertAppraisalFcomerreavaluo(data)
                    .subscribe({
                      next: res => {
                        console.log(res);
                        this.searchGoods.next(id_evento.value);
                        this.loader.load = false;
                        this.$appraisedRejectedList.next(
                          res.COMER_AVALUOS_RECHAZADOS
                        );
                      },
                      error: eror => {
                        this.loader.load = false;
                      },
                    });
                },
                error: eror => {
                  this.alert(
                    'warning',
                    'Error falla de datos en el Evento y Bien',
                    ''
                  );

                  this.loader.load = false;
                },
              });
          },
          error: eror => {
            this.loader.load = false;
          },
        });
      } else {
        this.loader.load = true;
        let res = {};
        this.appraisesService.deleteTmpeatAppraisal(res).subscribe({
          next: res => {
            console.log(res);
            let params = new ListParams();
            let data = {
              pEventId: id_evento.value,
              pTypeAppraisal: documentType.value,
            };
            this.massiveGoodService
              .postInsertTmpcomerappraisa(params, file, data)
              .subscribe({
                next: resp => {
                  console.log(resp);
                  const { id_evento, no_delegacion, usuario } = this.controls;
                  let data = {
                    pEvent: id_evento.value,
                    typeProcces: this.tipeProccess,
                    delagationNumber: no_delegacion.value,
                    user: usuario.value,
                    address: this.global.direction,
                    screenKey: this.screen,
                    tmpgoodError: resp.data[0].GLOBAL_V_TMPBIENES_ERROR,
                  };
                  this.massiveGoodService.postInsertAppraisal(data).subscribe({
                    next: res => {
                      console.log(res);
                      this.searchGoods.next(id_evento.value);
                      this.loader.load = false;
                      this.$appraisedRejectedList.next(
                        res.COMER_AVALUOS_RECHAZADOS
                      );
                    },
                    error: eror => {
                      console.log(eror);
                      this.alert(
                        'warning',
                        'Error falla de datos en el Evento y Bien',
                        ''
                      );
                      this.loader.load = false;
                    },
                  });
                },
                error: eror => {
                  this.loader.load = false;
                },
              });
          },
          error: eror => {
            this.loader.load = false;
          },
        });
      }
    } else {
      this.alert('warning', 'Debe seleccionar un Tipo de Oficio', '');
    }
  }

  async onValidationAppraissal() {
    const { isConfirmed } = await this.alertQuestion(
      'question',
      '¿Desea validar el archivo?',
      ''
    );
    if (isConfirmed) {
      this.$file.next(this.validFile);
      this.inputFile.nativeElement.click();
    }
  }
  validFile(file: File) {
    console.log(this.global.direction);
    if (this.global.direction == 'I') {
      this.loader.load = true;
      let params = new ListParams();
      let data = {
        vIva: this.global.vIva,
        columNumber: this.global.vColumnNum,
      };
      this.msMassiveappraiseService
        .postValidaArchivoAppraisalRegistryProperty(params, file, data)
        .subscribe({
          next: resp => {
            console.log(resp);
            this.alert('warning', resp.message, '');
            this.$appraisedRejectedGoodsList.next(resp.rejectedGoods);
            this.loader.load = false;
          },
          error: eror => {
            console.log(eror);
            this.alert('warning', eror.message[0], '');
            this.loader.load = false;
          },
        });
    } else {
      this.loader.load = true;
      let params = new ListParams();
      let data = {
        vIva: this.global.vIva,
        columNumber: 11,
      };
      this.msMassiveappraiseService
        .postValidaArchivoAppraisalRegistry(params, file, data)
        .subscribe({
          next: resp => {
            console.log(resp);
            this.alert('warning', resp.message, '');
            this.$appraisedRejectedGoodsList.next(resp.rejectedGoods);
            this.loader.load = false;
          },
          error: eror => {
            console.log(eror);
            this.alert('warning', eror.error.message, '');
            this.loader.load = false;
          },
        });
    }
  }

  // ? ------------------------- VALIDAR ARCHIVO DESCUENTO
  async onValidDisscountFile() {
    const { isConfirmed } = await this.alertQuestion(
      'question',
      '¿Desea validar el archivo de descuentos',
      ''
    );
    if (isConfirmed) {
      this.$file.next(this.validDisscountFile);
      this.inputFile.nativeElement.click();
    }
  }

  // PUP_VALIDA_ARCH_DESC
  validDisscountFile(file: File) {
    this.parameterComerService
      .validDisscountFile(file)
      .pipe(
        catchError(error => {
          this.alert('error', UNEXPECTED_ERROR, '');
          return throwError(() => error);
        }),
        tap(response => this.handleValidDisscountFileResponse(response.data))
      )
      .subscribe();
  }

  handleValidDisscountFileResponse(data: any[]) {
    const errors = data.filter(error => error?.CAUSA);
    if (errors.length) {
      this.alert(
        'warning',
        `Se encontrarón ${errors.length} registro(s) con error, verificar los Datos, clic en el Botón Avalúos Rechazados`,
        ''
      );
      this.$appraisedRejectedGoodsDList.next(errors);
      return;
    }
    this.alert('success', 'No se encontraron errores en su archivo', '');
  }

  // ? ------------------------- DESCUENTOS RECHAZADOS
  onRejectedDiscounts() {
    this.$showRejected.next(true);
    this.$rejectedDisscount.next(true);
  }
  onRejected() {
    this.$showRejected.next(true);
    this.$rejectedDisscount.next(false);
  }

  // ? -----------------------  APLICAR DESCUENTO
  async onApplyDisscount() {
    const body = this.getPufValEventBody('D');
    await this.pufValEvent(body);
    const { isConfirmed } = await this.alertQuestion(
      'question',
      '¿Desea Aplicar el descuento de los bienes del Avaluó?',
      ''
    );
    if (isConfirmed) {
      this.$file.next(this.applyDisscount);
      this.inputFile.nativeElement.click();
    }
  }

  applyDisscount(file: File) {
    const body = this.getPufValEventBody('D');
    this.parameterComerService.applyDisscount(body, file).subscribe();
  }

  onFileChange(event: Event) {
    if (!this.isValidFile(event)) {
      this.fileControl.reset();
      return;
    }
    const file = this.getFileFromEvent(event);
    const action = this.$file.getValue();
    action.bind(this)(file);
    this.fileControl.reset();
  }

  isValidFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files.length) {
      return false;
    }
    if (target.files.length > 1) {
      this.alert('error', 'Error', 'Solo puede seleccionar un Archivo');
      return false;
    }
    const file = target.files[0];
    const filename = file.name;
    const extension = filename.split('.').at(-1);
    if (!extension) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    if (!ALLOWED_EXTENSIONS.includes(extension.toLowerCase())) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    return true;
  }

  private getFileFromEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    const filename = file.name;
    return file;
  }
}
