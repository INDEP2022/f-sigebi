import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SIABClasificationService } from 'src/app/core/services/catalogs/siab-clasification.service';

@Component({
  selector: 'app-siab-clasification-detail',
  templateUrl: './siab-clasification-detail.component.html',
  styles: [],
})
export class SiabClasificationDetailComponent implements OnInit {
  loading: boolean = false;
  status: string = 'Nueva';
  edit: boolean = false;
  form: FormGroup;
  clasification: any;

  public get id() {
    return this.form.get('id');
  }

  @Output() refresh = new EventEmitter<true>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private siabService: SIABClasificationService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null],
      types: [null, Validators.required],
      subtypes: ['', Validators.required],
      ssubtypes: ['', Validators.required],
      sssubtypes: ['', Validators.required],
    });
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.siabService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;

    this.siabService.update(this.clasification.id, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }
}
