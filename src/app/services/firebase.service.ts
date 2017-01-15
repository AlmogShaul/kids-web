import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {Injectable, Inject} from "@angular/core";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {FirebaseOperation} from "angularfire2/database";

@Injectable()
export class FirebaseService {
  kids: any = [];
  kindergardens: any = [];
  kidsObservable: FirebaseListObservable<any[]>;
  settingsObservable: FirebaseObjectObservable<any[]>;
  kindergardenObservable: FirebaseListObservable<any[]>;
  completed: BehaviorSubject<any> = new BehaviorSubject(null);

  public init() {
    this.kidsObservable.subscribe((kids) => {
      this.kids = kids;
      this.kids.forEach((k) => {
        this.getKidPic(k);
        k = Object.assign(k, k);
      });
      this.kindergardenObservable.subscribe((kindergardens) => {
        this.kindergardens = kindergardens;
        this.completed.next(true);
      });
    });
  }

  constructor(private firebase: AngularFire,@Inject(FirebaseApp) private firebaseApp: any) {
    this.kidsObservable = this.firebase.database.list('/kids');
    this.kindergardenObservable = this.firebase.database.list('/kindergardens');
    this.settingsObservable = this.firebase.database.object('/settings');
    this.init();
  }

  public getSettingsObservable(){
    return this.settingsObservable;
  }

  public getReminderTime(): FirebaseObjectObservable<any> {
    return this.firebase.database.object('/reminderTime');
  }

  public getKids(): any[] {
    return this.kids;
  }

  public addKid(kid: any,kindergardenId:string) {
    this.kidsObservable.push(kid).then((resolve)=>{
      kid.$key = resolve.key;
      let data = this.getKindergarden(kindergardenId).kids;
      if(!data) data = {};
      data[kid.$key] = true;
      this.kindergardenObservable.update(kindergardenId,{kids:data}).catch((c)=>{
        console.log(c);
      });

    });
  }

  public updateKid(kid: any) {
    let data : any = {};
    data.name = kid.name;
    data.arrived = kid.arrived;
    data.father = kid.father;
    data.mother = kid.mother;
    data.fatherPhone = kid.fatherPhone;
    data.motherPhone = kid.motherPhone;
    data.reminderTime = kid.reminderTime;
    this.kidsObservable.update(kid.$key, data);
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
  saveKidPic(byteArray, fileName) {
    var storageRef = this.firebaseApp.storage().ref();
    var mountainsRef = storageRef.child(fileName);
    mountainsRef.put(byteArray);
  };

  getKidPic(kid:any){
    var storageRef = this.firebaseApp.storage().ref();
    var mountainsRef = storageRef.child(kid.$key + '.png');
    mountainsRef.getDownloadURL().then( (url) => {
      kid.image = url;
      console.log(kid.name + " image:  " + kid.iamge);
    }).catch((error) => {
      if (error)
        console.log(kid.name + 'error: ' + error.message);
    });
  }
  addKindergarden(item: any) {
    this.kindergardenObservable.push({name:item.name});
  }

  updateKindergarden(item:any){
    this.kindergardenObservable.update(item.$key,{phone:item.phone,name:item.name});
  }

  removeKidFromKindergarden(kidId:string,kindergardenId:string){
    let kids = this.getKindergarden(kindergardenId).kids;
    delete kids[kidId];
    this.kindergardenObservable.update(kindergardenId,{kids : kids});
  }

  updateSettings(settings: any) {
    this.settingsObservable.update(settings);
  }
}
