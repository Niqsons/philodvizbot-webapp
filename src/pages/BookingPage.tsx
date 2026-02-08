import { useState } from 'react';
import type { Event, BookingData } from '../App';
import { apiHeaders } from '../App';
import { Column, Amphora, Diogenes, LaurelWreath } from '../components/AncientElements';

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
    setLoading(true);
    setError(null);

    try {
      // Telegram Auth: initData отправляется через apiHeaders()
      // Сервер сам извлечёт telegramId/username из подписанных данных
      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...apiHeaders(),
        },
        body: JSON.stringify({
          eventId: event.id,
          guestInfo: guestInfo.trim(),
          seatsCount,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        onBookingCreated(data);
      }
    } catch (e) {
      setError('Боги Олимпа не отвечают...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      <Column className="absolute left-2 top-0 h-full w-8 text-[#C4A484] opacity-30" />
      <Column className="absolute right-2 top-0 h-full w-8 text-[#C4A484] opacity-30" />
      
      <div className="relative z-10 max-w-md mx-auto">
        <div className="flex justify-center mb-2">
          <Diogenes className="w-20 h-24" />
        </div>

        <div className="text-center mb-4">
          <LaurelWreath className="w-32 h-8 mx-auto text-[#6B8E23] mb-1" />
          <h1 className="text-2xl ancient-title">{event.title}</h1>
          <p className="text-sm hint-text italic mt-1">Симпосий мудрецов</p>
        </div>

        <div className="marble-card p-4 mb-4">
          <div className="flex items-start gap-3">
            <Amphora className="w-10 h-16 text-[#C4A484] flex-shrink-0" />
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="gold-accent">📅</span>
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="gold-accent">🏛</span>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="gold-accent">🏺</span>
                <span>Свободных мест: {event.availableSeats} из {event.totalSeats}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 ancient-title">
            🪶 Как тебя величать, о философ? <span className="hint-text text-xs">(необязательно)</span>
          </label>
          <textarea
            value={guestInfo}
            onChange={(e) => { if (e.target.value.length <= 250) setGuestInfo(e.target.value); }}
            placeholder="Имя твоё и весть о тебе..."
            maxLength={250}
            className="w-full p-3 ancient-input resize-none"
            rows={3}
          />
          <p className="text-xs hint-text text-right mt-1">{guestInfo.length}/250</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 ancient-title">
            🍷 Сколько мест за столом?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                disabled={num > maxSeats}
                onClick={() => setSeatsCount(num)}
                className={`flex-1 py-3 rounded font-bold transition-all border-2
                  ${num === seatsCount 
                    ? 'bg-[#5D4E37] text-[#F5F0E8] border-[#D4AF37]' 
                    : 'bg-[#F5F0E8] text-[#5D4E37] border-[#C4A484] hover:border-[#5D4E37]'}
                  ${num > maxSeats ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="marble-card p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="hint-text">Дань за симпосий:</span>
            <span className="text-2xl font-bold wine-text">{totalAmount} драхм</span>
          </div>
          <p className="text-xs hint-text mt-1 italic text-right">(в рублях)</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#722F37] bg-opacity-20 border border-[#722F37] rounded text-[#722F37] text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || event.availableSeats === 0}
          className="w-full py-4 btn-ancient text-lg"
        >
          {loading ? '⏳ Совет богов...' : '🏛 Возлечь на ложе'}
        </button>

        <p className="text-center text-xs hint-text mt-3 italic">
          "Я знаю, что ничего не знаю" — Сократ
        </p>
      </div>
    </div>
  );
}
