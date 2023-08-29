import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAssetConversion } from 'src/app/core/models/ms-convertiongood/asset-conversion';
import { IConvertiongood } from 'src/app/core/models/ms-convertiongood/convertiongood';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-conversion-management',
  templateUrl: './conversion-management.component.html',
  styleUrls: ['./conversion-management.component.scss'],
})
export class ConversionManagementComponent extends BasePage implements OnInit {
  DATA: any[] = [
    {
      label: 'Derivado',
      value: '1',
    },
    {
      label: 'Conversión',
      value: '2',
    },
  ];
  //
  good: IGood;
  //
  saved: boolean = true;
  //
  enableButton: boolean = true;
  //
  generarPass: boolean = false;
  //
  conversion: IConvertiongood;
  //
  assetConversion: IAssetConversion;
  //Reactive Forms
  form: FormGroup;
  // Variable para la contraseña
  password: string;

  isFormModified = false;

  enable: boolean = false;
  view: boolean = false;
  dataSelect = new DefaultSelect<any>();

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
    this.dataSelect = new DefaultSelect(this.DATA, this.DATA.length);
    this.buildForm();
    this.description.disable();
    this.actaERDate.disable();
    this.actaER.disable();
    this.desStatus.disable();
    this.actaConversion.disable();
    this.idConversion.disable();
    this.date.disable();
    this.noExpediente.disable();
    /* this.form.valueChanges.subscribe(() => {
      if (this.conversion !== undefined) {
        this.isFormModified = true;
        console.log('******* Entro *******');
      }
    }); */
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      idConversion: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      noBien: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      date: [null],
      tipo: [null, [Validators.required]],
      noExpediente: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      actaConversion: [null, [Validators.pattern(STRING_PATTERN)]],
      desStatus: [null, [Validators.pattern(STRING_PATTERN)]],
      actaER: [null, [Validators.pattern(STRING_PATTERN)]],
      actaERDate: [null, [Validators.pattern(STRING_PATTERN)]],
      description: [null],
      //goods: this.fb.array([])
    });
  }

  async save() {
    console.log(this.idConversion.value);
    // if (this.idConversion.value !== null) {
    // const response: any = await this.updateConversion('');
    // this.date.setValue(new Date());
    this.createObj();
    console.log(this.assetConversion);
    this.conversiongoodServices
      .createAssetConversions(this.assetConversion)
      .subscribe({
        next: response => {
          console.log(response);
          // this.alert(
          //   'success',
          //   'Administración de Conversión de Bienes',
          //   'Se ha Guardado Correctamente la Conversión'
          // );
          this.alert(
            'success',
            `Id Conversión: ${this.conversion.id} , Password: ${this.password}`,
            'Se ha generado y aplicado la contraseña a la conversión'
          );
          this.loader.load = false;
          this.saved = true;
        },
        error: err => {
          this.loader.load = false;
          this.saved = false;
          // this.alert(
          //   'warning',
          //   'Administración de Conversión de Bienes',
          //   'No se puede realizar la operación ya que este bien ya está asignado a esta conversión'
          // );

          console.log(err);
        },
      });
    // } else {
    //   this.alert(
    //     'warning',
    //     'Administración de Conversión de Bienes',
    //     'Se debe Cargar Primero una Conversión'
    //   );
    // }
  }

  onChangeGood() {
    if (this.noBien.value !== null) {
      this.searchGoods(this.noBien.value);
    } else {
      this.alert('warning', 'Se debe Ingresar el Numero del Bien', '');
    }
  }

  searchGoods(idGood: number | string) {
    // buscar el bien
    console.log(idGood);
    this.goodServices.getById(idGood).subscribe({
      next: (response: any) => {
        this.form.get('tipo').markAsTouched();
        console.log(response.data[0]);
        this.good = response.data[0];
        this.loadActER(this.good.id);
        this.loadDescriptionStatus(this.good.id);
        this.setGood(this.good);
        this.getConversion(this.good.id);
      },
      error: err => {
        this.alert('warning', 'No existe el No. Bien', '');
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
        console.log(response);
        this.desStatus.setValue(response.status_descripcion);
        this.enable = true;
      },
      error: error => {
        console.log(error);
        this.desStatus.setValue('');
        this.loading = false;
        this.enable = true;
      },
    });
  }

  loadActER(idGood: number | string) {
    this.conversiongoodServices.getActsByGood(idGood).subscribe({
      next: response => {
        this.actaER.setValue(response.cve_acta);
        console.log(response);
        console.log(this.formatDate(response.fec_elaboracion));
        this.actaERDate.setValue(
          response.fec_elaboracion === undefined
            ? null
            : this.formatDate(response.fec_elaboracion)
        );
      },
      error: err => {
        this.actaER.setValue('');
        this.actaERDate.setValue('');
        this.alert(
          'warning',
          'Administración de Conversión de Bienes',
          'Este Bien no tiene Acta E/R Asociada'
        );
        console.log(err);
      },
    });
  }
  getConversion(idGood: number | string) {
    const params = new ListParams();
    params['filter.goodFatherNumber'] = `$eq:${idGood}`;
    console.log(idGood);
    this.conversiongoodServices.getAllGoods(params).subscribe({
      next: response => {
        console.log(response);
        this.conversion = response.data[0];
        console.log(this.conversion);
        this.idConversion.setValue(Number(response.data[0].id));
        this.view = true;
        if (response.data[0].fCreate != null) {
          this.date.setValue(this.formatDate(response.data[0].fCreate));
        }
        this.tipo.setValue(response.data[0].typeConv);
        this.actaConversion.setValue(response.data[0].cveActaConv);
        this.saved = true;
      },
      error: error => {
        this.loading = false;
        this.saved = false;
      },
    });
  }
  // this.alert(
  //   'warning',
  //   'Administración de Conversión de Bienes',
  //   'No se puede realizar la operación ya que este bien ya está asignado a esta conversión'
  // );
  async generatePaswword() {
    if (this.tipo.value === null) {
      this.alert('warning', 'Atención', 'El Campo Tipo es Requerido');
      return;
    }

    this.generarPass = true;
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 1; i <= 8; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    this.password = pass;
    console.log(this.password);
    const id: any = await this.seqConvesions();
    console.log(id);
    const response: any = await this.updateConversion(this.password, true, id);
    console.log(response);
    this.idConversion.setValue(id);
    if (response) {
      this.saved = true;
      this.isFormModified = false;
      this.conversion = response;
      this.save();
      if (response.fCreate != null) {
        this.date.setValue(this.formatDate(response.fCreate));
      }
    } else {
      this.loader.load = false;
      this.alert(
        'error',
        'Ha Ocurrido un Error',
        'Erorr al Generar la Contraseña'
      );
    }
  }

  searchConversion() {
    this.enable = false;
    console.log(this.idConversion.value);
    if (this.idConversion.value === '' || this.idConversion.value === null) {
      this.alert(
        'warning',
        'Campo Requerido',
        'Ingrese por favor un Id de Conversión'
      );
      //this.form.markAllAsTouched();
      return;
    }
    this.conversiongoodServices.getById(this.idConversion.value).subscribe({
      next: response => {
        console.log('AQUIIIIIII', response);
        this.conversion = response;
        if (this.conversion.goodFatherNumber) {
          this.searchGoods(this.conversion.goodFatherNumber);
        }
        this.tipo.setValue(this.conversion.typeConv);
        this.date.setValue(new Date());
        this.enableButton = false;
        this.actaConversion.setValue(this.conversion.cveActaConv);
        this.alert(
          'success',
          'Administración de Conversión de Bienes',
          'Se ha cargado la Conversión Correctamente'
        );
      },
      error: err => {
        this.alert('error', 'Ha Ocurrido un Error', 'La Conversión no Existe');
        this.form.reset();
        console.log(err);
      },
    });
  }
  updateConversion(pwAccess: string, isPwAccess: boolean = false, id: string) {
    return new Promise((res, rej) => {
      console.log(id);
      this.conversion = {};
      this.conversion.id = Number(id);
      this.conversion.fileNumber = Number(this.good.fileNumber);
      this.conversion.goodFatherNumber = Number(this.good.id);
      this.conversion.statusConv = 1;
      this.conversion.typeConv = Number(this.tipo.value);
      if (isPwAccess) {
        this.conversion.pwAccess = pwAccess;
      }
      console.log('AQUIIII', this.conversion);

      this.conversiongoodServices
        .createConvertionGood(this.conversion)
        .subscribe({
          next: response => {
            res(response);
            console.log(response);
          },
          error: err => {
            console.log(err);
            this.loader.load = false;
            res(err.error);
          },
        });
    });
  }
  seqConvesions() {
    return new Promise((res, rej) => {
      this.loader.load = true;
      this.conversiongoodServices.getSeqConversions().subscribe({
        next: response => {
          res(response.data[0].seqVal);
        },
        error: err => {
          console.log(err);
          this.loader.load = false;
          res(err.error);
        },
      });
    });
  }
  createObj() {
    console.log(this.conversion);
    this.assetConversion = {
      goodId: Number(this.good.id),
      conversionId: Number(this.conversion.id),
      description: this.good.description,
      amount: Number(this.good.quantity),
      status: this.good.status,
      val1: this.good.val1,
      val2: this.good.val2,
      val3: this.good.val3,
      val4: this.good.val4,
      val5: this.good.val5,
      val6: this.good.val6,
      val7: this.good.val7,
      val8: this.good.val8,
      val9: this.good.val9,
      val10: this.good.val10,
      val11: this.good.val11,
      val12: this.good.val12,
      val13: this.good.val13,
      val14: this.good.val14,
      val15: this.good.val15,
      val16: this.good.val16,
      val17: this.good.val17,
      val18: this.good.val18,
      val19: this.good.val19,
      val20: this.good.val20,
      val21: this.good.val21,
      val22: this.good.val22,
      val23: this.good.val23,
      val24: this.good.val24,
      val25: this.good.val25,
      val26: this.good.val26,
      val27: this.good.val27,
      val28: this.good.val28,
      val29: this.good.val29,
      val30: this.good.val30,
      val31: this.good.val31,
      val32: this.good.val32,
      val33: this.good.val33,
      val34: this.good.val34,
      val35: this.good.val35,
      val36: this.good.val36,
      val37: this.good.val37,
      val38: this.good.val38,
      val39: this.good.val39,
      val40: this.good.val40,
      val41: this.good.val41,
      val42: this.good.val42,
      val43: this.good.val43,
      val44: this.good.val44,
      val45: this.good.val45,
      val46: this.good.val46,
      val47: this.good.val47,
      val48: this.good.val48,
      val49: this.good.val49,
      val50: this.good.val50,
      appraisedValue: Number(this.good.appraisedValue),
      noClassifGood: Number(this.good.goodClassNumber),
      noLabel: Number(this.good.labelNumber),
      unit: this.good.unit,
      noRegistration: null,
      descriptionConv: null,
      amountConv: null,
      noClasifGoodConv: null,
      unitConv: null,
      noLabelConv: null,
    };
  }
  /*   showToast(status: NbComponentStatus) {
    this.toastrService.show(status, 'Guardado exitoso !!', { status });
  } */

  clean() {
    this.form.reset();
    this.saved = true;
    this.view = false;
    // this.form.markAllAsTouched();
  }
  formatDate(fecha: string) {
    const fecha_original = new Date(fecha);
    // Obtener los componentes de fecha (día, mes, año)
    const dia = fecha_original.getUTCDate();
    const mes = (fecha_original.getUTCMonth() + 1).toString().padStart(2, '0'); // Añade cero inicial si es necesario
    const año = fecha_original.getUTCFullYear();
    // Formatear la fecha en el nuevo formato DD/MM/YYYY
    const nuevo_formato = `${dia}/${mes}/${año}`;
    return nuevo_formato;
  }
  detectarCambios() {
    if (this.enable) {
      this.isFormModified = true;
    }
  }
  passwordId() {
    this.alert(
      'success',
      `Id Conversión: ${this.conversion.id} , Password: ${this.conversion.pwAccess}`,
      ''
    );
  }
}
