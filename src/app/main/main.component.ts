import {Component, ChangeDetectorRef, NgZone} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {FirebaseService} from "../services/firebase.service";
import {Router} from "@angular/router";
import set = Reflect.set;

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  title = 'Kindergarden Anafa';
  kids: any[] = [];
  kindergardens: any = [];
  editMode: boolean;

  constructor(private firebase: FirebaseService, private router: Router, private zone: NgZone) {
  }

  public settings(){
    this.router.navigateByUrl('settings');
  }


  public save(kindergarden: any) {
    this.fixUndefinedFields(kindergarden);
    kindergarden.editMode = false;
    if(kindergarden.$key){
      this.firebase.updateKindergarden(kindergarden);
    }
    else {
      this.firebase.addKindergarden(kindergarden);
    }
  }

  private fixUndefinedFields(kindergarden: any) {
    if (kindergarden.simSerialNumber === undefined)
      kindergarden.simSerialNumber = '';
    if (kindergarden.phone === undefined)
      kindergarden.phone = '';
  }

  public edit(item: any, event: any) {
    event.stopPropagation();
    item.editMode = true;
  }

  public delete(item: any, event: any) {
    event.stopPropagation();
    this.firebase.kindergardenObservable.remove(item);
  }

  ngOnInit() {

    this.firebase.completed.subscribe((c) => {
      if (c) {
        this.zone.run(() => {
          this.kindergardens = this.firebase.kindergardens;
        });
      }
    });
  }

  public add() {
    this.kindergardens.push({name: 'new',editMode:true,phone:'',simSerialNumber:''});
  }

  public getKindergardens() {
    this.kindergardens = this.firebase.getKindergardens();
  }


  public selectKindergarden(item) {
    this.router.navigateByUrl('kindergarden/' + item.$key);

  }
}
