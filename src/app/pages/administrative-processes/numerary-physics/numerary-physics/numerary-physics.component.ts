import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DelegationService } from '../../../../core/services/catalogs/delegation.service';

@Component({
  selector: 'app-numerary-physics',
  templateUrl: './numerary-physics.component.html',
  styles: [],
})
export class NumeraryPhysicsComponent implements OnInit {
  public physicsForm: FormGroup;

  public delegations = new DefaultSelect();

  public get startedDate(): AbstractControl {
    return this.physicsForm.get('startedDate');
  }
  public get finishedDate(): AbstractControl {
    return this.physicsForm.get('finishedDate');
  }
  public get getDelegation(): AbstractControl {
    return this.physicsForm.get('delegation');
  }
  public get type(): AbstractControl {
    return this.physicsForm.get('type');
  }

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  public buildForm(): void {
    this.physicsForm = this.fb.group({
      delegation: ['', Validators.required],
      startedDate: ['', Validators.required],
      finishedDate: ['', Validators.required],
      type: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  public send(): void {
    console.log(this.physicsForm.value);
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      this.delegations = new DefaultSelect(data.data, data.count);
    });
  }
}
