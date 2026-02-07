import { useState, useRef, useEffect } from 'react';
import type { BookingData } from '../App';
import { apiHeaders } from '../App';
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

  const fullyPaidByCredit = booking.amountToPay <= 0;

  // Если полностью оплачено кредитами — сразу подтверждаем
  useEffect(() => {
    if (fullyPaidByCredit) {
      confirmWithCredit();
    }
  }, []);

  const confirmWithCredit = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      // Отправляем пустой файл-заглушку не нужно — 
      // но API требует receipt. Создаём текстовый blob.
      const blob = new Blob(['credit-payment'], { type: 'text/plain' });
      formData.append('receipt', blob, 'credit-payment.txt');

      const response = await fetch(`${apiUrl}/api/bookings/${booking.bookingId}/receipt`, {
        method: 'POST',
        headers: apiHeaders(),
        body: formData,
      });
      const data = await response.json();
      if (data.error) setError(data.error);
      else onReceiptUploaded();
    } catch {
      setError('Ошибка подтверждения');
    } finally {
      setUploading(false);
    }
  };

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
        headers: apiHeaders(),
        body: formData,
      });

      const data = await response.json();
      if (data.error) setError(data.error);
      else onReceiptUploaded();
    } catch {
      setError('Гермес не доставил послание...');
    } finally {
      setUploading(false);
    }
  };

  // Если полностью оплачено кредитом — показываем лоадер
  if (fullyPaidByCredit) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <Amphora className="w-16 h-24 text-[#C4A484] mb-4" />
        <p className="text-lg ancient-title">Оплачено кредитами!</p>
        <p className="hint-text text-sm mt-2">
          Списано {booking.creditUsed}₽ с баланса
        </p>
        {uploading && <p className="hint-text mt-4">⏳ Подтверждение...</p>}
        {error && <p className="text-[#722F37] mt-4">⚠️ {error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="flex justify-center mb-4">
        <Amphora className="w-16 h-24 text-[#C4A484]" />
      </div>

      <div className="text-center mb-6">
        <p className="hint-text text-sm mb-1">Дань за пиршество мудрости:</p>
        {booking.creditUsed > 0 ? (
          <>
            <p className="text-lg hint-text line-through">{booking.totalAmount} драхм</p>
            <p className="text-4xl font-bold wine-text">{booking.amountToPay}</p>
            <p className="text-lg hint-text">драхм (рублей)</p>
            <p className="text-sm text-[#6B8E23] mt-1">
              💰 Списано {booking.creditUsed}₽ с баланса
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl font-bold wine-text">{booking.totalAmount}</p>
            <p className="text-lg hint-text">драхм (рублей)</p>
          </>
        )}
      </div>

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

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-[#C4A484]"></div>
        <span className="hint-text text-sm italic">после подношения</span>
        <div className="flex-1 h-px bg-[#C4A484]"></div>
      </div>

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

      {error && (
        <div className="mb-4 p-3 bg-[#722F37] bg-opacity-20 border border-[#722F37] 
                        rounded text-[#722F37] text-sm text-center">
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-4 btn-ancient text-lg"
      >
        {uploading ? '⏳ Оракул думает...' : '✨ Завершить обряд'}
      </button>

      <div className="flex-grow"></div>
      <LaurelWreath className="w-40 h-10 mx-auto mt-6 text-[#6B8E23] opacity-50" />
    </div>
  );
}
