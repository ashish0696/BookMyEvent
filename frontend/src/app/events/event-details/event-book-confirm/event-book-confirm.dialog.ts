import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-book-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './event-book-confirm.html',
  styleUrls: ['./event-book-confirm.css']
})
export class EventBookConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<EventBookConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { seatsList: string; eventTitle?: string }
  ) {}

  confirm() { this.dialogRef.close(true); }
  cancel() { this.dialogRef.close(false); }
}
