import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {Injectable, Inject} from "@angular/core";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {FirebaseOperation} from "angularfire2/database";
import {MdDialog} from "@angular/material";
import {ConfirmationCmp} from "../confirmation.cmp";

@Injectable()
export class FirebaseService {
  kids: any = [];
  kindergardens: any = [];
  kidsObservable: FirebaseListObservable<any[]>;
  settingsObservable: FirebaseObjectObservable<any[]>;
  kindergardenObservable: FirebaseListObservable<any[]>;
  completed: BehaviorSubject<any> = new BehaviorSubject(null);
  admin: boolean = false;

  public init() {
    this.uploadKidPicFinised = new Subject<void>();
    this.kidsObservable.subscribe((kids) => {
      this.kids = kids;
      this.kindergardenObservable.subscribe((kindergardens) => {
        console.log('kindergardenObservable.subscribe');
        this.kindergardens = kindergardens;
        this.completed.next(true);
      });
    });


  }


  public getLogs(){
    return this.firebase.database.list('/logs');
  }

  public deleteLogs(){
    this.firebase.database.list('/logs').remove();
  }

  public getKidsObs() {
    return this.kidsObservable;
  }

  public refresh() {
    this.init();
  }

  constructor(private dialog: MdDialog, private firebase: AngularFire, @Inject(FirebaseApp) private firebaseApp: any) {
    this.kidsObservable = this.firebase.database.list('/kids');
    this.kindergardenObservable = this.firebase.database.list('/kindergardens');
    this.settingsObservable = this.firebase.database.object('/settings');
    this.init();
  }

  public getSettingsObservable() {
    return this.settingsObservable;
  }

  public getReminderTime(): FirebaseObjectObservable<any> {
    return this.firebase.database.object('/reminderTime');
  }

  public getKids(): any[] {
    return this.kids;
  }

  public addKid(kid: any, kindergardenId: string): Promise<void> {
    return new Promise((res, reject) => {

      kid.image = '';
      this.kidsObservable.push(kid).then((resolve) => {
        kid.$key = resolve.key;
        let data = this.getKindergarden(kindergardenId).kids;
        if (!data) data = {};
        data[kid.$key] = true;
        this.kindergardenObservable.update(kindergardenId, {kids: data}).then(() => {
          res();
        });

      });
    });

  }

  public updateKid(kid: any): firebase.Promise<void> {
    let data: any = {};
    data.name = kid.name;
    data.arrived = kid.arrived;
    data.father = kid.father;
    data.absentConfirmed = kid.absentConfirmed;
    data.mother = kid.mother;
    data.fatherPhone = kid.fatherPhone;
    data.motherPhone = kid.motherPhone;
    data.reminderTime = kid.reminderTime;
    data.vacationPeriodFrom = kid.vacationPeriodFrom;
    data.vacationPeriodTo = kid.vacationPeriodTo;
    return this.kidsObservable.update(kid.$key, data);
  }

  public getKindergardens(): any[] {
    return this.kindergardens;
  }


  getKid(kidId: string): any {
    let _kid: any;
    this.kids.forEach((kid) => {
      if (kid.$key === kidId) {
        _kid = kid;
      }
    });
    return _kid;
  }

  getKindergarden(kindergardenId: any): any {
    let _kindergarden: any;
    this.kindergardens.forEach((kindergarden) => {
      if (kindergarden.$key === kindergardenId) {
        _kindergarden = kindergarden;
      }
    });
    return _kindergarden;

  }

  saveKidPic(kid, byteArray, fileName): Promise<any> {

    return new Promise<any>((res1, err1) => {
      var uInt8Array = byteArray;
      var i = uInt8Array.length;
      var binaryString = [i];
      while (i--) {
        binaryString[i] = String.fromCharCode(uInt8Array[i]);
      }
      var data = binaryString.join('');

      var base64 = window.btoa(data);
      var img = new Image();
      img.src = "data:image/png;base64," + base64;
      img.onload = () => {
        let mainCanvas = document.createElement("canvas");
        mainCanvas.width = 200;
        mainCanvas.height = 200;
        var ctx = mainCanvas.getContext("2d");
        ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
        let resizedImage = mainCanvas.toBlob((data)=>{

          var storageRef = this.firebaseApp.storage().ref();
          var mountainsRef = storageRef.child(fileName);
          let uploadTask = mountainsRef.put(data);
          uploadTask.then(f => {
            this.getKidPic(kid).then((res) => {
              kid.image = res;
              res1(kid);
            });
            console.log('upload finished')
            this.uploadKidPicFinised.next();
          }, r => {
            console.log('upload rejected')
          })

        });



      }
    });

  };

  uploadKidPicFinised: Subject<void>;

  getKidPic(kid: any): Promise<any> {
    return new Promise<any>((res, err) => {
      if (kid.image) return;
      var storageRef = this.firebaseApp.storage().ref();
      var mountainsRef = storageRef.child(kid.$key + '.png');
      mountainsRef.getDownloadURL().then((url) => {
        res(url);
        console.log(kid.name + " image:  " + kid.image);
      }).catch((error) => {
        if (error)
          console.log(kid.name + 'error: ' + error.message);
      });

    });

  }

  addKindergarden(item: any) {
    this.kindergardenObservable.push({name: item.name});
  }

  updateKindergarden(item: any) {

    this.kindergardenObservable.update(item.$key, {
      phone: item.phone,
      name: item.name,
      group : item.group,
      info:item.info,
      simSerialNumber: item.simSerialNumber
    });
  }

  removeKidFromKindergarden(kidId: string, kindergardenId: string) {
    let dialog = this.dialog.open(ConfirmationCmp);
    dialog.afterClosed().subscribe(result => {
        if (!result) return;
        let kids = this.getKindergarden(kindergardenId).kids;
        delete kids[kidId];
        this.kindergardenObservable.update(kindergardenId, {kids: kids});
      }
    );
  }

  updateSettings(settings: any) {
    this.settingsObservable.update(settings);
  }
}
