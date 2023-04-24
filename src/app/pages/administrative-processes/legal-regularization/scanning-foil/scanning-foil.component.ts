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
  @Input() good: IGood;
  @Output() documentEmmit = new EventEmitter<IDocuments>();
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
      numberProceedings: this.good.fileNumber,
      keySeparator: 60,
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: 'REGULARIZACION JURIDICA',
      significantDate: this.significantDate(),
      scanStatus: 'SOLICITADO',
      userRequestsScan: this.user.usuario.user,
      scanRequestDate: new Date(),
      associateUniversalFolio: null,
      flyerNumber: this.good.flyerNumber,
      goodNumber: this.good.id,
      numberDelegationRequested: this.user.usuario.delegationNumber,
      numberDepartmentRequest: this.user.usuario.departamentNumber,
      numberSubdelegationRequests: this.user.usuario.subdelegationNumber,
    };
    console.log(documents);
    this.documnetServices.create(documents).subscribe({
      next: response => {
        console.log(response);
        this.scanningFoli.setValue(response.id);
        this.documentEmmit.emit(response);
        this.onLoadToast(
          'success',
          'Generado correctamente',
          `Se generó el Folio No ${response.id}`
        );
        this.generateFo = false;
        this.generate();
      },
      error: err => {
        console.log(err);
        this.onLoadToast('error', 'ERROR', err.error.message);
      },
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
  validFoli() {
    console.log('Entro');
    if (this.good !== undefined) {
      this.documnetServices.getByGood(this.good.id).subscribe({
        next: response => {
          if (response.count === 0) return;
          console.log(response);
          this.document = response.data[0];
          this.scanningFoli.setValue(this.document.id);
          this.documentEmmit.emit(this.document);
        },
      });
    }
  }
}
