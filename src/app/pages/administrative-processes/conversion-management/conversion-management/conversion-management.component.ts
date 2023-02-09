import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IConvertiongood } from 'src/app/core/models/ms-convertiongood/convertiongood';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-conversion-management',
  templateUrl: './conversion-management.component.html',
  styles: [],
})
export class ConversionManagementComponent extends BasePage implements OnInit {
  //
  good: IGood;
  //
  saved: boolean = true;
  //
  generarPass: boolean = false;
  //
  conversion: IConvertiongood;
  //Reactive Forms
  form: FormGroup;
  // Variable para la contraseña
  password: string;

  get idConversion() {
    return this.form.get('idConversion');
  }
  get noBien() {
    return this.form.get('noBien');
  }
  get date() {
    return this.form.get('date');
  }
  get tipo() {
    return this.form.get('tipo');
  }
  get noExpediente() {
    return this.form.get('noExpediente');
  }
  get actaConversion() {
    return this.form.get('actaConversion');
  }
  get desStatus() {
    return this.form.get('desStatus');
  }
  get actaER() {
    return this.form.get('actaER');
  }
  get actaERDate() {
    return this.form.get('actaERDate');
  }
  get description() {
    return this.form.get('description');
  }
  // public get goods(){return this.form.controls['goods'] as FormArray;}

  constructor(
    private fb: FormBuilder,
    private readonly goodServices: GoodService,
    private readonly conversiongoodServices: ConvertiongoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      idConversion: [null, [Validators.required]],
      noBien: [null, [Validators.required]],
      date: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      actaConversion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      desStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      actaER: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      actaERDate: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      //goods: this.fb.array([])
    });
  }

  save() {
    this.idConversion.setValue(1245);
    this.date.setValue(new Date());
    this.saved = false;
  }

  onChangeGood() {
    this.searchGoods(this.noBien.value);
  }
  searchGoods(idGood: number | string) {
    // buscar el bien
    this.goodServices.getById(idGood).subscribe({
      next: response => {
        this.good = response;
        this.loadActER(this.good.id);
        this.loadDescriptionStatus(this.good.id);
        this.setGood(this.good);
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', 'Bien no existe');
        this.form.reset();
        console.log(err);
      },
    });
  }

  setGood(good: IGood) {
    this.noBien.setValue(good.id);
    this.noExpediente.setValue(good.fileNumber);
    this.description.setValue(good.description);
  }

  loadDescriptionStatus(idGood: number | string) {
    this.goodServices.getStatusByGood(idGood).subscribe({
      next: response => {
        this.desStatus.setValue(response.status_descripcion);
      },
      error: error => {
        this.desStatus.setValue('');
        this.onLoadToast(
          'info',
          'Opss..',
          'Este bien no tiene status asignado'
        );
        this.loading = false;
        console.log(error);
      },
    });
  }

  loadActER(idGood: number | string) {
    this.conversiongoodServices.getActsByGood(idGood).subscribe({
      next: response => {
        this.actaER.setValue(response.cve_acta);
        this.actaERDate.setValue(new Date(response.fec_elaboracion));
      },
      error: err => {
        this.actaER.setValue('');
        this.actaERDate.setValue('');
        this.onLoadToast(
          'info',
          'Opss..',
          'Este bien no tiene Acta E/R asociada'
        );
        console.log(err);
      },
    });
  }

  openDialogPW() {}

  generatePaswword() {
    this.generarPass = true;
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 1; i <= 8; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    this.password = pass;
    console.log(this.password);
  }

  searchConversion() {
    this.conversiongoodServices.getById(this.idConversion.value).subscribe({
      next: response => {
        this.conversion = response;
        this.searchGoods(this.conversion.goodFatherNumber);
        this.tipo.setValue(this.conversion.typeConv);
        this.date.setValue(new Date());
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', 'Conversion no existe');
        this.form.reset();
        console.log(err);
      },
    });
  }
  /*   showToast(status: NbComponentStatus) {
    this.toastrService.show(status, 'Guardado exitoso !!', { status });
  } */
}
