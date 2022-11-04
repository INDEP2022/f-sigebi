import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { maxDate, minDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
@Component({
  selector: 'app-documentation-complementary-register-form',
  templateUrl: './documentation-complementary-register-form.component.html',
  styles: [],
})
export class DocumentationComplementaryRegisterFormComponent
  extends BasePage
  implements OnInit
{
  documentationRegisterForm: FormGroup = new FormGroup({});
  documentationSearchExpedientForm: FormGroup = new FormGroup({});
  documentationEstateForm: FormGroup = new FormGroup({});
  documentationExpedientForm: FormGroup = new FormGroup({});
  documentExpedientForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.prepareDocRegForm();
    this.prepareDocExpedForm();
    this.prepareDocEstateForm();
    this.prepareDocExpedientForm();
    this.prepareDocumentForm();
  }

  prepareDocRegForm() {
    this.documentationRegisterForm = this.fb.group({
      typeExpedient: [null],
      priority: [null],
      receptionDate: [
        null,
        [Validators.required, minDate(new Date()), maxDate(new Date())],
      ],
      expedientTransferentPAMA: [null],
      senderName: [null],
      senderCharge: [null],
      senderPhone: [null],
      senderEmail: [null],
      indicatedTaxpayer: [null, [Validators.required]],
      provenanceInformation: [null],
      officeNumber: [null, [Validators.required]],
      officeDate: [null, [Validators.required]],
      observations: [null],
    });
  }

  prepareDocExpedForm() {
    this.documentationSearchExpedientForm = this.fb.group({
      requestNumber: [null],
      authority: [null],
      typeTransference: [null],
      expedientNumber: [null],
      indicated: [null],
      domainExtinction: [null],
      regionalDelegation: [null],
      transferFile: [null],
      judgmentType: [null],
      state: [null],
      judment: [null],
      inquiryPreliminary: [null],
      transferent: [null],
      casePenal: [null],
      station: [null],
      protectionNumber: [null],
    });
  }

  prepareDocEstateForm() {
    this.documentationEstateForm = this.fb.group({
      gestionNumber: [null],
      uniqueKey: [null],
      description: [null],
      numberExpedient: [null],
      expedientTransferent: [null],
      regionalDelegation: [null],
      state: [null],
      broadStation: [null],
      authority: [null],
      goodType: [null],
      warehouseCode: [null],
      origin: [null],
      folioRecord: [null],
    });
  }

  prepareDocExpedientForm() {
    this.documentationExpedientForm = this.fb.group({
      text: [null],
      typeDocument: [null],
      titleDocument: [null],
      noSiab: [null],
      responsible: [null],
      author: [null],
      typeTransference: [null],
      taxpayer: [null],
      noGestion: [5645655],
      senderCharge: [null],
      comments: [null],
    });
  }

  prepareDocumentForm() {
    this.documentExpedientForm = this.fb.group({
      text: [null],
      typeDocument: [null],
      titleDocument: [null],
      noSiab: [null],
      responsible: [null],
      author: [null],
      typeTransference: [null],
      taxpayer: [null],
      noGestion: [5645655],
      senderCharge: [null],
      comments: [null],
    });
  }
}
