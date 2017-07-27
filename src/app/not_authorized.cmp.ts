import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'not-authorized',
  template: `
      <h1> {{user}}  NOT AUTHORIZED</h1>
`
})
export class NotAuthorizedComponent implements OnInit {
  private user: any;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {

      this.user = params['user'];

    });
  }

}
