
import {Component} from "@angular/core";
import {MdDialogRef} from "@angular/material";
@Component({
  selector:'confirm',
  template: `
  <div>
    <h2>בטוח שרוצה למחוק?</h2>
    <button MdDialogClose (click)="approve()" >כן</button>
    <button MdDialogClose (click)="cancel()" >לא</button>
  </div>
  `
})
  export class ConfirmationCmp{
  private result: boolean;

  constructor(private dialogRef: MdDialogRef<ConfirmationCmp>){

  }
  approve(){
    this.result = true;
    this.dialogRef.close(true);
  }
  cancel(){
    this.result = false;
    this.dialogRef.close(false);
  }
}
