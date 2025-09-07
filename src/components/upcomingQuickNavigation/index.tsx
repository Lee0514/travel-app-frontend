import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import EventModal from './EventModal';
import 'react-calendar/dist/Calendar.css';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import { setEvents, addEvent, deleteEvent, EventData } from '../../redux/slice/upcomingSlice';
import {
  CalendarWrapper,
  Container,
  Title,
  Dot,
  EventList,
  EventItem,
  AddButton,
  DeleteButton
} from './UpcomingQuickNavigation.styles';

// 假資料
const mockEvents: Record<string, EventData[]> = {
  '2025-09-29': [{ title: 'Meet client', note: 'Zoom' }],
  '2025-09-30': [{ title: 'Travel to Tokyo', note: 'Morning flight' }]
};

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const UpcomingQuickNavigation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector((state: RootState) => state.upcoming.events);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);

  // fetch events from API
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchEvents = async () => {
      if (!token) {
        // 沒有 token 使用假資料
        dispatch(setEvents(mockEvents));
        return;
      }
      try {
        const response = await fetch('/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data: Record<string, EventData[]> = await response.json();
        dispatch(setEvents(data));
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };

    fetchEvents();
  }, [dispatch]);

  const currentEvents = selectedDate ? events[formatDate(selectedDate)] ?? [] : [];

  const handleAddEvent = (title: string, note: string) => {
    if (!selectedDate) return;
    const key = formatDate(selectedDate);
    dispatch(addEvent({ date: key, event: { title, note } }));
    setShowModal(false);
  };

  const handleDeleteEvent = (index: number) => {
    if (!selectedDate) return;
    const key = formatDate(selectedDate);
    dispatch(deleteEvent({ date: key, index }));
  };

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
                <DeleteButton
                  onClick={() => handleDeleteEvent(i)}
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

          <AddButton onClick={() => setShowModal(true)}>＋ {t('calendar.addEvent')}</AddButton>
        </EventList>
      )}

      {showModal && selectedDate && (
        <EventModal date={selectedDate} onClose={() => setShowModal(false)} onAdd={handleAddEvent} />
      )}
    </Container>
  );
};

export default UpcomingQuickNavigation;