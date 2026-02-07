import { useState, useEffect } from 'react';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Telegram WebApp
const tg = (window as any).Telegram?.WebApp;

// Хелпер для запросов с Telegram Auth
export function apiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
  };
  if (tg?.initData) {
    headers['X-Telegram-Init-Data'] = tg.initData;
  }
  return headers;
}

export { API_URL };

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  price: number;
  tbankLink: string;
}

interface BookingData {
  bookingId: string;
  totalAmount: number;
  creditUsed: number;
  amountToPay: number;
  tbankLink: string;
}

type Page = 'booking' | 'payment' | 'success' | 'mybookings' | 'admin';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('event');
  const pageParam = params.get('page');
  const isAdmin = params.get('admin') === '1';

  const initialPage: Page = isAdmin ? 'admin' : pageParam === 'mybookings' ? 'mybookings' : 'booking';
  const needsEventLoad = initialPage === 'booking';

  const [page, setPage] = useState<Page>(initialPage);
  const [event, setEvent] = useState<Event | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(needsEventLoad);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
    }

    if (!needsEventLoad) return;

    if (!eventId) {
      setError('Мероприятие не найдено');
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/events/${eventId}`, {
      headers: apiHeaders(),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setEvent(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка загрузки');
        setLoading(false);
      });
  }, [eventId]);

  const handleBookingCreated = (bookingData: BookingData) => {
    setBooking(bookingData);
    setPage('payment');
  };

  const handleReceiptUploaded = () => {
    setPage('success');
    if (tg) tg.close();
  };

  // Админка
  if (page === 'admin') {
    return <AdminDashboard />;
  }

  // Мои брони
  if (page === 'mybookings') {
    return <MyBookingsPage apiUrl={API_URL} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="hint-text">Загрузка...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😔</div>
          <div className="hint-text">{error || 'Мероприятие не найдено'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {page === 'booking' && (
        <BookingPage event={event} apiUrl={API_URL} onBookingCreated={handleBookingCreated} />
      )}
      {page === 'payment' && booking && (
        <PaymentPage booking={booking} apiUrl={API_URL} onReceiptUploaded={handleReceiptUploaded} />
      )}
      {page === 'success' && (
        <SuccessPage event={event} />
      )}
    </div>
  );
}

export type { Event, BookingData };
