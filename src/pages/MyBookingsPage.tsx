import { useState, useEffect } from 'react';
import { apiHeaders } from '../App';
import { Column, Amphora, LaurelWreath } from '../components/AncientElements';

interface Props {
  apiUrl: string;
}

interface Booking {
  id: number;
  eventTitle: string;
  eventDate: string;
  seatsCount: number;
  totalAmount: number;
  status: string;
}

export default function MyBookingsPage({ apiUrl }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
  const [cancelResult, setCancelResult] = useState<{ id: number; credit: number } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsRes, balanceRes] = await Promise.all([
        fetch(`${apiUrl}/api/mybookings`, { headers: apiHeaders() }),
        fetch(`${apiUrl}/api/balance`, { headers: apiHeaders() }),
      ]);
      const bookingsData = await bookingsRes.json();
      const balanceData = await balanceRes.json();

      if (Array.isArray(bookingsData)) setBookings(bookingsData);
      else setError(bookingsData.error || 'Ошибка загрузки');

      if (typeof balanceData.balance === 'number') setBalance(balanceData.balance);
    } catch {
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    setConfirmCancelId(null);
    try {
      const res = await fetch(`${apiUrl}/api/bookings/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...apiHeaders() },
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setCancelResult({ id, credit: data.creditAdded || 0 });
        await loadData();
      }
    } catch {
      setError('Ошибка отмены');
    } finally {
      setCancellingId(null);
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return { emoji: '✅', text: 'Подтверждено' };
      case 'cancelled': return { emoji: '❌', text: 'Отменено' };
      case 'pending': return { emoji: '⏳', text: 'Ожидает оплаты' };
      default: return { emoji: '❓', text: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Amphora className="w-16 h-24 text-[#C4A484] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      <Column className="absolute left-2 top-0 h-full w-8 text-[#C4A484] opacity-20" />
      <Column className="absolute right-2 top-0 h-full w-8 text-[#C4A484] opacity-20" />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="text-center mb-4">
          <LaurelWreath className="w-32 h-8 mx-auto text-[#6B8E23] mb-1" />
          <h1 className="text-2xl ancient-title">Мои бронирования</h1>
        </div>

        {/* Баланс */}
        <div className="marble-card p-4 mb-4 text-center">
          <p className="hint-text text-sm">Баланс кредитов</p>
          <p className="text-3xl font-bold wine-text">{balance} ₽</p>
          {balance > 0 && (
            <p className="hint-text text-xs italic mt-1">
              Будет списан при следующем бронировании
            </p>
          )}
        </div>

        {/* Уведомление о кредите после отмены */}
        {cancelResult && (
          <div className="mb-4 p-3 bg-[#6B8E23] bg-opacity-15 border border-[#6B8E23] rounded text-sm text-center">
            <p className="font-bold">💰 Бронь отменена</p>
            {cancelResult.credit > 0 && (
              <p className="mt-1">На баланс начислено {cancelResult.credit}₽ кредитов</p>
            )}
            <button
              onClick={() => setCancelResult(null)}
              className="mt-2 text-xs hint-text underline"
            >
              Закрыть
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-[#722F37] bg-opacity-20 border border-[#722F37] rounded text-[#722F37] text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Список бронирований */}
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <Amphora className="w-12 h-18 text-[#C4A484] mx-auto mb-3 opacity-50" />
            <p className="hint-text italic">Бронирований пока нет</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const s = statusLabel(b.status);
              const canCancel = b.status === 'confirmed' || b.status === 'pending';
              return (
                <div key={b.id} className="marble-card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold ancient-title text-sm flex-1">{b.eventTitle}</h3>
                    <span className="text-xs ml-2 whitespace-nowrap">{s.emoji} {s.text}</span>
                  </div>
                  <div className="text-sm hint-text space-y-1 mb-3">
                    <div>📅 {b.eventDate}</div>
                    <div>🎟 {b.seatsCount} мест · 💰 {b.totalAmount}₽</div>
                  </div>

                  {/* Кнопка отмены / подтверждение */}
                  {canCancel && confirmCancelId !== b.id && (
                    <button
                      onClick={() => setConfirmCancelId(b.id)}
                      className="w-full py-2 text-sm border-2 border-[#722F37] text-[#722F37] 
                                 rounded hover:bg-[#722F37] hover:bg-opacity-10 transition-colors"
                    >
                      Отменить бронь
                    </button>
                  )}

                  {canCancel && confirmCancelId === b.id && (
                    <div className="bg-[#722F37] bg-opacity-10 rounded p-3">
                      <p className="text-sm text-center mb-2 font-bold">Точно отменить?</p>
                      {b.status === 'confirmed' && (
                        <p className="text-xs text-center hint-text mb-2">
                          💰 {b.totalAmount}₽ будут начислены на баланс кредитов
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={cancellingId === b.id}
                          className="flex-1 py-2 text-sm bg-[#722F37] text-[#F5F0E8] rounded font-bold"
                        >
                          {cancellingId === b.id ? '⏳...' : 'Да, отменить'}
                        </button>
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="flex-1 py-2 text-sm border border-[#C4A484] rounded"
                        >
                          Нет
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs hint-text mt-6 italic">
          "Познай самого себя" — Храм Аполлона в Дельфах
        </p>
      </div>
    </div>
  );
}
