import { useState, useRef } from 'react';
import type { BookingData } from '../App';
import { Amphora, LaurelWreath } from '../components/AncientElements';

interface Props {
  booking: BookingData;
  apiUrl: string;
  onReceiptUploaded: () => void;
}

export default function PaymentPage({ booking, apiUrl, onReceiptUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Приложи свиток с подтверждением!');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await fetch(`${apiUrl}/api/bookings/${booking.bookingId}/receipt`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        onReceiptUploaded();
      }
    } catch (e) {
      setError('Гермес не доставил послание...');
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Декоративный элемент */}
      <div className="flex justify-center mb-4">
        <Amphora className="w-16 h-24 text-[#C4A484]" />
      </div>

      {/* Сумма */}
      <div className="text-center mb-6">
        <p className="hint-text text-sm mb-1">Дань за пиршество мудрости:</p>
        <p className="text-4xl font-bold wine-text">{booking.totalAmount}</p>
        <p className="text-lg hint-text">драхм (рублей)</p>
      </div>

      {/* Ссылка на оплату */}
      <div className="marble-card p-4 mb-6">
        <p className="text-center hint-text mb-3 text-sm">
          Соверши подношение через T-Bank:
        </p>
        <a
          href={booking.tbankLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-[#FFDD2D] text-black font-bold 
                     rounded text-center border-2 border-[#5D4E37]
                     hover:bg-[#FFE44D] transition-colors"
        >
          🏦 Открыть врата T-Bank
        </a>
      </div>

      {/* Разделитель */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-[#C4A484]"></div>
        <span className="hint-text text-sm italic">после подношения</span>
        <div className="flex-1 h-px bg-[#C4A484]"></div>
      </div>

      {/* Загрузка чека */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 marble-card flex items-center justify-center gap-2
                     hover:border-[#5D4E37] transition-colors cursor-pointer"
        >
          📜 {file ? file.name : 'Приложить свиток (чек)'}
        </button>
        <p className="hint-text text-xs text-center mt-2 italic">
          Изображение или PDF подтверждения
        </p>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="mb-4 p-3 bg-[#722F37] bg-opacity-20 border border-[#722F37] 
                        rounded text-[#722F37] text-sm text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Кнопка подтверждения */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-4 btn-ancient text-lg"
      >
        {uploading ? '⏳ Оракул думает...' : '✨ Завершить обряд'}
      </button>

      {/* Лавровый венок внизу */}
      <div className="flex-grow"></div>
      <LaurelWreath className="w-40 h-10 mx-auto mt-6 text-[#6B8E23] opacity-50" />
    </div>
  );
}
