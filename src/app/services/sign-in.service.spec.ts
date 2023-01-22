import {TestBed} from '@angular/core/testing';

import {SignInService} from './sign-in.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {createSpyFromClass, Spy} from "jasmine-auto-spies";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "../../config/app-config.service";
import {SignIn} from "../models/sign-in";
import {AppConfig} from "../../config/app-config";

/**
 * Тестирование сервиса для работы с авторизацией.
 */
describe('SignInService', () => {
  let signInService: SignInService;
  let httpMock: HttpTestingController;
  let httpSpy: Spy<HttpClient>;
  let fakeAppConfigService = {getConfig: () => new AppConfig()};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignInService, {
        provide: HttpClient,
        useValue: createSpyFromClass(HttpClient)
      }]
    });

    httpSpy = TestBed.inject<any>(HttpClient);
    signInService = new SignInService(httpSpy, fakeAppConfigService as AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Тестирование метода на авторизацию пользователя.
   */
  describe('loginUser(loginUser: ISignIn)', () => {
    const dummyUser: SignIn = {
      login: 'egor159',
      password: 'qwerty',
    };

    it('should return tokens', () => {
      httpSpy.post.and.nextWith(dummyUser);

      signInService.loginUser(dummyUser).subscribe();

      expect(httpSpy.post.calls.count()).toBe(1);
    });
  });
});
