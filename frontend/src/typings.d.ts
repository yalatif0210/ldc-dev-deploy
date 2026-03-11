// ApexCharts est chargé en tant que script global (angular.json scripts)
declare class ApexCharts {
  constructor(el: Element | null, options: object);
  render(): Promise<void>;
  destroy(): void;
  updateOptions(options: object): Promise<void>;
  updateSeries(series: object[]): Promise<void>;
}
