export class INineBoxMatrixModel {
  staffName: string;
  StaffNumber: string;
  staffPosition: string;
  gender: string;
  imageUrl: string;
  xRealValue: number;
  xValueBaseTen: number;
  xValueBaseHundred: number;
  yRealValue: number;
  yValueBaseTen: number;
  yValueBaseHundred: number;
  zRealValue: number;
  zValueBaseTen: number;
  zValueBaseHundred: number;
}

export class IChartMeasure {
  dimension1?: string;
  dimension2?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  chartType: string;
  chartName: string;
}
