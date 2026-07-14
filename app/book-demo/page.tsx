// app/book-demo/page.tsx
import BookingSection from '@/app/Bookingsection'
import Navbar from '@/app/navbar';
import FooterSection from '@/app/Footersection';

export default function BookDemoPage() {
  return (
    <div>
      <Navbar />
      <BookingSection />
      <FooterSection />
    </div>
  )
}