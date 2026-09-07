import React, { useEffect, useState } from 'react';
import { formatUSD, formatXOF } from '../../lib/utils';

interface StatCounterProps {
  value: number;
  currency?: 'USD' | 'XOF' | 'none';
  durationMs?: number;
  className?: string;
  decimals?: number;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  currency = 'USD',
  durationMs = 600,
  className = '',
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const difference = value - startValue;

    if (difference === 0) {
      setDisplayValue(value);
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + difference * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, durationMs]);

  const formatted =
    currency === 'USD'
      ? formatUSD(displayValue, decimals)
      : currency === 'XOF'
      ? formatXOF(displayValue)
      : new Intl.NumberFormat('fr-FR', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(displayValue);

  return <span className={`tabular-nums font-semibold tracking-tight ${className}`}>{formatted}</span>;
};
