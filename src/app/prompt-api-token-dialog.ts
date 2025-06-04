import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

export interface TokenData {
  token: string;
}

/**
 * @title Dialog Animations
 */
@Component({
  selector: 'prompt-api-token',
  templateUrl: './prompt-api-token-dialog.html',
    imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptApiTokenDialog {
  readonly dialogRef = inject(MatDialogRef<PromptApiTokenDialog>);
  readonly data = inject<TokenData>(MAT_DIALOG_DATA);
  readonly token = model(this.data.token);
}