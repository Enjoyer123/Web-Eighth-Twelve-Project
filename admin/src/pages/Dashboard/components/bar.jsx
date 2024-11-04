
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; 
import Chart from 'chart.js/auto';
import { fetchDataFromApi } from '../../../utils/api';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const BarChartWithYearSelection = () => {

  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // +1 เพราะ months เริ่มที่ 0
  const currentYear = currentDate.getFullYear();

  const [monthlySale, setMonthlySale] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetchDataFromApi(`/api/orders/all-monthly-sales`).then((res) => {
      setMonthlySale(res);

      // ดึงปีที่ไม่ซ้ำกันจากข้อมูล
      const uniqueYears = Array.from(new Set(res.map(item => item.month.split('-')[0])));
      setYears(uniqueYears);
    });
  }, []);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // สร้าง labels และ data สำหรับ chart ตามปีที่เลือก
  const labels = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0'); // สร้างเดือนในรูปแบบ 01, 02, ...
    return `${selectedYear}-${month}`; // รูปแบบ YYYY-MM
  });

  const data = {
    labels: monthNames,
    datasets: [
      {
        label: 'Monthly Sales',
        data: labels.map((label) => {
          // หาค่าขายจากข้อมูลที่ดึงมาจาก API
          const saleData = monthlySale.find(sale => sale.month === label);
          return saleData ? saleData.totalSales : 0; // หากไม่มีข้อมูล กำหนดค่าเป็น 0
        }),
        backgroundColor: '#FF69B4', // สีพื้นหลังของแท่ง
        borderColor: '#FF69B4', // สีขอบของแท่ง
        borderWidth: 2, // ความหนาของขอบแท่ง
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      
      legend: {
        display: false,
        position: 'top', // ตำแหน่ง legend
      },
      title: {
        display: false,


      },
    },
    scales: {
      x: {

        grid: {
          display: false, // ปิด grid แนวตั้ง
        },
      },
      y: {
        min: 0, // กำหนดค่าต่ำสุดบนแกน y
        max: Math.max(...monthlySale.map(sale => sale.totalSales)) + 100, // ค่าสูงสุด
        grid: {
          display: true, // แสดง grid แนวนอน
        },
      },
    },
  };

  return (
    <>
      <div className='chart-container'>
        <div className='card-body'>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h4 className='card-title ml-auto'>Month Sales</h4>

            <FormControl size="small">
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Bar data={data} options={options} />
        </div>
      </div>




    </>
  );
};

export default BarChartWithYearSelection;
