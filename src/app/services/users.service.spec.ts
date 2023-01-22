import {TestBed} from '@angular/core/testing';

import {UsersService} from './users.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "../../config/app-config.service";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {AuthService} from "./auth.service";
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import {tokenGetter} from "../app.module";
import {User} from "../models/user";
import {AppConfig} from "../../config/app-config";
import {Router} from "@angular/router";

/**
 * Тестирование сервиса для работы с пользователем.
 */
describe('UsersService', () => {
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
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Тестирование метода на получение авторизированного пользователя.
   */
  describe('getAuthenticatedUser()', () => {
    it('should return user', () => {
      let dummyUser = dummyUsers[0];

      localStorage.setItem("accessToken",
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
        'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');

      httpSpy.get.and.nextWith(dummyUser);

      usersService.getAuthenticatedUser()?.subscribe(user => expect(user).toEqual(dummyUser));

      expect(httpSpy.get.calls.count()).toBe(1);
    });
  });
});

