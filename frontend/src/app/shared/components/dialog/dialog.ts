import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Dialog
@Component({
  standalone: true,
  selector: 'app-dialog',
  templateUrl: 'dialog.html',
  imports: [MatDialogModule, MatButtonModule],
})
export class Dialog  {
  public data: { title: string, content: string } = inject(MAT_DIALOG_DATA);
}
