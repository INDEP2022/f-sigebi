/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IUsrRelBitacora } from 'src/app/core/models/ms-audit/usr-rel-bitacora.model';
import { ICopiesOfficialOpinion } from 'src/app/core/models/ms-dictation/copies-official-opinion.model';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IDictationXGood1 } from 'src/app/core/models/ms-dictation/dictation-x-good1.model';
import { IDocumentsDictumXStateM } from 'src/app/core/models/ms-documents/documents-dictum-x-state-m';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { CopiesOfficialOpinionService } from 'src/app/core/services/catalogs/copies-official-opinion.service';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { UsrRelLogService } from 'src/app/core/services/ms-audit/usrrel-log.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-maintenance-legal-rulings',
  templateUrl: './maintenance-legal-rulings.component.html',
  styleUrls: ['./maintenance-legal-rulings.component.scss'],
})
export class MaintenanceLegalRulingComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public form: FormGroup;
  user: TokenInfoModel;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  dataDocumentDictumStateM: IDocumentsDictumXStateM[] = [];
  dataDictationXGood1: IDictationXGood1[] = [];
  dataCopiesOfficialOpinion: ICopiesOfficialOpinion[] = [];

  loading1: boolean = false;
  loading2: boolean = false;
  loading3: boolean = false;

  constructor(
    private usrRelLogService: UsrRelLogService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    private documentsDictumStatetMService: DocumentsDictumStatetMService,
    private dictationXGood1Service: DictationXGood1Service,
    private copiesOfficialOpinionService: CopiesOfficialOpinionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getUser();
    this.loading = true;
  }

  getUser() {
    this.user = this.authService.decodeToken();

    console.log(this.user);
  }

  private prepareForm() {
    this.form = this.fb.group({
      justificacion: ['', Validators.required],
    });
  }

  rulingsData(value: IDictation) {
    console.log(value);
    this.getDocumentsDictumStateM(value.id, value.typeDict);
    this.getCopiesOfficialOpinion(value.id, value.typeDict);
    this.getDictationXGood1(value.id, value.typeDict);
  }

  getDocumentsDictumStateM(dictationNumber: number | string, typeDict: string) {
    if (!dictationNumber && !typeDict) {
      return;
    }

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;

    if (dictationNumber) {
      data.addFilter('officialNumber', dictationNumber);
    }

    if (typeDict) {
      data.addFilter('typeDict', typeDict);
    }

    this.loading2 = true;

    this.documentsDictumStatetMService.getAll(data.getParams()).subscribe({
      next: data => {
        this.dataDocumentDictumStateM = data.data;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  getCopiesOfficialOpinion(dictationNumber: number | string, typeDict: string) {
    if (!dictationNumber && !typeDict) {
      return;
    }

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;

    if (dictationNumber) {
      data.addFilter('officialNumber', dictationNumber);
    }

    if (typeDict) {
      data.addFilter('typeDict', typeDict);
    }

    this.loading3 = true;

    this.copiesOfficialOpinionService.getAll(data.getParams()).subscribe({
      next: data => {
        this.dataCopiesOfficialOpinion = data.data;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  getDictationXGood1(dictationNumber: number | string, typeDict: string) {
    if (!dictationNumber && !typeDict) {
      return;
    }

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;

    if (dictationNumber) {
      data.addFilter('officialNumber', dictationNumber);
    }

    if (typeDict) {
      data.addFilter('typeDict', typeDict);
    }

    this.loading1 = true;

    console.log(data.getParams());

    this.dictationXGood1Service.getAll(data.getParams()).subscribe({
      next: data => {
        console.log(data);
        this.dataDictationXGood1 = data.data;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  moreInformationData(value: any) {
    console.log(value);
  }

  documentData(value: any) {
    console.log(value);
  }

  send() {
    if (!this.form.get('justificacion').value.trim()) {
      this.alert('info', 'Es necesario ingresar la justificación.', '');
    }

    const req: IUsrRelBitacora = {
      observed: this.form.get('justificacion').value,
      observedDate: new Date(),
      detiUser: '',
      sessionId: null,
      sidId: this.user.sid,
      user: this.user.name,
      userrequired: '',
    };

    this.usrRelLogService.create(req).subscribe({
      next: data => {
        this.alert('success', 'Se ha creado la bitácora correctamente.', '');
      },
      error: err => {
        this.loading = false;
      },
    });
  }
}
