// src/components/agent/reports/ReportChart.tsx
"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { BarChart3, Activity } from "lucide-react";

// ----- Các interfaces giữ nguyên -----
interface DataSet {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  yAxisID?: "y" | "y1";
}

interface ChartData {
  labels: string[];
  datasets: DataSet[];
}

interface ReportChartProps {
  chartData: ChartData;
  title: string;
  subtitle?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-divider rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{`Ngày: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="text-sm"
            style={{ color: entry.stroke || entry.fill }}
          >
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export const ReportChart = ({
  chartData,
  title,
  subtitle,
}: ReportChartProps) => {
  const [activeChartType, setActiveChartType] = useState("line");

  const formattedData = chartData.labels.map((label, index) => {
    const dataPoint: { name: string; [key: string]: any } = { name: label };

    chartData.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });

    return dataPoint;
  });

  const renderChart = (type: string) => {
    const ChartComponent = type === "line" ? LineChart : BarChart;

    return (
      <ResponsiveContainer height={350} width="100%">
        <ChartComponent
          data={formattedData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            stroke="hsl(var(--nextui-default-200))"
            strokeDasharray="3 3"
          />
          <XAxis
            axisLine={false}
            dataKey="name"
            fontSize={12}
            stroke="hsl(var(--nextui-default-500))"
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            fontSize={12}
            orientation="left"
            stroke="hsl(var(--nextui-default-500))"
            tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`}
            tickLine={false}
            yAxisId="y"
          />
          <YAxis
            axisLine={false}
            fontSize={12}
            orientation="right"
            stroke="hsl(var(--nextui-default-500))"
            tickFormatter={(value) => value.toLocaleString()}
            tickLine={false}
            yAxisId="y1"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {chartData.datasets.map((dataset) =>
            type === "line" ? (
              <Line
                key={dataset.label}
                dataKey={dataset.label}
                stroke={dataset.borderColor}
                strokeWidth={2}
                type="monotone"
                yAxisId={dataset.yAxisID || "y"}
              />
            ) : (
              <Bar
                key={dataset.label}
                dataKey={dataset.label}
                fill={dataset.backgroundColor}
                radius={[4, 4, 0, 0]}
                yAxisId={dataset.yAxisID || "y"}
              />
            )
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="w-full shadow-lg border border-divider/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
              {subtitle && (
                <p className="text-sm text-default-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          <Tabs
            className="mt-4"
            selectedKey={activeChartType}
            size="sm"
            onSelectionChange={(key) => setActiveChartType(key as string)}
          >
            <Tab
              key="line"
              title={
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Biểu đồ đường
                </div>
              }
            />
            <Tab
              key="bar"
              title={
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Biểu đồ cột
                </div>
              }
            />
          </Tabs>
        </div>
      </CardHeader>
      <CardBody className="pt-0">{renderChart(activeChartType)}</CardBody>
    </Card>
  );
};
