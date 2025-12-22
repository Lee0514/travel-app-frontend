import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EventData {
  id: string;
  title: string;
  note: string;
}

interface UpcomingState {
  events: Record<string, EventData[]>;
}

const initialState: UpcomingState = {
  events: {}
};

const upcomingSlice = createSlice({
  name: 'upcoming',
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<Record<string, EventData[]>>) {
      state.events = action.payload;
    },
    addEvent(
      state,
      action: PayloadAction<{ date: string; event: EventData }>
    ) {
      const { date, event } = action.payload;
      if (!state.events[date]) state.events[date] = [];
      state.events[date].push(event);
    },
    deleteEvent(
      state,
      action: PayloadAction<{ date: string; index: number }>
    ) {
      const { date, index } = action.payload;
      if (!state.events[date]) return;
      state.events[date].splice(index, 1);
      if (state.events[date].length === 0) delete state.events[date];
    }
  }
});

export const { setEvents, addEvent, deleteEvent } = upcomingSlice.actions;
export default upcomingSlice.reducer;