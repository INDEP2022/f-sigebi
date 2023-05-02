import {
  Directive,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermissionsService } from 'src/app/common/services/permissions.service';

@Directive({
  selector: '[onlyPermission]',
})
export class PermissionsDirective implements OnInit, OnChanges {
  @Input() onlyPermission: string = '';
  constructor(
    private route: ActivatedRoute,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    this.viewContainer.clear();
    const screenId = this.getScreenId();
    const permission = this.onlyPermission?.toLowerCase();
    if (this.permissionsService.hasPermissionOnScreen(permission, screenId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {}

  getScreenId() {
    return !!this.route && this.route.snapshot.data
      ? this.route.snapshot.data['screen']
      : '';
  }
}
