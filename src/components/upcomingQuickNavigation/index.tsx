import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setEvents, addEvent, deleteEvent, EventData } from '../../redux/slice/upcomingSlice';
import EventModal from './EventModal';
import { CalendarWrapper, Container, Title, Dot, EventList, EventItem, AddButton, DeleteButton } from './UpcomingQuickNavigation.styles';
import { supabase } from '../../supabaseTest';

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const UpcomingQuickNavigation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector((state: RootState) => state.upcoming.events);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // 取得真實的 token
  useEffect(() => {
    const getToken = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      }
    };
    getToken();
  }, []);

  // fetch events
  useEffect(() => {
    if (!token) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/upcoming', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          console.error('Failed to fetch events:', res.status);
          return;
        }

        const data: Record<string, EventData[]> = await res.json();
        dispatch(setEvents(data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
  }, [dispatch, token]);

  const currentEvents = selectedDate ? (events[formatDate(selectedDate)] ?? []) : [];

  // 新增事件
  const handleAddEvent = async (title: string, note: string) => {
    if (!selectedDate || !token) return;
    const key = formatDate(selectedDate);

    try {
      const res = await fetch('http://localhost:3001/api/upcoming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, note, date: key })
      });

      const data = await res.json();
      const newEvent = data[0];

      // 如果後端沒回傳 id，就自己先用 timestamp 產生
      const eventWithId: EventData = {
        id: newEvent?.id || Date.now().toString(),
        title: newEvent.title,
        note: newEvent.description
      };

      dispatch(addEvent({ date: key, event: eventWithId }));
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 刪除事件
  const handleDeleteEvent = async (id: string, index: number) => {
    if (!token) return;
    const key = formatDate(selectedDate!);
    try {
      await fetch(`http://localhost:3001/api/upcoming/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(deleteEvent({ date: key, index }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Title>Calendar</Title>
      <CalendarWrapper>
        <Calendar onClickDay={setSelectedDate} tileContent={({ date }) => (events[formatDate(date)] ? <Dot /> : null)} value={selectedDate} />
      </CalendarWrapper>

      {selectedDate && (
        <EventList>
          <h3>Selected Date: {formatDate(selectedDate)}</h3>
          {currentEvents.length > 0 ? (
            currentEvents.map((event, i) => (
              <EventItem key={i}>
                <div className="info">
                  <strong>{event.title}</strong>
                  <p>{event.note}</p>
                </div>
                <DeleteButton onClick={() => handleDeleteEvent(event.id!, i)}>✕</DeleteButton>
              </EventItem>
            ))
          ) : (
            <p>No events</p>
          )}
          <AddButton onClick={() => setShowModal(true)}>＋ Add Event</AddButton>
        </EventList>
      )}

      {showModal && selectedDate && <EventModal date={selectedDate} onClose={() => setShowModal(false)} onAdd={handleAddEvent} />}
    </Container>
  );
};

export default UpcomingQuickNavigation;
