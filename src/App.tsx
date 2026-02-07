import { useState, useEffect } from 'react';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';

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

type Page = 'booking' | 'payment' | 'success';

export default function App() {
  const [page, setPage] = useState<Page>('booking');
  const [event, setEvent] = useState<Event | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventId = new URLSearchParams(window.location.search).get('event');

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
    }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-telegram-hint">Загрузка...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😔</div>
          <div className="text-telegram-text">{error || 'Мероприятие не найдено'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-telegram-bg">
      {page === 'booking' && (
        <BookingPage 
          event={event} 
          apiUrl={API_URL}
          onBookingCreated={handleBookingCreated} 
        />
      )}
      {page === 'payment' && booking && (
        <PaymentPage 
          booking={booking}
          apiUrl={API_URL}
          onReceiptUploaded={handleReceiptUploaded}
        />
      )}
      {page === 'success' && (
        <SuccessPage event={event} />
      )}
    </div>
  );
}

export type { Event, BookingData };
