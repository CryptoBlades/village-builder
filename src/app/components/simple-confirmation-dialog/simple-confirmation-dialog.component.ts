import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

interface DialogData {
  dialogs: {
    title: string;
    content: string;
  }[];
}

@Component({
  selector: 'app-simple-confirmation-dialog',
  templateUrl: './simple-confirmation-dialog.component.html',
  styleUrls: ['./simple-confirmation-dialog.component.scss']
})
export class SimpleConfirmationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SimpleConfirmationDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm() {
    if (this.data.dialogs.length > 1) {
      const dialogRef = this.dialog.open(SimpleConfirmationDialogComponent, {
        data: {dialogs: this.data.dialogs.slice(1)}
      });
      dialogRef.afterClosed().subscribe(confirmed => {
        this.dialogRef.close(confirmed);
        this.data.dialogs.pop();
      });
    } else {
      this.dialogRef.close(true);
    }
  }
}
