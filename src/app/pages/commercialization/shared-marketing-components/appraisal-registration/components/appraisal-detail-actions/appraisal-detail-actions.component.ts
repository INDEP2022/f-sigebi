import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
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
  get controls() {
    return this.comerEventForm.controls;
  }
  constructor(private parameterComerService: ParameterModService) {
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

  // ? -----------------------  APLICAR DESCUENTO
  async onApplyDisscount() {
    const body = this.getPufValEventBody('D');
    const invalidStatus = await this.pufValEvent(body);
    if (invalidStatus) {
      this.onLoadToast('warning', invalidStatus, '');
      return;
    }
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
