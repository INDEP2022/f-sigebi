import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
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
  user: ISegUsers;
  document: IDocuments;
  params = new BehaviorSubject<ListParams>(new ListParams());
  generateFo: boolean = true;
  @Input() numberFoli: string | number = '';
  @Input() goods: IGood[] = [];
  @Output() documentEmmit = new EventEmitter<IDocuments>();
  @Output() firstGood = new EventEmitter<IGood>();
  get scanningFoli() {
    return this.form.get('scanningFoli');
  }
  constructor(
    private fb: FormBuilder,
    private readonly documnetServices: DocumentsService,
    private token: AuthService,
    private readonly userServices: UsersService,
    private readonly goodServices: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.scanningFoli.setValue(this.numberFoli);
    this.form.disable();
    this.getDataUser();
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
    this.goods.forEach((good, index) => {
      if (index !== 0) {
        const documents: IDocuments = {
          numberProceedings: good.fileNumber,
          keySeparator: 60,
          keyTypeDocument: 'ENTRE',
          natureDocument: 'ORIGINAL',
          descriptionDocument: 'PROCESO DE RECLAMACIÓN DE PAGO',
          significantDate: this.significantDate(),
          scanStatus: 'ESCANEADO',
          userRequestsScan: this.user.usuario.user,
          scanRequestDate: new Date(),
          associateUniversalFolio: this.document.id,
          flyerNumber: good.flyerNumber,
          goodNumber: good.id,
          numberDelegationRequested: this.user.usuario.delegationNumber,
          numberDepartmentRequest: this.user.usuario.departamentNumber,
          numberSubdelegationRequests: this.user.usuario.subdelegationNumber,
        };
        this.documnetServices.create(documents).subscribe({
          next: response => {
            console.log(response);
          },
          error: err => {
            console.log(err);
            this.onLoadToast('error', 'ERROR', err.error.message);
          },
        });
      }
    });
  }
  significantDate() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return month < 10 ? `0${month}/${year}` : `${month}/${year}`;
  }

  generate() {
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
  }
  getDataUser() {
    const params: ListParams = {
      'filter.id': this.token.decodeToken().preferred_username,
    };
    console.log(params);

    this.userServices.getAllSegUsers(params).subscribe({
      next: response => {
        console.log(response);
        this.user = response.data[0];
      },
      error: err => {
        console.log(err);
      },
    });
  }

  question() {
    if (this.scanningFoli.value !== '') {
      this.onLoadToast(
        'error',
        'ERROR',
        'El folio de escaneo ya ha sido generado.'
      );
      return;
    }
    if (this.goods.length === 0) {
      this.onLoadToast('error', 'ERROR', 'Debe cargar al menos un Bien');
      return;
    }
    this.alertQuestion(
      'info',
      'Confirmación',
      '¿Se generara un folio de escaneo para los bienes,¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.document1(this.goods[0]);
      }
    });
  }
  document1(good: IGood) {
    this.firstGood.emit(good);
    const documents: IDocuments = {
      numberProceedings: good.fileNumber,
      keySeparator: 60,
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: 'PROCESO DE RECLAMACIÓN DE PAGO',
      significantDate: this.significantDate(),
      scanStatus: 'SOLICITADO',
      userRequestsScan: this.user.usuario.user,
      scanRequestDate: new Date(),
      associateUniversalFolio: null,
      flyerNumber: good.flyerNumber,
      goodNumber: good.id,
      numberDelegationRequested: this.user.usuario.delegationNumber,
      numberDepartmentRequest: this.user.usuario.departamentNumber,
      numberSubdelegationRequests: this.user.usuario.subdelegationNumber,
    };
    this.documnetServices.create(documents).subscribe({
      next: response => {
        console.log(response);
        this.scanningFoli.setValue(response.id);
        this.documentEmmit.emit(response);
        this.document = response;
        this.onLoadToast(
          'success',
          'Generado correctamente',
          `Se generó el Folio No ${response.id}`
        );
        this.generateFo = false;
        this.generate();
        this.generateFoli();
      },
      error: err => {
        console.log(err);
        this.onLoadToast('error', 'ERROR', err.error.message);
      },
    });
  }
}
