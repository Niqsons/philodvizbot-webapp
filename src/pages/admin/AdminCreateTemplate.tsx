import { useState, useEffect } from 'react';
import { apiHeaders, API_URL } from '../../App';

interface Props {
  templateId?: number | null;
  onBack: () => void;
}

export default function AdminCreateTemplate({ templateId, onBack }: Props) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [price, setPrice] = useState('');
  const [tbankLink, setTbankLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!templateId;

  useEffect(() => {
    if (templateId) {
      fetch(`${API_URL}/api/admin/templates`, { headers: apiHeaders() })
        .then(r => r.json())
        .then((data: any[]) => {
          const t = data.find(x => x.id === templateId);
          if (t) {
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
      const body = { title, location, totalSeats: Number(totalSeats) || 0, price: Number(price) || 0, tbankLink };
      const url = isEdit ? `${API_URL}/api/admin/templates/${templateId}` : `${API_URL}/api/admin/templates`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...apiHeaders() },
        body: JSON.stringify(body),
      });
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
          {isEdit ? `✏️ Шаблон #${templateId}` : '➕ Новый шаблон'}
        </h1>

        {error && (
          <div className="mb-3 p-2 bg-[#722F37] bg-opacity-20 border border-[#722F37] rounded text-[#722F37] text-xs text-center">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold mb-1">Название *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Название мероприятия" className="w-full p-3 ancient-input" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Место</label>
            <input value={location} onChange={e => setLocation(e.target.value)}
              placeholder="Место проведения" className="w-full p-3 ancient-input" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Количество мест</label>
            <input type="number" value={totalSeats} onChange={e => setTotalSeats(e.target.value)}
              placeholder="15" className="w-full p-3 ancient-input" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Цена (₽)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)}
              placeholder="500" className="w-full p-3 ancient-input" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Ссылка на оплату</label>
            <input value={tbankLink} onChange={e => setTbankLink(e.target.value)}
              placeholder="https://t-qr.ru/..." className="w-full p-3 ancient-input" />
            <p className="text-xs hint-text mt-1">Пример: https://t-qr.ru/p.php?t=uzhnnbsxsskmmbm&n=vLadisLav&b=t-bank</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || !title}
            className="w-full py-3 btn-ancient text-sm"
          >
            {saving ? '⏳...' : isEdit ? '✏️ Сохранить шаблон' : '📋 Создать шаблон'}
          </button>
        </div>
      </div>
    </div>
  );
}
