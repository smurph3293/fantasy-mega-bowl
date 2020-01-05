import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpEventType, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LeagueService, UploadService } from '../_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public currentUser;
  public userLeagueData = [];
  @ViewChild("fileInput", {static: false}) fileInput: ElementRef;
  files  = []; 
  constructor(private leagueService : LeagueService, private uploadService: UploadService) {
    this.currentUser = localStorage.getItem('currentUser')? JSON.parse(localStorage.getItem('currentUser')) : '';
   }

  ngOnInit() {
    this.leagueService.getLeagueMeta()
        .subscribe(
            data => {
              console.log(`data in home component: ${data}`);
              this.userLeagueData[0] = data;
            },
            error => {
              console.log(`error in home component: ${JSON.stringify(error)}`);
            });

  }

  callUploadService(file) {  
    const formData = new FormData();  
    formData.append('file', file.data);  
    file.inProgress = true;  
    this.uploadService.upload(formData).pipe(  
      map((event: any) => {  
        switch (event.type) {  
          case HttpEventType.UploadProgress:  
            file.progress = Math.round(event.loaded * 100 / event.total);  
            break;  
          case HttpEventType.Response:  
            return event;  
        }  
      })).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
          console.log(event.body);  
        }  
      });  
  }

  private upload() {  
    this.fileInput.nativeElement.value = '';  
    this.files.forEach(file => {  
      this.callUploadService(file);  
    });  
  }

  onClick() {  
    const fileInput = this.fileInput.nativeElement;
    fileInput .onchange = () => {  
        for (let index = 0; index < fileInput .files.length; index++)  
        {  
             const file = fileInput .files[index];  
             this.files.push({ data: file, inProgress: false, progress: 0});  
        }  
          this.upload();  
    };  
    fileInput.click();  
  }


}
