import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,     private route: ActivatedRoute ,private service: ReportService) { }

  ngOnInit(): void {

    if(this.route.snapshot.paramMap.get('id')){
      localStorage.setItem("quiz_id", this.route.snapshot.paramMap.get('id') || '');
      this.router.navigate(['/']);
    }else{
      this.router.navigate(['/error']);
    }
  }



}
