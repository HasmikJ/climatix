export const toChartData = (data: any) => {
  return [
    {
      data: data.map((item: any) => {
        return {
          x: new Date(item.hour),
          y: [item.open, item.high, item.low, item.close]
        };
      })
    }
  ];
};
