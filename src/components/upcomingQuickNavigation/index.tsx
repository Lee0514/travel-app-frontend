import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import EventModal from './EventModal';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

export const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;

  .react-calendar {
    border-radius: 5%;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
    border: 1px solid #ddd;
  }
`;

export const Container = styled.div`
  max-width: 30rem;
  margin: 0 auto;
`;

export const Title = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #666;

  svg {
    margin-right: 0.5rem;
    color: #222;
  }
`;

export const Dot = styled.div`
  margin-top: 2px;
  width: 6px;
  height: 6px;
  background-color: #007bff;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
`;

export const EventList = styled.div`
  margin-top: 1rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
`;

export const EventItem = styled.div`
  display: flex;
  align-items: center;
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

export const AddButton = styled.button`
  margin-top: 1rem;
  padding: 0.4rem 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
`;

export const DeleteButton = styled.button`
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
  '2025-07-29': [{ title: 'Meet client', note: 'Zoom' }],
  '2025-07-30': [{ title: 'Travel to Tokyo', note: 'Morning flight' }]
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const Upcoming = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState(mockEvents);
  const [showModal, setShowModal] = useState(false);

  const handleClickDay = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = (title: string, note: string) => {
    if (!selectedDate) return;
    const key = formatDate(selectedDate);
    setEvents((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { title, note }]
    }));
    setShowModal(false);
  };

  const currentEvents = selectedDate && events[formatDate(selectedDate)];

  return (
    <Container>
      <Title>
        {t('calendar.title')}
      </Title>
      <CalendarWrapper>
        <Calendar
          onClickDay={handleClickDay}
          tileContent={({ date }) => {
            const key = formatDate(date);
            return events[key] ? <Dot title={t('calendar.hasEvent')} /> : null;
          }}
          locale={t('calendar.locale', { defaultValue: 'en-US' })}
        />
      </CalendarWrapper>

      {selectedDate && (
        <EventList>
          <h3>
            {t('calendar.selectedDate')}: {formatDate(selectedDate)}
          </h3>
          {currentEvents && currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <EventItem key={index}>
                <div className="info">
                  <strong>{event.title}</strong>
                  <p>{event.note}</p>
                </div>
                <DeleteButton
                  onClick={() => {
                    if (!selectedDate) return;
                    const key = formatDate(selectedDate);
                    setEvents((prev) => {
                      const updatedEvents = prev[key].filter((_, i) => i !== index);
                      return {
                        ...prev,
                        [key]: updatedEvents
                      };
                    });
                  }}
                  aria-label={t('calendar.deleteEvent')}
                  title={t('calendar.deleteEvent')}
                >
                  ✕
                </DeleteButton>
              </EventItem>
            ))
          ) : (
            <p>{t('calendar.noEvents')}</p>
          )}
          <AddButton onClick={() => setShowModal(true)}>➕ {t('calendar.addEvent')}</AddButton>
        </EventList>
      )}

      {showModal && selectedDate && <EventModal date={selectedDate} onClose={() => setShowModal(false)} onAdd={handleAddEvent} />}
    </Container>
  );
};

export default Upcoming;
