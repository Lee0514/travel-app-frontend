import { useState } from 'react';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import EventModal from './EventModal';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;

  .react-calendar {
    border-radius: 5%;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
    border: 1px solid #ddd;
  }

  .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }

  .react-calendar__tile:not(.react-calendar__month-view__days__day--weekend) {
    color: #333;
  }

  .react-calendar__tile:hover {
    background: #f0f0f0;
    color: #888;
    font-weight: 600;
  }
  .react-calendar__tile--active,
  .react-calendar__tile--active:focus,
  .react-calendar__tile--active:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    background: #555 !important;
    color: white !important;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile--hover {
    background-color: transparent;
    color: inherit;
    font-weight: normal;
  }
  .react-calendar__tile--now {
    background: #d3d3d3;
  }
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    border-bottom: none;
  }
`;

const Container = styled.div`
  max-width: 30rem;
  margin: 1rem auto;
`;

const Title = styled.h2`
  display: flex;
  justify-content: center;
  margin: 0.5rem;
  font-weight: 600;
  color: #666;
  svg {
    margin-right: 0.5rem;
    color: #222;
  }
`;

const Dot = styled.div`
  margin-top: 2px;
  width: 6px;
  height: 6px;
  background-color: #7b2e2e;
  border-radius: 50%;
  margin: 0 auto;
`;

const EventList = styled.div`
  border-top: 1px solid #ccc;
  padding: 0.5rem;
`;

const EventItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #eee;
  color: #444;
  &:last-child {
    border-bottom: none;
  }
  div.info {
    flex-grow: 1;
    strong {
      display: block;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    p {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
    }
  }
`;

const AddButton = styled.button`
  margin-top: 1rem;
  padding: 0.4rem 0.8rem;
  background-color: #a1866f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #c0392b;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.2rem;
  padding: 0 0.5rem;
  &:hover {
    color: #e74c3c;
  }
`;

interface EventData {
  title: string;
  note: string;
}

const mockEvents: Record<string, EventData[]> = {
  '2025-07-30': [{ title: 'Meet client', note: 'Zoom' }],
  '2025-07-31': [{ title: 'Travel to Tokyo', note: 'Morning flight' }]
};

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const UpcomingQuickNavigation = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState(mockEvents);
  const [showModal, setShowModal] = useState(false);

  const handleAddEvent = (title: string, note: string) => {
    if (!selectedDate) return;
    const key = formatDate(selectedDate);
    setEvents((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { title, note }]
    }));
    setShowModal(false);
  };

  const handleDeleteEvent = (index: number) => {
    if (!selectedDate) return;
    const key = formatDate(selectedDate);
    setEvents((prev) => {
      const updatedEvents = prev[key].filter((_, idx) => idx !== index);
      if (updatedEvents.length === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      } else {
        return {
          ...prev,
          [key]: updatedEvents
        };
      }
    });
  };

  const currentEvents = selectedDate ? (events[formatDate(selectedDate)] ?? []) : [];

  return (
    <Container>
      <Title>〖{t('calendar.title')}〗</Title>
      <CalendarWrapper>
        <Calendar
          onClickDay={setSelectedDate}
          tileContent={({ date }) => (events[formatDate(date)] ? <Dot title={t('calendar.hasEvent')} /> : null)}
          locale={t('calendar.locale', { defaultValue: 'en-US' })}
          value={selectedDate}
        />
      </CalendarWrapper>

      {selectedDate && (
        <EventList>
          <h3>
            {t('calendar.selectedDate')}: {formatDate(selectedDate)}
          </h3>

          {currentEvents.length > 0 ? (
            currentEvents.map((event, i) => (
              <EventItem key={i}>
                <div className="info">
                  <strong>{event.title}</strong>
                  <p>{event.note}</p>
                </div>
                <DeleteButton onClick={() => handleDeleteEvent(i)} aria-label={t('calendar.deleteEvent')} title={t('calendar.deleteEvent')}>
                  ✕
                </DeleteButton>
              </EventItem>
            ))
          ) : (
            <p>{t('calendar.noEvents')}</p>
          )}

          <AddButton onClick={() => setShowModal(true)}>＋ {t('calendar.addEvent')}</AddButton>
        </EventList>
      )}

      {showModal && selectedDate && <EventModal date={selectedDate} onClose={() => setShowModal(false)} onAdd={handleAddEvent} />}
    </Container>
  );
};

export default UpcomingQuickNavigation;
