import { useAtom } from 'jotai';
import { chartDataConfigStore } from '../../../../store/charts';
import Chart from 'react-apexcharts';
function ChartRenderer() {
  const [chartDataConfig] = useAtom(chartDataConfigStore);

  return (
    <div>
      <Chart
        options={chartDataConfig.options}
        series={chartDataConfig.series}
        type={chartDataConfig.type}
        width="500"
      />
    </div>
  );
}

export default ChartRenderer;
