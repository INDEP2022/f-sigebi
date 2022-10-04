import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SimplebarAngularModule } from 'simplebar-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { FullComponent } from './full.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { TitleComponent } from './title.component';

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
