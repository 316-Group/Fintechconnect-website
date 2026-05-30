// app/book-demo/page.tsx
import BookingSection from '@/app/Bookingsection'
import Navbar from '@/app/navbar';

export default function BookDemoPage() {
  return (
    <div>
      <Navbar />
      <BookingSection />
    </div>
  )
}