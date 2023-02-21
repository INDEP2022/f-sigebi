import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-scanning-foil',
  templateUrl: './scanning-foil.component.html',
  styles: [``],
})
export class ScanningFoilComponent extends BasePage implements OnInit {
  //Reactive Forms
  form: FormGroup;

  @Input() numberFoli: string | number = '';
  @Input() good: IGood;
  @Output() folioUniversal = new EventEmitter<string | number>();
  get scanningFoli() {
    return this.form.get('scanningFoli');
  }
  constructor(
    private fb: FormBuilder,
    private readonly documnetServices: DocumentsService,
    private token: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.scanningFoli.setValue(this.numberFoli);
    this.form.disable();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      scanningFoli: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  generateFoli() {
    console.log(this.scanningFoli.value != '', this.scanningFoli.value);

    if (this.scanningFoli.value != '') {
      this.onLoadToast(
        'error',
        'ERROR',
        'El número de bien para este proceso ya tiene folio de escaneo.'
      );
      return;
    }
    if (this.good === undefined) {
      this.onLoadToast('error', 'ERROR', 'Debe cargar un bien');
      return;
    }
    const documents: IDocuments = {
      id: '',
      numberProceedings: this.good.fileNumber,
      keySeparator: 60,
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: 'REGULARIZACION JURIDICA',
      significantDate: new Date(),
      scanStatus: 'SOLICITADO',
      userRequestsScan: this.token.decodeToken().preferred_username,
      scanRequestDate: new Date(),
      associateUniversalFolio: null,
      flyerNumber: this.good.flyerNumber,
      goodNumber: this.good.id,
    };
    this.documnetServices.create(documents).subscribe({
      next: response => {
        console.log(response);
        this.scanningFoli.setValue(response.id);
        this.folioUniversal.emit(response.id);
        this.onLoadToast(
          'success',
          'Generado correctamente',
          `Se genero el Folio No ${response.id}`
        );
      },
      error: err => {
        console.log(err);
        this.onLoadToast('error', 'ERROR', err.error.message);
      },
    });
  }
}
