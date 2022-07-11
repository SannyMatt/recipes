import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './dropdown-directive';
import { PlaceHolderDirective } from './placeholder/placeholder.directive';

@NgModule({
  declarations: [DropdownDirective, AlertComponent, PlaceHolderDirective],
  imports: [CommonModule, FormsModule],
  exports: [
    FormsModule,
    CommonModule,
    DropdownDirective,
    AlertComponent,
    PlaceHolderDirective,
  ],
})
export class SharedModule {}
