import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.scss'],
})
export class NewDocumentComponent extends BasePage implements OnInit {
  title: string = 'Información General';
  newDocForm: ModelForm<IRequest>;
  selectTypeDoc = new DefaultSelect<IRequest>();
  request: any;
  idrequest: number = 0;
  typeDoc: string = '';
  selectedFile: File;
  toggleSearch: boolean = true;
  regDelName: string = '';
  stateName: string = '';
  nameTransferent: string = '';
  paramsDocTypes = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    public fb: FormBuilder,
    public modalRef: BsModalRef,
    private requestService: RequestService,
    private regionalDelService: RegionalDelegationService,
    private stateOfrepublic: StateOfRepublicService,
    private transferentService: TransferenteService,
    private wContentService: WContentService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeDoc);
    console.log('ss', this.idrequest);
    this.initForm();
    this.getInfoRequest();
    this.typedocuments();
    //console.log('NEW DOC TIPO');
    //console.log(this.typeDoc);
  }

  initForm(): void {
    this.newDocForm = this.fb.group({
      id: [null],
      docType: [null],
      docFile: [null],
      docTit: [null, [Validators.pattern(STRING_PATTERN)]],
      noExpedient: [null],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      regDelega: [],
      noOfi: [null],
      state: [],
      tranfe: [],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.newDocForm.addControl(
      'returnOpinionFolio',
      new FormControl('', [Validators.required])
    );
  }

  getInfoRequest() {
    this.requestService.getById(this.idrequest).subscribe(data => {
      console.log('data', data);
      this.request = data;
      this.getRegionalDelegation(data.regionalDelegationId);
      this.getstate(data.keyStateOfRepublic);
      this.getTransferent(data.transferenceId);
    });
  }

  typedocuments() {
    this.wContentService
      .getDocumentTypes(this.paramsDocTypes.getValue())
      .subscribe(data => {
        console.log('data', data);
        this.selectTypeDoc = new DefaultSelect(data.data, data.count);
      });
  }

  getRegionalDelegation(id: number) {
    this.regionalDelService.getById(id).subscribe(data => {
      this.regDelName = data.description;
    });
  }

  getstate(id: number) {
    console.log('estado', id);
    this.stateOfrepublic.getById(id).subscribe(data => {
      this.stateName = data.descCondition;
    });
  }

  getTransferent(id: number) {
    this.transferentService.getById(id).subscribe(data => {
      this.nameTransferent = data.nameTransferent;
    });
  }

  getTypeDoc(event: any) {}

  confirm() {
    console.log(this.newDocForm.value);
  }

  selectFile(event: any) {
    this.selectedFile = event.target.files;
  }

  close() {
    this.modalRef.hide();
  }
}
