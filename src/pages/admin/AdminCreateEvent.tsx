import { useState, useEffect } from 'react';
import { apiHeaders, API_URL } from '../../App';

interface Props {
  templateId?: number;
  onBack: () => void;
}

interface TemplateData {
  id: number;
  title: string | null;
  location: string | null;
  totalSeats: number | null;
  price: number | null;
  tbankLink: string | null;
}

export default function AdminCreateEvent({ templateId, onBack }: Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [price, setPrice] = useState('');
  const [tbankLink, setTbankLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const isFromTemplate = !!templateId;

  useEffect(() => {
    if (templateId) {
      fetch(`${API_URL}/api/admin/templates`, { headers: apiHeaders() })
        .then(r => r.json())
        .then((data: TemplateData[]) => {
          const t = data.find(x => x.id === templateId);
          if (t) {
            setTemplate(t);
            setTitle(t.title || '');
            setLocation(t.location || '');
            setTotalSeats(String(t.totalSeats || ''));
            setPrice(String(t.price || ''));
            setTbankLink(t.tbankLink || '');
          }
        });
    }
  }, [templateId]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      let res: Response;
      if (isFromTemplate && templateId) {
        res = await fetch(`${API_URL}/api/admin/events/from-template/${templateId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...apiHeaders() },
          body: JSON.stringify({ title: title || undefined, date, location: location || undefined }),
        });
      } else {
        res = await fetch(`${API_URL}/api/admin/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...apiHeaders() },
          body: JSON.stringify({ title, date, location, totalSeats: Number(totalSeats), price: Number(price), tbankLink }),
        });
      }
      const data = await res.json();
      if (res.ok) onBack();
      else setError(data.error || 'Ошибка');
    } catch {
      setError('Ошибка сервера');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="mb-3 text-sm hint-text">← Назад</button>
        <h1 className="text-xl ancient-title mb-4">
          {isFromTemplate ? `⚡ Из шаблона #${templateId}` : '➕ Новое мероприятие'}
        </h1>

        {error && (
          <div className="mb-3 p-2 bg-[#722F37] bg-opacity-20 border border-[#722F37] rounded text-[#722F37] text-xs text-center">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold mb-1">Название</label>
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder={template?.title || 'Название мероприятия'}
              className="w-full p-3 ancient-input"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Дата и время *</label>
            <input
              value={date} onChange={e => setDate(e.target.value)}
              placeholder="напр. 12/02/26 19:30"
              className="w-full p-3 ancient-input"
            />
          </div>

          {!isFromTemplate && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">Место</label>
                <input
                  value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="Место проведения"
                  className="w-full p-3 ancient-input"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Количество мест</label>
                <input
                  type="number" value={totalSeats} onChange={e => setTotalSeats(e.target.value)}
                  placeholder="15"
                  className="w-full p-3 ancient-input"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Цена (₽)</label>
                <input
                  type="number" value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="500"
                  className="w-full p-3 ancient-input"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Ссылка на оплату</label>
                <input
                  value={tbankLink} onChange={e => setTbankLink(e.target.value)}
                  placeholder="https://t-qr.ru/..."
                  className="w-full p-3 ancient-input"
                />
              </div>
            </>
          )}

          {isFromTemplate && template && (
            <div className="marble-card p-3 text-xs hint-text">
              <p>📍 {template.location || '—'} · 💰 {template.price}₽ · 🎟 {template.totalSeats} мест</p>
              <p className="mt-1 italic">Из шаблона, нельзя изменить</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={saving || !date}
            className="w-full py-3 btn-ancient text-sm"
          >
            {saving ? '⏳...' : '🏛 Создать мероприятие'}
          </button>
        </div>
      </div>
    </div>
  );
}
