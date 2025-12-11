import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book1 from '@/models/Book'; // Weird import due to lazy loading pattern seen before. 
// Actually, looking at Book.ts again:
// export default function getBookModel() {
//   return mongoose.models.Book || mongoose.model('Book', BookSchema);
// }
// So I should import and call it.

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const Book = (await import('@/models/Book')).default(); // Dynamic import to ensure schema registration
        const User = (await import('@/models/User')).default; // Dynamic import to ensure schema registration

        const borrowings = await Book.find({
            borrowedBy: { $ne: null },
            borrowedStartDate: { $exists: true },
            borrowedEndDate: { $exists: true }
        })
            .populate('borrowedBy', 'name email')
            .select('title borrowedBy borrowedStartDate borrowedEndDate');

        return NextResponse.json({ borrowings });

    } catch (error) {
        console.error('Calendar API error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
