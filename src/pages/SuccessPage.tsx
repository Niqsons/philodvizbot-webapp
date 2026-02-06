import type { Event } from '../App';

interface Props {
  event: Event;
}

export default function SuccessPage({ event }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-xl font-bold text-telegram-text mb-2">
          Бронирование подтверждено!
        </h1>
        <p className="text-telegram-hint mb-4">
          Вы забронированы на мероприятие:
        </p>
        <div className="p-4 bg-telegram-secondary rounded-lg">
          <div className="font-medium text-telegram-text">{event.title}</div>
          <div className="text-telegram-hint text-sm mt-1">
            📅 {event.date}
          </div>
          <div className="text-telegram-hint text-sm">
            📍 {event.location}
          </div>
        </div>
      </div>
    </div>
  );
}
