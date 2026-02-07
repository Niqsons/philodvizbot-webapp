import { useState, useEffect } from 'react';
import { apiHeaders, API_URL } from '../../App';
import AdminCreateEvent from './AdminCreateEvent';

interface Props {
  eventId: number;
  onBack: () => void;
}

interface BookingItem {
  id: number;
  guestInfo: string;
  telegramId: number | null;
  telegramUsername: string | null;
  seatsCount: number;
  totalAmount: number;
  status: string;
  receiptPath: string | null;
  createdAt: string;
}

interface EventDetail {
  id: number;
  title: string;
  date: string;
  location: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  price: number;
  tbankLink: string;
  bookings: BookingItem[];
}

export default function AdminEventDetail({ eventId, onBack }: Props) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [confirmCancelBooking, setConfirmCancelBooking] = useState<number | null>(null);
  const [keepCredit, setKeepCredit] = useState(true);
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const loadEvent = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/events/${eventId}`, { headers: apiHeaders() });
      const data = await res.json();
      if (res.ok) setEvent(data);
      else setError(data.error);
    } catch {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvent(); }, [eventId]);

  const handleCancelBooking = async (bookingId: number) => {
    setCancellingId(bookingId);
    setConfirmCancelBooking(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...apiHeaders() },
        body: JSON.stringify({ keepCredit }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else await loadEvent();
    } catch {
      setError('Ошибка отмены');
    } finally {
      setCancellingId(null);
      setKeepCredit(true);
    }
  };

  const handleDeleteEvent = async () => {
    setDeletingEvent(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: apiHeaders(),
      });
      const data = await res.json();
      if (res.ok) onBack();
      else setError(data.error);
    } catch {
      setError('Ошибка удаления');
    } finally {
      setDeletingEvent(false);
    }
  };

  const viewReceipt = async (bookingId: number) => {
    setReceiptLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${bookingId}/receipt`, {
        headers: apiHeaders(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Ошибка загрузки чека' }));
        setError(data.error || 'Ошибка загрузки чека');
        return;
      }
      const blob = await res.blob();
      // Освобождаем предыдущий blob URL
      if (receiptUrl) URL.revokeObjectURL(receiptUrl);
      setReceiptUrl(URL.createObjectURL(blob));
    } catch {
      setError('Не удалось загрузить чек');
    } finally {
      setReceiptLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishResult(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/events/${eventId}/publish`, {
        method: 'POST',
        headers: apiHeaders(),
      });
      const data = await res.json();
      if (res.ok) setPublishResult('✅ Опубликовано в канал!');
      else setPublishResult(`❌ ${data.error}`);
    } catch {
      setPublishResult('❌ Ошибка публикации');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="hint-text">Загрузка...</div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <p className="hint-text mb-4">⚠️ {error}</p>
        <button onClick={onBack} className="btn-ancient px-6 py-2 text-sm">← Назад</button>
      </div>
    );
  }

  if (!event) return null;

  if (editMode) {
    return (
      <AdminCreateEvent
        editEvent={{
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          totalSeats: event.totalSeats,
          price: event.price,
          tbankLink: event.tbankLink,
        }}
        onBack={() => { setEditMode(false); setLoading(true); loadEvent(); }}
      />
    );
  }

  const activeBookings = event.bookings.filter(b => b.status !== 'cancelled');
  const cancelledBookings = event.bookings.filter(b => b.status === 'cancelled');

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="mb-3 text-sm hint-text">← Назад</button>

        {/* Инфо о мероприятии */}
        <div className="marble-card p-4 mb-4">
          <h1 className="text-xl ancient-title mb-2">{event.title}</h1>
          <div className="text-sm hint-text space-y-1">
            <div>📅 {event.date}</div>
            <div>📍 {event.location}</div>
            <div>💰 {event.price}₽ · 🎟 {event.bookedSeats}/{event.totalSeats} мест</div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setEditMode(true)}
              className="flex-1 py-2 text-sm border-2 border-[#C4A484] rounded 
                         hover:border-[#5D4E37] transition-colors font-bold"
            >
              ✏️ Редактировать
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex-1 py-2 text-sm border-2 border-[#6B8E23] text-[#6B8E23] rounded 
                         hover:bg-[#6B8E23] hover:bg-opacity-10 transition-colors font-bold"
            >
              {publishing ? '⏳...' : '📢 Опубликовать'}
            </button>
          </div>
          {publishResult && (
            <p className="text-xs text-center mt-2">{publishResult}</p>
          )}
        </div>

        {error && (
          <div className="mb-3 p-2 bg-[#722F37] bg-opacity-20 border border-[#722F37] rounded text-[#722F37] text-xs text-center">
            {error}
          </div>
        )}

        {/* Просмотр чека */}
        {receiptLoading && (
          <div className="mb-4 marble-card p-3 text-center">
            <span className="hint-text text-sm">⏳ Загрузка чека...</span>
          </div>
        )}
        {receiptUrl && (
          <div className="mb-4 marble-card p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold">Скриншот оплаты</span>
              <button onClick={() => { if (receiptUrl) URL.revokeObjectURL(receiptUrl); setReceiptUrl(null); }} className="text-xs hint-text">✕ Закрыть</button>
            </div>
            <img
              src={receiptUrl}
              alt="Чек"
              className="w-full rounded border border-[#C4A484]"
            />
          </div>
        )}

        {/* Активные брони */}
        <h2 className="ancient-title text-base mb-2">Брони ({activeBookings.length})</h2>
        {activeBookings.length === 0 ? (
          <p className="hint-text text-sm italic mb-4">Броней нет</p>
        ) : (
          <div className="space-y-2 mb-4">
            {activeBookings.map(b => (
              <div key={b.id} className="marble-card p-3">
                <div className="flex justify-between items-start mb-1">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="font-bold text-sm">
                      {b.telegramUsername ? `@${b.telegramUsername}` : `ID: ${b.telegramId || '—'}`}
                    </p>
                    <p className="text-xs hint-text mt-0.5 break-words overflow-hidden" style={{ wordBreak: 'break-word' }}>
                      {b.guestInfo}
                    </p>
                  </div>
                  <span className="text-xs flex-shrink-0">{b.status === 'confirmed' ? '✅' : '⏳'}</span>
                </div>
                <p className="text-xs hint-text mb-2">🎟 {b.seatsCount} мест · 💰 {b.totalAmount}₽</p>

                <div className="flex gap-2">
                  {b.receiptPath && (
                    <button
                      onClick={() => viewReceipt(b.id)}
                      className="flex-1 py-1 text-xs border border-[#C4A484] rounded hover:bg-[#C4A484] hover:bg-opacity-10"
                    >
                      📜 Чек
                    </button>
                  )}
                  {confirmCancelBooking !== b.id ? (
                    <button
                      onClick={() => setConfirmCancelBooking(b.id)}
                      className="flex-1 py-1 text-xs border border-[#722F37] text-[#722F37] rounded 
                                 hover:bg-[#722F37] hover:bg-opacity-10"
                    >
                      Отменить
                    </button>
                  ) : (
                    <div className="flex-1 bg-[#722F37] bg-opacity-10 rounded p-2">
                      <label className="flex items-center gap-1 text-xs mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={keepCredit}
                          onChange={e => setKeepCredit(e.target.checked)}
                        />
                        Сохранить кредит ({b.totalAmount}₽)
                      </label>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          disabled={cancellingId === b.id}
                          className="flex-1 py-1 text-xs bg-[#722F37] text-[#F5F0E8] rounded"
                        >
                          {cancellingId === b.id ? '...' : 'Да'}
                        </button>
                        <button
                          onClick={() => { setConfirmCancelBooking(null); setKeepCredit(true); }}
                          className="flex-1 py-1 text-xs border border-[#C4A484] rounded"
                        >
                          Нет
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Отменённые брони */}
        {cancelledBookings.length > 0 && (
          <>
            <h2 className="ancient-title text-base mb-2 opacity-60">Отменённые ({cancelledBookings.length})</h2>
            <div className="space-y-2 mb-4 opacity-60">
              {cancelledBookings.map(b => (
                <div key={b.id} className="marble-card p-3">
                  <p className="text-sm line-through">{b.guestInfo}</p>
                  <p className="text-xs hint-text">🎟 {b.seatsCount} мест · 💰 {b.totalAmount}₽ · ❌</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Удалить мероприятие */}
        <div className="mt-6 pt-4 border-t border-[#C4A484]">
          {!confirmDeleteEvent ? (
            <button
              onClick={() => setConfirmDeleteEvent(true)}
              className="w-full py-2 text-sm border-2 border-[#722F37] text-[#722F37] rounded 
                         hover:bg-[#722F37] hover:bg-opacity-10"
            >
              🗑 Отменить симпосий
            </button>
          ) : (
            <div className="bg-[#722F37] bg-opacity-10 rounded p-3">
              <p className="text-sm text-center font-bold mb-1">Отменить симпосий?</p>
              <p className="text-xs text-center hint-text mb-3">
              Все активные брони будут отменены, кредиты возвращены
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteEvent}
                  disabled={deletingEvent}
                  className="flex-1 py-2 text-sm bg-[#722F37] text-[#F5F0E8] rounded font-bold"
                >
                  {deletingEvent ? '⏳...' : 'Да, отменить'}
                </button>
                <button
                  onClick={() => setConfirmDeleteEvent(false)}
                  className="flex-1 py-2 text-sm border border-[#C4A484] rounded"
                >
                  Нет
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
