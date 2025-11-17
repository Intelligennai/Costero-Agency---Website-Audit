import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreDonutChartProps {
  score: number;
}

const ScoreDonutChartComponent: React.FC<ScoreDonutChartProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#06D6A0'; // brand-green
    if (score >= 50) return '#FEE440'; // brand-yellow
    return '#EF476F'; // brand-red
  };

  const color = getScoreColor(score);
  const COLORS = [color, '#415A77']; // brand-accent for remaining

  return (
    <div style={{ width: '180px', height: '180px', position: 'relative' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={450}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-5xl font-bold" style={{ color: color }}>
          {score}
        </span>
      </div>
    </div>
  );
};

export const ScoreDonutChart = React.memo(ScoreDonutChartComponent);