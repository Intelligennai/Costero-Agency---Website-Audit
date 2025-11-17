import React from 'react';

interface ScoreDonutChartProps {
  score: number;
}

const ScoreDonutChartComponent: React.FC<ScoreDonutChartProps> = ({ score }) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return '#06D6A0'; // brand-green
    if (s >= 50) return '#FEE440'; // brand-yellow
    return '#EF476F'; // brand-red
  };

  const color = getScoreColor(score);
  
  const radius = 70;
  const strokeWidth = 20;
  const size = 180;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          className="text-gray-200 dark:text-brand-accent"
          strokeWidth={strokeWidth}
        />
        {/* Foreground arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-5xl font-bold" style={{ color: color, transition: 'color 0.5s ease-out' }}>
          {score}
        </span>
      </div>
    </div>
  );
};

export const ScoreDonutChart = React.memo(ScoreDonutChartComponent);