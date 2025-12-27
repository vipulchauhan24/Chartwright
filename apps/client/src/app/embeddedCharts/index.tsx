import { ChartRenderer } from '@chartwright/chart-renderer';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const CHART_CONTAINER_ID = 'echarts-embed-view-container';

function EmbeddedCharts() {
  const [chartDataConfig, setChartDataConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const chartRendererInst = useRef<ChartRenderer>(undefined);

  const fetchEmbedIframeConfig = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) {
      setError('Id parameter missing!!');
    }
    try {
      const response = await axios.get(`/api/embed/dynamic-iframe/${id}`);

      setChartDataConfig(response.data);
    } catch {
      setError('Data loading failed!!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmbedIframeConfig();
  }, [fetchEmbedIframeConfig]);

  const renderChart = useCallback(() => {
    chartRendererInst.current?.renderChart(chartDataConfig);
  }, [chartDataConfig]);

  useEffect(() => {
    if (!isLoading && !chartRendererInst.current && chartDataConfig) {
      chartRendererInst.current = new ChartRenderer(CHART_CONTAINER_ID);

      chartRendererInst.current.addEventListener('ready', renderChart);
    }
  }, [chartDataConfig, renderChart, isLoading]);

  useEffect(() => {
    return () => {
      chartRendererInst.current?.disposeChart();
      chartRendererInst.current?.removeEventListener('ready', renderChart);
    };
  }, [renderChart]);

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            strokeDasharray="31.4"
            strokeDashoffset="31.4"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="31.4"
              to="0"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    );
  } else if (error.length) {
    return <h1>{error}</h1>;
  }

  return (
    <div
      style={{
        height: '100%',
        background: '#FFFFFF',
        borderRadius: '0.375rem',
        padding: '0.625rem',
      }}
      id={CHART_CONTAINER_ID}
    ></div>
  );
}

export default React.memo(EmbeddedCharts);
