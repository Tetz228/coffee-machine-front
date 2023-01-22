import {TestBed} from '@angular/core/testing';

import {UpdateBalanceService} from './update-balance.service';
import {UsersService} from "./users.service";
import {AuthService} from "./auth.service";
import {AppConfigService} from "../../config/app-config.service";
import {createSpyFromClass, Spy} from "jasmine-auto-spies";
import {HttpClient} from "@angular/common/http";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {User} from "../models/user";
import {tokenGetter} from "../app.module";
import {AppConfig} from "../../config/app-config";
import {Router} from "@angular/router";

describe('UpdateBalanceService', () => {
  let updateBalanceService: UpdateBalanceService;
  let usersService: UsersService;
  let authService: AuthService;
  let fakeAppConfigService = {getConfig: () => new AppConfig()};
  let httpSpy: Spy<HttpClient>;
  let jwtSpy: Spy<JwtHelperService>;
  let httpMock: HttpTestingController;
  let router: Router;
  const dummyUsers: User[] = [
    {
      id: '79714968-dd8b-4073-b6be-23dfabecc51d',
      login: 'egor159',
      password: 'qwerty',
      name: 'Егор',
      balance: 1500
    },
    {
      id: '2bd12bbe-4336-4d9b-be6a-62d73ed9f4d5',
      login: 'ivachak',
      password: 'ytrewq',
      name: 'Иван',
      balance: 2500
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Router, JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:7150"],
          disallowedRoutes: []
        }
      }),],
      providers: [UsersService, AuthService, JwtHelperService, {
        provide: HttpClient,
        useValue: createSpyFromClass(HttpClient)
      }]
    });

    httpSpy = TestBed.inject<any>(HttpClient);
    jwtSpy = TestBed.inject<any>(JwtHelperService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    authService = new AuthService(httpSpy, jwtSpy);
    usersService = new UsersService(httpSpy, jwtSpy, authService, fakeAppConfigService as AppConfigService, router);
    updateBalanceService = new UpdateBalanceService(httpSpy, usersService, fakeAppConfigService as AppConfigService)
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Тестирование метода на обновление баланса пользователя.
   */
  describe('updateBalanceUser(userId: string, sum: number)', () => {
    it('should return user with updated balance', () => {
      let dummyUser = dummyUsers[1];
      dummyUser.balance += 500;

      httpSpy.put.and.nextWith(dummyUser);

      updateBalanceService.updateBalanceUser(dummyUser.id, 500).subscribe((user) =>
        expect(user.balance).toEqual(dummyUser.balance));

      expect(httpSpy.put.calls.count()).toBe(1);
    });
  });
});
