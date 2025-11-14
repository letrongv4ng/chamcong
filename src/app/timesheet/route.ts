// File: app/api/timesheet/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { employeeName, workDate, timeIn, timeOut } = await request.json();

    // Lỗi cơ bản: Cần 4 trường này
    if (!employeeName || !workDate || !timeIn || !timeOut) {
      return NextResponse.json({ error: 'Thiếu thông tin rồi mày ơi.' }, { status: 400 });
    }

    // Xử lý quan trọng: 
    // Gộp Ngày ("2025-11-14") và Giờ ("17:00") thành một đối tượng Date chuẩn
    // mà Postgres (TIMESTAMPTZ) hiểu được.
    const timeInTimestamp = new Date(`${workDate}T${timeIn}:00`);
    const timeOutTimestamp = new Date(`${workDate}T${timeOut}:00`);

    // Check logic: Giờ ra phải sau giờ vào
    if (timeOutTimestamp <= timeInTimestamp) {
        return NextResponse.json({ error: 'Giờ kết thúc phải sau giờ bắt đầu chứ?' }, { status: 400 });
    }

    // Chèn vào database
    await sql`
      INSERT INTO timesheets (employee_name, work_date, time_in, time_out)
      VALUES (${employeeName}, ${workDate}, ${timeInTimestamp}, ${timeOutTimestamp});
    `;

    return NextResponse.json({ message: 'Chấm công thành công!' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Lỗi server rồi, xem lại đi.' }, { status: 500 });
  }
}