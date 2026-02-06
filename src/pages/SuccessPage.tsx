import type { Event } from '../App';
import { Diogenes, LaurelWreath, Column } from '../components/AncientElements';

interface Props {
  event: Event;
}

export default function SuccessPage({ event }: Props) {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Декоративные колонны */}
      <Column className="absolute left-4 top-0 h-full w-10 text-[#C4A484] opacity-20" />
      <Column className="absolute right-4 top-0 h-full w-10 text-[#C4A484] opacity-20" />
      
      <div className="relative z-10 text-center max-w-sm">
        {/* Диоген радуется */}
        <Diogenes className="w-28 h-32 mx-auto mb-4" />
        
        {/* Лавровый венок */}
        <LaurelWreath className="w-48 h-12 mx-auto text-[#6B8E23] mb-2" />
        
        {/* Заголовок */}
        <h1 className="text-2xl ancient-title mb-2">
          Добро пожаловать, мудрец!
        </h1>
        
        <p className="hint-text mb-6 italic">
          Твоё место на симпосии забронировано
        </p>

        {/* Информация */}
        <div className="marble-card p-5">
          <h2 className="font-bold text-lg mb-3 wine-text">{event.title}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="gold-accent">📅</span>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="gold-accent">🏛</span>
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Цитата */}
        <p className="mt-6 text-sm hint-text italic">
          "Человеку нужна бочка и философия,<br/>
          остальное — суета"
        </p>
        <p className="text-xs hint-text mt-1">— Диоген Синопский</p>
      </div>
    </div>
  );
}
