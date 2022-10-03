import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'agile-angular';
  isUserLoggedIn: boolean = false;

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      if(user) {
        this.isUserLoggedIn = true;
        this.router.navigate(['/projects']);
      } else {
        this.router.navigate(['landing']);
      this.isUserLoggedIn = false;
      }
    });
  }
}
