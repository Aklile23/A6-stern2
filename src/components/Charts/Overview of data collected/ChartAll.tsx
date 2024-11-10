import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE', '#FFB547', '#FF7F50'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      '2024-10-07', '2024-10-09', '2024-10-11', '2024-10-14', '2024-10-16', 
      '2024-10-18', '2024-10-21', '2024-10-23', '2024-10-25', '2024-10-28', 
      '2024-11-01'
    ],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartAll: React.FC = () => {
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: '360 Images',
        data: [2, 5, 4, 4, 4, 5, 5, 5, 5, 5, 5],
      },
      {
        name: 'Images',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Video',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Point Cloud',
        data: [2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
      },
    ],
  });

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Overview of Data Collected
          </h4>
        </div>
      </div>
      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartAll;
