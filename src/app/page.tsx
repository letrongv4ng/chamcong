// File: app/page.tsx
'use client'; // Bắt buộc phải có vì mình dùng state, form...

import { useState, FormEvent } from 'react';

export default function HomePage() {
  // State để lưu trữ giá trị của form
  const [employeeName, setEmployeeName] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  
  // State để thông báo
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Hàm xử lý khi nhấn Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Ngăn trang reload
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/timesheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeName, workDate, timeIn, timeOut }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Nếu API trả về lỗi
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      // Thành công
      setMessage(data.message);
      // Xóa form
      setEmployeeName('');
      setWorkDate('');
      setTimeIn('');
      setTimeOut('');

    } catch (error: any) {
      setIsError(true);
      setMessage(error.message);
    }
  };

  // Giao diện (Tailwind)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Chấm Công Part-time</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-300">Tên của mày?</label>
            <input
              type="text"
              id="employeeName"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="workDate" className="block text-sm font-medium text-gray-300">Làm ngày nào?</label>
            <input
              type="date" // Input kiểu Date
              id="workDate"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-blue-500 focus:border-blue-500"
              style={{ colorScheme: 'dark' }} // Hiển thị Date picker màu tối
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="timeIn" className="block text-sm font-medium text-gray-300">Giờ vào</label>
              <input
                type="time" // Input kiểu Time
                id="timeIn"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                required
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="timeOut" className="block text-sm font-medium text-gray-300">Giờ ra</label>
              <input
                type="time" // Input kiểu Time
                id="timeOut"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                required
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow-lg transition duration-300"
          >
            Nộp
          </button>
        </form>

        {/* Thông báo thành công/lỗi */}
        {message && (
          <div className={`mt-4 text-center p-3 rounded-md ${isError ? 'bg-red-800 text-red-100' : 'bg-green-800 text-green-100'}`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}