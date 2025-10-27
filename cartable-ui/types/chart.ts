/**
 * Chart Types
 * انواع مربوط به چارت‌ها و نمودارها
 */

// Base Chart Data
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

// Line Chart
export interface LineChartData {
  labels: string[];
  datasets: LineChartDataset[];
}

export interface LineChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

// Bar Chart
export interface BarChartData {
  labels: string[];
  datasets: BarChartDataset[];
}

export interface BarChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
}

// Pie Chart / Donut Chart
export interface PieChartData {
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
}

// Area Chart
export interface AreaChartData {
  labels: string[];
  datasets: AreaChartDataset[];
}

export interface AreaChartDataset {
  label: string;
  data: number[];
  fill: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

// Dashboard Charts
export interface DashboardChartData {
  transactionTrend: LineChartData; // روند تراکنش‌ها
  ordersByStatus: PieChartData; // دستورات بر اساس وضعیت
  amountByAccount: BarChartData; // مبلغ بر اساس حساب
  monthlyComparison: BarChartData; // مقایسه ماهانه
}

// Chart Config
export interface ChartConfig {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  animation?: boolean;
  legend?: {
    display?: boolean;
    position?: "top" | "bottom" | "left" | "right";
  };
  tooltip?: {
    enabled?: boolean;
    mode?: "point" | "index" | "nearest";
  };
}

// Time Series Data
export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface TimeSeriesDataset {
  name: string;
  data: TimeSeriesData[];
  color?: string;
}
