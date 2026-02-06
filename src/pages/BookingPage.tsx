import { useState } from 'react';
import type { Event, BookingData } from '../App';

interface Props {
  event: Event;
  apiUrl: string;
  onBookingCreated: (booking: BookingData) => void;
}

export default function BookingPage({ event, apiUrl, onBookingCreated }: Props) {
  const [guestInfo, setGuestInfo] = useState('');
  const [seatsCount, setSeatsCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = event.price * seatsCount;
  const maxSeats = Math.min(5, event.availableSeats);

  const handleSubmit = async () => {
    if (!guestInfo.trim()) {
      setError('Заполните информацию о себе');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Получаем данные из Telegram WebApp
      const tg = (window as any).Telegram?.WebApp;
      const user = tg?.initDataUnsafe?.user;

      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          guestInfo: guestInfo.trim(),
          seatsCount,
          telegramId: user?.id,
          telegramUsername: user?.username,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        onBookingCreated(data);
      }
    } catch (e) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-4">
      {/* Заголовок мероприятия */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-telegram-text mb-2">{event.title}</h1>
        <div className="text-telegram-hint text-sm space-y-1">
          <div>📅 {event.date}</div>
          <div>📍 {event.location}</div>
          <div>🎟 Свободно мест: {event.availableSeats} из {event.totalSeats}</div>
        </div>
      </div>

      {/* Информация о себе */}
      <div className="mb-4">
        <label className="block text-telegram-text text-sm font-medium mb-2">
          О себе
        </label>
        <textarea
          value={guestInfo}
          onChange={(e) => setGuestInfo(e.target.value)}
          placeholder="Ваше имя, контакт или любая информация..."
          className="w-full p-3 rounded-lg bg-telegram-secondary text-telegram-text 
                     placeholder-telegram-hint border-none outline-none resize-none"
          rows={3}
        />
      </div>

      {/* Выбор количества мест */}
      <div className="mb-6">
        <label className="block text-telegram-text text-sm font-medium mb-2">
          Количество мест
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              disabled={num > maxSeats}
              onClick={() => setSeatsCount(num)}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors
                ${num === seatsCount 
                  ? 'bg-telegram-button text-telegram-buttonText' 
                  : 'bg-telegram-secondary text-telegram-text'}
                ${num > maxSeats ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>


      {/* Итого */}
      <div className="mb-4 p-4 bg-telegram-secondary rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-telegram-hint">Итого:</span>
          <span className="text-xl font-bold text-telegram-text">{totalAmount} ₽</span>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Кнопка оплаты */}
      <button
        onClick={handleSubmit}
        disabled={loading || event.availableSeats === 0}
        className="w-full py-4 bg-telegram-button text-telegram-buttonText 
                   font-medium rounded-lg disabled:opacity-50"
      >
        {loading ? 'Загрузка...' : '💳 Оплатить'}
      </button>
    </div>
  );
}
