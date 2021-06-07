import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatExpansionModule,
    NgxJsonViewerModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  exports: [
    MatToolbarModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatExpansionModule,
    NgxJsonViewerModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ]
})
export class SharedModule { }
