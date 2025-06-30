// src/components/agent/dashboard/StatCard.tsx

"use client";
import { Card, CardBody } from "@heroui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string; // Ví dụ: 'text-primary', 'text-success'
}

export const StatCard = ({
  title,
  value,
  icon,
  color = "text-primary",
}: StatCardProps) => (
  <Card>
    <CardBody className="flex flex-row items-center gap-4 p-5">
      <div className={`text-4xl ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardBody>
  </Card>
);
