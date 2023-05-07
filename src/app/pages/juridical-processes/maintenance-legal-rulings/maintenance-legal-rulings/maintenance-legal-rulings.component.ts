import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IUsrRelBitacora } from 'src/app/core/models/ms-audit/usr-rel-bitacora.model';
import { ICopiesOfficialOpinion } from 'src/app/core/models/ms-dictation/copies-official-opinion.model';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IDictationXGood1 } from 'src/app/core/models/ms-dictation/dictation-x-good1.model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { IDocumentsDictumXStateM } from 'src/app/core/models/ms-documents/documents-dictum-x-state-m';
import { IJobDictumTexts } from 'src/app/core/models/ms-officemanagement/job-dictum-texts.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { CopiesOfficialOpinionService } from 'src/app/core/services/catalogs/copies-official-opinion.service';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { UsrRelLogService } from 'src/app/core/services/ms-audit/usrrel-log.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { JobDictumTextsService } from 'src/app/core/services/ms-office-management/job-dictum-texts.service';
import { BasePage } from 'src/app/core/shared/base-page';

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
  dataJobDictumTexts: IJobDictumTexts;
  dataOfficialDictation: IOfficialDictation;
  loading1: boolean = false;
  loading2: boolean = false;
  loading3: boolean = false;

  dictNumber: number | string = null;
  typeDict: string = '';

  constructor(
    private usrRelLogService: UsrRelLogService,
    private fb: FormBuilder,
    private authService: AuthService,
    private documentsDictumStatetMService: DocumentsDictumStatetMService,
    private dictationXGood1Service: DictationXGood1Service,
    private copiesOfficialOpinionService: CopiesOfficialOpinionService,
    private jobDictumTextService: JobDictumTextsService,
    private officialDictationService: OficialDictationService
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
  }

  private prepareForm() {
    this.form = this.fb.group({
      justificacion: ['', Validators.required],
    });
  }

  rulingsData(value: IDictation) {
    this.typeDict = value.typeDict;
    this.dictNumber = value.id;
    this.getDocumentsDictumStateM(value.id, value.typeDict);
    this.getCopiesOfficialOpinion(value.id, value.typeDict);
    this.getDictationXGood1(value.id, value.typeDict);
    this.getJobDictumTexts(value.id, value.typeDict);
    this.getOfficialDictation(value.id, value.typeDict);
  }

  getJobDictumTexts(dictationNumber: number | string, typeDict: string) {
    if (!dictationNumber && !typeDict) {
      return;
    }

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;

    if (dictationNumber) {
      data.addFilter('dictatesNumber', dictationNumber);
    }

    if (typeDict) {
      data.addFilter('rulingType', typeDict);
    }

    this.jobDictumTextService.getAll(data.getParams()).subscribe({
      next: data => {
        this.dataJobDictumTexts = data.data[0];
      },
      error: err => {
        this.dataJobDictumTexts = null;
      },
    });
  }

  getOfficialDictation(dictationNumber: number | string, typeDict: string) {
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

    this.officialDictationService.getAll(data.getParams()).subscribe({
      next: data => {
        this.dataOfficialDictation = data.data[0];
      },
      error: err => {
        this.dataOfficialDictation = null;
      },
    });
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
      data.addFilter('typeDictum', typeDict);
    }

    this.loading2 = true;

    this.documentsDictumStatetMService.getAll(data.getParams()).subscribe({
      next: data => {
        this.dataDocumentDictumStateM = data.data;
      },
      error: err => {
        this.dataDocumentDictumStateM = [];
        this.loading2 = false;
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
      data.addFilter('numberOfDicta', dictationNumber);
    }

    if (typeDict) {
      data.addFilter('typeDictamination', typeDict);
    }

    this.loading3 = true;

    this.copiesOfficialOpinionService.getAll(data.getParams()).subscribe({
      next: data => {
        this.dataCopiesOfficialOpinion = data.data;
      },
      error: err => {
        this.dataCopiesOfficialOpinion = [];
        this.loading3 = false;
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
      data.addFilter('ofDictNumber', dictationNumber);
    }

    if (typeDict) {
      data.addFilter('typeDict', typeDict);
    }

    this.loading1 = true;

    this.dictationXGood1Service.getAll(data.getParams()).subscribe({
      next: data => {
        this.dataDictationXGood1 = data.data;
        console.log(data.data);
      },
      error: err => {
        this.dataDictationXGood1 = [];
        this.loading1 = false;
      },
    });
  }

  moreInformationData(value: any) {
    console.log(value);
  }

  documentData(value: any) {
    console.log(value);
  }

  loadCopy(value: boolean) {
    if (value) this.getCopiesOfficialOpinion(this.dictNumber, this.typeDict);
  }

  loadGood(value: boolean) {
    if (value) this.getDictationXGood1(this.dictNumber, this.typeDict);
  }

  loadDocumentGood(value: boolean) {
    if (value) this.getDocumentsDictumStateM(this.dictNumber, this.typeDict);
  }

  send() {
    if (!this.form.get('justificacion').value.trim()) {
      this.alert('info', 'Es necesario ingresar la justificación.', '');
    }
    console.log(this.user);
    const req: IUsrRelBitacora = {
      observed: this.form.get('justificacion').value,
      observedDate: new Date(),
      // sessionId: this.user.session_state,
      detiUser: 'USER',
      sidId: this.user.sid,
      user: this.user.name,
      userrequired: 'USER',
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
