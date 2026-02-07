import { useState, useEffect } from 'react';
import { apiHeaders, API_URL } from '../../App';
import { LaurelWreath } from '../../components/AncientElements';
import AdminEventDetail from './AdminEventDetail';
import AdminCreateEvent from './AdminCreateEvent';
import AdminCreateTemplate from './AdminCreateTemplate';

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  price: number;
  status: string;
}

interface TemplateItem {
  id: number;
  title: string | null;
  location: string | null;
  totalSeats: number | null;
  price: number | null;
  tbankLink: string | null;
}

type AdminPage = 'dashboard' | 'event-detail' | 'create-event' | 'create-from-template' | 'create-template' | 'edit-template';

export default function AdminDashboard() {
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const [evRes, tmplRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/events`, { headers: apiHeaders() }),
        fetch(`${API_URL}/api/admin/templates`, { headers: apiHeaders() }),
      ]);
      const evData = await evRes.json();
      const tmplData = await tmplRes.json();

      if (evRes.ok && Array.isArray(evData)) setEvents(evData);
      else setError(evData.error || 'Ошибка загрузки');

      if (tmplRes.ok && Array.isArray(tmplData)) setTemplates(tmplData);
    } catch {
      setError('Нет доступа или сервер недоступен');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openEvent = (id: number) => {
    setSelectedEventId(id);
    setAdminPage('event-detail');
  };

  const openCreateFromTemplate = (id: number) => {
    setSelectedTemplateId(id);
    setAdminPage('create-from-template');
  };

  const goBack = () => {
    setAdminPage('dashboard');
    setSelectedEventId(null);
    setSelectedTemplateId(null);
    setLoading(true);
    loadData();
  };

  // --- Подстраницы ---
  if (adminPage === 'event-detail' && selectedEventId) {
    return <AdminEventDetail eventId={selectedEventId} onBack={goBack} />;
  }
  if (adminPage === 'create-event') {
    return <AdminCreateEvent onBack={goBack} />;
  }
  if (adminPage === 'create-from-template' && selectedTemplateId) {
    return <AdminCreateEvent templateId={selectedTemplateId} onBack={goBack} />;
  }
  if (adminPage === 'create-template' || adminPage === 'edit-template') {
    return <AdminCreateTemplate templateId={selectedTemplateId} onBack={goBack} />;
  }

  // --- Dashboard ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="hint-text">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <div className="hint-text">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
          <LaurelWreath className="w-32 h-8 mx-auto text-[#6B8E23] mb-1" />
          <h1 className="text-2xl ancient-title">Управление</h1>
          <p className="hint-text text-sm italic">Панель философа-управителя</p>
        </div>

        {/* Кнопка создания */}
        <button
          onClick={() => setAdminPage('create-event')}
          className="w-full py-3 btn-ancient text-sm mb-4"
        >
          ➕ Создать мероприятие
        </button>

        {/* Мероприятия */}
        <h2 className="ancient-title text-lg mb-2">🏛 Мероприятия</h2>
        {events.length === 0 ? (
          <p className="hint-text text-sm italic mb-4">Мероприятий нет</p>
        ) : (
          <div className="space-y-2 mb-6">
            {events.map(ev => (
              <button
                key={ev.id}
                onClick={() => openEvent(ev.id)}
                className="w-full marble-card p-3 text-left hover:border-[#5D4E37] transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-sm">{ev.title}</p>
                    <p className="text-xs hint-text">📅 {ev.date} · 📍 {ev.location}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm font-bold wine-text">{ev.bookedSeats}/{ev.totalSeats}</p>
                    <p className="text-xs hint-text">{ev.price}₽</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Шаблоны */}
        <h2 className="ancient-title text-lg mb-2">📋 Шаблоны</h2>
        <button
          onClick={() => { setSelectedTemplateId(null); setAdminPage('create-template'); }}
          className="w-full py-2 mb-2 text-sm border-2 border-dashed border-[#C4A484] rounded 
                     hover:border-[#5D4E37] transition-colors hint-text"
        >
          ➕ Новый шаблон
        </button>
        {templates.length === 0 ? (
          <p className="hint-text text-sm italic">Шаблонов нет</p>
        ) : (
          <div className="space-y-2">
            {templates.map(t => (
              <div key={t.id} className="marble-card p-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-sm">#{t.id} — {t.title || '—'}</p>
                  <button
                    onClick={() => { setSelectedTemplateId(t.id); setAdminPage('edit-template'); }}
                    className="text-xs hint-text underline"
                  >
                    ✏️
                  </button>
                </div>
                <p className="text-xs hint-text mb-2">
                  {t.location || '—'} · {t.price || '—'}₽ · {t.totalSeats || '—'} мест
                </p>
                <button
                  onClick={() => openCreateFromTemplate(t.id)}
                  className="w-full py-2 text-sm border-2 border-[#6B8E23] text-[#6B8E23] rounded 
                             hover:bg-[#6B8E23] hover:bg-opacity-10 transition-colors"
                >
                  ⚡ Создать мероприятие
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
