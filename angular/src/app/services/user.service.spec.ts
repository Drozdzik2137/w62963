import { environment } from './../../environments/environment.prod';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';

describe('UserService', () => {
  let service: UserService;
  let http: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UserService, { provide: ToastrService, useValue: ToastrService }],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpClient)
  });

  describe('getUser', () => {
    describe('when request is successful', () => {
      const UserParamas = {
        "userId": 1,
        "email": "admin@admin.pl",
        "fname": "FAdmin",
        "lname": "LAdmin",
        "photoUrl": "https://static8.depositphotos.com/1207999/1027/i/600/depositphotos_10274386-stock-photo-business-man-avatar-in-blue.jpg",
        "isAdmin": true,
        "type": "local",
        "createdAt": new Date("2022-05-19T17:31:47.000Z"),
        "phoneNumber": "123-456-789"
      }
      beforeEach(() => {
        spyOn(http, 'get').and.returnValue(of(UserParamas))
      });

      it('should make request to api', () => {
        service.getUser(1);
        expect(http.get).toHaveBeenCalledWith(`${environment.SERVER_URL}/user/1`);
      });

      it('should return user', () => {
        service.getUser(1).subscribe((user: IGetUserTest) => {
          expect(user).toEqual(UserParamas)
        })
      })
    });

    describe('when request is successful but user with these id not exist', () => {
      const response = {
        "message": "Error 404"
      }
      beforeEach(() => {
        spyOn(http, 'get').and.returnValue(of(response))
      });
      it('should be equal', () => {
        service.getUser(0).subscribe(user => {
          // @ts-ignore
          expect(user).toEqual(response);
        })
      })
    })
  });


  it('should be created', () => {
    expect(service).toBeDefined();
  });
});

export interface IGetUserTest{
  userId: number;
  email: string;
  fname: string;
  lname: string;
  photoUrl: string;
  type: string;
  isAdmin: boolean;
  createdAt: Date;
  phoneNumber: string;
}
