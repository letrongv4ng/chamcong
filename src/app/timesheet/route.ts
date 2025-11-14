// File: src/app/timesheet/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { employeeName, workDate, timeIn, timeOut } = await request.json();

    // Lỗi cơ bản: Cần 4 trường này
    if (!employeeName || !workDate || !timeIn || !timeOut) {
      return NextResponse.json({ error: 'Thiếu thông tin rồi mày ơi.' }, { status: 400 });
    }

    // --- SỬA LỖI BUILD ---
    // Mình không dùng new Date() nữa.
    // Mình build một cái string ISO 8601 có múi giờ (+07:00 cho Việt Nam)
    // và ném thẳng cho Postgres, nó sẽ tự hiểu.
    // Đây là một "Primitive" (string) nên TypeScript sẽ không báo lỗi.
    
    const timeInISOString = `${workDate}T${timeIn}:00+07:00`;
    const timeOutISOString = `${workDate}T${timeOut}:00+07:00`;

    // Check logic: Giờ ra phải sau giờ vào (dùng new Date để so sánh cho chắc)
    if (new Date(timeOutISOString) <= new Date(timeInISOString)) {
        return NextResponse.json({ error: 'Giờ kết thúc phải sau giờ bắt đầu chứ?' }, { status: 400 });
    }

    // Chèn vào database bằng string
    await sql`
      INSERT INTO timesheets (employee_name, work_date, time_in, time_out)
      VALUES (${employeeName}, ${workDate}, ${timeInISOString}, ${timeOutISOString});
    `;
    // --- KẾT THÚC SỬA LỖI ---

    return NextResponse.json({ message: 'Chấm công thành công!' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Lỗi server rồi, xem lại đi.' }, { status: 500 });
  }
}