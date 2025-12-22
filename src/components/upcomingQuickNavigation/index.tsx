import { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import EventModal from './EventModal';
import 'react-calendar/dist/Calendar.css';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import { setEvents, addEvent, deleteEvent, EventData } from '../../redux/slice/upcomingSlice';
import { CalendarWrapper, Container, Title, Dot, EventList, EventItem, AddButton, DeleteButton } from './UpcomingQuickNavigation.styles';

const formatDate = (date: Date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

const UpcomingQuickNavigation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector((state: RootState) => state.upcoming.events);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('accessToken');
  const backendUrl = import.meta.env.VITE_BACKEND_DEVELOP_URL;

  // 取得行程
  const fetchEvents = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/upcoming`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      const data: Record<string, EventData[]> = await res.json();
      dispatch(setEvents(data));
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  }, [backendUrl, token, dispatch]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const currentEvents = selectedDate ? (events[formatDate(selectedDate)] ?? []) : [];

  // 新增事件
  const handleAddEvent = async (title: string, note: string) => {
    if (!selectedDate) return;
    const dateStr = formatDate(selectedDate);

    try {
      if (token) {
        const res = await fetch(`${backendUrl}/upcoming`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title, note, date: dateStr })
        });
        if (!res.ok) throw new Error(await res.text());
        const [savedEvent] = await res.json();
        dispatch(addEvent({ date: dateStr, event: { ...savedEvent, title: savedEvent.title, note: savedEvent.description || '' } }));
      }
      setShowModal(false);
    } catch (err) {
      console.error('Failed to add event:', err);
    }
  };

  // 刪除事件
  const handleDeleteEvent = async (eventId: string, index: number) => {
    try {
      if (token && eventId) {
        const res = await fetch(`${backendUrl}/upcoming/${eventId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
      }
      if (selectedDate) dispatch(deleteEvent({ date: formatDate(selectedDate), index }));
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  return (
    <Container>
      <Title>〖{t('calendar.title')}〗</Title>

      <CalendarWrapper>
        <Calendar
          onClickDay={setSelectedDate}
          value={selectedDate}
          tileContent={({ date }) => (events[formatDate(date)] ? <Dot title={t('calendar.hasEvent')} /> : null)}
          locale={t('calendar.locale', { defaultValue: 'en-US' })}
        />
      </CalendarWrapper>

      {selectedDate && (
        <EventList>
          <h3>
            {t('calendar.selectedDate')}: {formatDate(selectedDate)}
          </h3>

          {currentEvents.length > 0 ? (
            currentEvents.map((event, i) => (
              <EventItem key={event.id || i}>
                <div className="info">
                  <strong>{event.title}</strong>
                  <p>{event.note}</p>
                </div>
                <DeleteButton onClick={() => handleDeleteEvent(event.id!, i)} aria-label={t('calendar.deleteEvent')} title={t('calendar.deleteEvent')}>
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
