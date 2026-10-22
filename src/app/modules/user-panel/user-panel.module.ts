import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPanelRoutingModule } from './user-panel-routing.module';
import { PanelComponent } from './components/panel/panel.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { RegionsComponent } from './components/regions/regions.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [PanelComponent, BottomNavComponent, ToolbarComponent, RegionsComponent],
  imports: [
    CommonModule,
    UserPanelRoutingModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserPanelModule {}
