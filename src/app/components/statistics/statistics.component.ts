import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {StatisticsService} from "../../services/statistics.service";
import {debounceTime, distinctUntilChanged, startWith, Subject, tap} from "rxjs";
import {Statistic} from "../../models/statistic";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Компонент статистики.
 */
export class StatisticsComponent implements OnInit {
  /**
   * Элемент ввода для поиска.
   */
  findControl: FormControl;

  /**
   * Перечисление статистик.
   */
  subjectStatistics: Subject<Statistic[]>;

  /**
   * Номер текущей страницы.
   */
  currentNumberPage: number = 1;

  /**
   * Общее количество статистик.
   */
  totalCountStatistics: number;

  /**
   * Поисковый фильтр.
   */
  searchFilter: string = "";

  /**
   * Количество статистик на странице.
   */
  countStatisticsPage: number;

  /**
   * Задержка перед поиском статистик.
   */
  debounceTimeStatistics: number;

  /**
   * Компонент статистики.
   * @param statisticsService - Сервис для работы со статистикой.
   */
  constructor(private statisticsService: StatisticsService) {
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    this.findControl = new FormControl();
    this.subjectStatistics = new Subject<Statistic[]>();
    this.debounceTimeStatistics = this.statisticsService.DebounceTimeStatistics;
    this.countStatisticsPage = this.statisticsService.CountStatisticsPage;

    this.findControl.valueChanges.pipe(
      startWith(''),
      debounceTime(this.debounceTimeStatistics),
      distinctUntilChanged())
      .subscribe(value => {
        this.searchFilter = value;
        this.getStatisticsParameters();
      });

    this.getStatisticsParameters();
  }

  /**
   * Получение новой страницы.
   * @param currentNumberPage - Текущий номер страницы.
   */
  getPage(currentNumberPage: number) {
    this.currentNumberPage = currentNumberPage;

    this.getStatisticsParameters();
  }

  /**
   * Очистка элемента ввода для поиска.
   */
  clearFindControl() {
    this.findControl.setValue("");
  }

  /**
   * Получение параметров статистик.
   */
  getStatisticsParameters() {
    this.statisticsService.getStatisticsParameters(this.searchFilter, this.currentNumberPage, this.countStatisticsPage)
      .pipe(tap(itemsParameters => this.totalCountStatistics = itemsParameters.totalCountItems))
      .subscribe(value => this.subjectStatistics.next(value.items));
  }
}
