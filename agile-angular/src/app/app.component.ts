import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'agile-angular';
  isUserLoggedIn: boolean = false;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      if(user) {
        this.isUserLoggedIn = true;
      } else {

      }
    });
  }
}
