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

  .react-calendar__navigation__prev2-button,
  .react-calendar__navigation__prev-button,
  .react-calendar__navigation__next-button,
  .react-calendar__navigation__next2-button {
    border-radius: 10px;
    margin: 0.2rem 0.5rem;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
  }

  .react-calendar__navigation {
    display: flex;
  }
    
  .react-calendar__navigation__label {
    border-radius: 10px;
    margin: 0.2rem;
  }
`;

export const Container = styled.div`
  max-width: 30rem;
  margin: 1rem auto;
`;

export const Title = styled.h2`
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

export const Dot = styled.div`
  margin-top: 2px;
  width: 6px;
  height: 6px;
  background-color: #7b2e2e;
  border-radius: 50%;
  margin: 0 auto;
`;

export const EventList = styled.div`
  border-top: 1px solid #ccc;
  padding: 0.5rem;
`;

export const EventItem = styled.div`
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

export const AddButton = styled.button`
  margin-top: 1rem;
  padding: 0.4rem 0.8rem;
  background-color: #a1866f;
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
