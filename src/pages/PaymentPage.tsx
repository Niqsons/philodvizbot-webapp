import { useState, useRef } from 'react';
import type { Event, BookingData } from '../App';

interface Props {
  booking: BookingData;
  event: Event;
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
      setError('Выберите файл чека');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await fetch(`${apiUrl}/api/bookings/${booking.bookingId}/receipt`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        onReceiptUploaded();
      }
    } catch (e) {
      setError('Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="p-4">
      {/* Сумма к оплате */}
      <div className="text-center mb-6">
        <div className="text-telegram-hint text-sm mb-1">К оплате:</div>
        <div className="text-3xl font-bold text-telegram-text">{booking.totalAmount} ₽</div>
      </div>

      {/* Ссылка на оплату */}
      <div className="mb-6">
        <a
          href={booking.tbankLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-yellow-400 text-black font-medium 
                     rounded-lg text-center"
        >
          🏦 Перевести через T-Bank
        </a>
        <p className="text-telegram-hint text-xs text-center mt-2">
          Нажмите, чтобы открыть приложение T-Bank
        </p>
      </div>

      {/* Разделитель */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-telegram-secondary"></div>
        <span className="text-telegram-hint text-sm">После оплаты</span>
        <div className="flex-1 h-px bg-telegram-secondary"></div>
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
          className="w-full py-4 bg-telegram-secondary text-telegram-text 
                     rounded-lg flex items-center justify-center gap-2"
        >
          📎 {file ? file.name : 'Прикрепить чек'}
        </button>
        <p className="text-telegram-hint text-xs text-center mt-2">
          Загрузите скриншот или PDF чека
        </p>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Кнопка завершения */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-4 bg-telegram-button text-telegram-buttonText 
                   font-medium rounded-lg disabled:opacity-50"
      >
        {uploading ? 'Загрузка...' : '✅ Завершить бронирование'}
      </button>
    </div>
  );
}
