import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SimplebarAngularModule } from 'simplebar-angular';

import { FullComponent } from './full.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TitleComponent } from './title.component';
import { TopbarComponent } from './topbar/topbar.component';

@NgModule({
  declarations: [
    FullComponent,
    SidebarComponent,
    TopbarComponent,
    TitleComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SimplebarAngularModule,
    BsDropdownModule,
    RouterModule,
  ],
  exports: [FullComponent],
})
export class FullModule {}
