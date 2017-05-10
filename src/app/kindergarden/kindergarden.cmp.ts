import {Component, ChangeDetectorRef, NgZone} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../services/firebase.service";

@Component({
  selector: 'kindergarden',
  templateUrl: './kindergarden.component.html',
  styleUrls: ['./kindergarden.component.css']
})
export class KindergardenComponent {

  kids: any[] = [];
  private reminderTime: any;
  kindergarden: any;

  constructor(private firebase: FirebaseService, private route: ActivatedRoute, private router: Router, private zone: NgZone) {
    this.kindergarden = {};
  }

  ngOnInit() {
    this.firebase.refresh();
    this.firebase.uploadKidPicFinised.subscribe(()=>{
      this.getKindergardenKids();
    });
    this.route.params.forEach((params: Params) => {
        let kindergardenId = params['id'];
        if (kindergardenId !== '-1') {
          this.firebase.completed.subscribe((c) => {
            if (c) {
              this.zone.run(() => {
                this.kindergarden = this.firebase.getKindergardens().filter((kg) => kg.$key === kindergardenId)[0];
                if (!this.kindergarden.simSerialNumber) this.kindergarden.simSerialNumber = '';
                if (!this.kindergarden.phone) this.kindergarden.phone = '';
                this.getKindergardenKids();
                this.getReminderTime();
              });
            }
          });
        }
      }
    );
  }


  public updateKindergarden() {
    this.firebase.updateKindergarden(this.kindergarden);
  }

  public setArrived(_kid: any) {
    _kid.arrived = true;
    this.firebase.updateKid(_kid);
  }

  public setNotArrived(_kid: any) {
    _kid.arrived = false;
    this.firebase.updateKid(_kid);
  }

  public removeConfimation(_kid: any) {
    _kid.absentConfirmed = false;
    this.firebase.updateKid(_kid);
  }

  public editKid(kidId: string, kgId: any) {
    this.router.navigateByUrl('kid/' + kidId + '/' + kgId);
  }

  public removeKid(kidId: string, kgId: any) {
    this.firebase.removeKidFromKindergarden(kidId, kgId);
  }

  public addKid(kgId: any) {
    this.router.navigateByUrl('kid/-1/' + kgId);
  }

  private getKindergardenKids() {
    if (!this.kindergarden) return;
    let temp = [];
    let kidIds = this.kindergarden.kids;

    this.firebase.getKidsObs().subscribe((k:any[]) => {

      this.kids = k.filter(kid => {
        if (kidIds[kid.$key]) return true;
        return false;
      });

      this.kids.forEach(k=>{
        this.firebase.getKidPic(k).then((res)=>{
          k.image = res;
        });;
      });
    });

  }


  private getReminderTime() {
    this.firebase.getReminderTime().subscribe((time) => {
      this.reminderTime = time.$value;
    });
  }
}
