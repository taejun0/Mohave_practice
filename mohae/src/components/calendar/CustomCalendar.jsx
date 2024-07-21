import React, { useState } from "react";
import Calendar from 'react-calendar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSwipeable } from 'react-swipeable';

import * as S from "./Styled";

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStartDate, setNewEventStartDate] = useState(new Date());
  const [newEventEndDate, setNewEventEndDate] = useState(new Date());

  const [allDay, setAllDay] = useState(false);

  const [color, setColor] = useState('');
  const [availColor, setAvailColor] = useState([
    'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'
  ]);

  const [emoji, setEmoji] = useState('');
  const [emojiText, setEmojiText] = useState('');
  const [availEmoji, setAvailEmoji] = useState([
    '😀', '😄', '🤣', '😅', '😍', '😡', '🤬'
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newEventCategory, setNewEventCategory] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEmojiForm, setShowEmojiForm] = useState(false);
  const [dateEmojis, setDateEmojis] = useState({});

  const addEvent = () => {
    let startDate = new Date(newEventStartDate);
    let endDate = new Date(newEventEndDate);

    if (!allDay) {
      startDate.setHours(newEventStartDate.getHours(), newEventStartDate.getMinutes());
      endDate.setHours(newEventEndDate.getHours(), newEventEndDate.getMinutes());
    }

    if (endDate < startDate) {
      endDate = startDate;
    }

    // 시작날짜를 하루 안빼면 이상해지더라고요.. 나중에 고칠게요
    startDate.setDate(startDate.getDate() - 1);

    const eventColor = categories.find(cat => cat.name === newEventCategory)?.color || color;

    setEvents([...events, {
      start: startDate,
      end: endDate,
      title: newEventTitle,
      allDay,
      category: newEventCategory,
      color: eventColor,
    }]);

    if (!categories.some(category => category.name === newEventCategory)) {
      setCategories([...categories, { name: newEventCategory, color: eventColor }]);
    }

    setNewEventTitle('');
    setNewEventStartDate(new Date());
    setNewEventEndDate(new Date());
    setNewEventCategory('');
    setColor('');
    setShowForm(false);
    setShowEmojiForm(false);
  };

  const addEmojiToDate = () => {
    const dateString = selectedDate.toDateString();
    setDateEmojis({
      ...dateEmojis,
      [dateString]: [...(dateEmojis[dateString] || []), { emoji, emojiText }],
    });
    setEmoji('');
    setEmojiText('');
    setShowEmojiForm(false);
  };

  const renderEvents = (date) => {
    return events
      .filter(event => date >= event.start && date <= event.end)
      .map((event, index) => (
        <div key={index} style={{ backgroundColor: event.color }}>
          {event.category} : {event.title}
        </div>
      ));
  };

  const renderEmojis = (date) => {
    const dateString = date.toDateString();
    const emojisForDate = dateEmojis[dateString] || [];
    return emojisForDate.map((item, idx) => (
      <div key={idx}>
        <span>{item.emoji}</span> {item.emojiText}
      </div>
    ));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setDate(new Date(date.setMonth(date.getMonth() + 1))),
    onSwipedRight: () => setDate(new Date(date.setMonth(date.getMonth() - 1))),
  });

  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find(category => category.name === e.target.value);
    if (selectedCategory) {
      setNewEventCategory(selectedCategory.name);
      setColor(selectedCategory.color);
    } else {
      setNewEventCategory(e.target.value);
      setColor('');
    }
  };

  const CloseAddForm = () => {
    setShowForm(false);
  };

  const CloseEmojiForm = () => {
    setShowEmojiForm(false);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const event = events.find(event => date >= event.start && date <= event.end);
    setSelectedEvent(event || { start: date, end: date, title: '', allDay: false, category: '', color: '' });
    setShowDetails(true);
  };

  const CloseDetails = () => {
    setShowDetails(false);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setNewEventStartDate(today);
    setNewEventEndDate(today);
  };

  return (
    <S.Main {...swipeHandlers}>
      <S.Body>
        <h1>일정 관리 캘린더</h1>
        <S.CalendarContainer>
          <S.CalendarHeader>
            <S.TodayButton onClick={handleTodayClick}>오늘</S.TodayButton>
            <S.AddEventButton onClick={() => setShowForm(!showForm)}>+</S.AddEventButton>
          </S.CalendarHeader>
          <S.CustomCalendar>
            <Calendar
              value={date}
              onClickDay={handleDateClick}
              tileContent={({ date }) => (
                <>
                  {renderEvents(date)}
                  {renderEmojis(date)}
                </>
              )}
              prevLabel="<"
              nextLabel=">"
              prev2Label="<<"
              next2Label=">>"
            />
          </S.CustomCalendar>
        </S.CalendarContainer>
        {showDetails && selectedDate && (
          <S.EventDetails>
            <S.CloseButton onClick={CloseDetails}>X</S.CloseButton>
            <button onClick={() => setShowEmojiForm(!showEmojiForm)}>+</button>
            <h2>{`${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`}</h2>
            <div style={{ backgroundColor: selectedEvent.color }}>
              {selectedEvent.category ? `${selectedEvent.category} : ` : ''} {selectedEvent.title || '이벤트 없음'}
            </div>
            <div>
              {dateEmojis[selectedDate.toDateString()]?.length === 0 ? '이모지 없음' : dateEmojis[selectedDate.toDateString()]?.map((item, idx) => (
                <div key={idx}>
                  <span>{item.emoji}</span> {item.emojiText}
                </div>
              ))}
            </div>
          </S.EventDetails>
        )}
        {showEmojiForm && (
          <S.NewEventForm>
            <S.CloseButton onClick={CloseEmojiForm}>X</S.CloseButton>
            <S.FormContent>
              <h2>오늘모했어?</h2>
              <S.EventContainer>
                <select value={emoji} onChange={(e) => setEmoji(e.target.value)}>
                  <option value="">이모지 선택</option>
                  {availEmoji.map((emoji, index) => (
                    <option key={index} value={emoji}>
                      {emoji}
                    </option>
                  ))}
                </select>
                <textarea
                  value={emojiText}
                  onChange={(e) => setEmojiText(e.target.value)}
                  placeholder="오늘의 기분"
                />
                <S.AddButton onClick={addEmojiToDate}>추가</S.AddButton>
              </S.EventContainer>
            </S.FormContent>
          </S.NewEventForm>
        )}
        {showForm && (
          <S.NewEventForm>
            <S.CloseButton onClick={CloseAddForm}>X</S.CloseButton>
            <S.FormContent>
              <h2>새 일정 추가</h2>
              <div>
                <label>하루종일:</label>
                <input 
                  type="checkbox" 
                  checked={allDay} 
                  onChange={(e) => setAllDay(e.target.checked)} 
                />
              </div>
              <S.EventContainer>
                {allDay && (
                  <>
                    <label>시작 날짜:</label>
                    <DatePicker
                      selected={newEventStartDate}
                      onChange={(date) => setNewEventStartDate(date)}
                      dateFormat="yyyy/MM/dd"
                    />
                  </>
                )}
                {!allDay && (
                  <>
                    <label>시작 날짜:</label>
                    <DatePicker
                      selected={newEventStartDate}
                      onChange={(date) => setNewEventStartDate(date)}
                      showTimeSelect
                      timeFormat="aa hh:mm"
                      timeIntervals={1}
                      dateFormat="yyyy/MM/dd aa h:mm"
                      timeCaption="time"
                    />
                  </>
                )}
              </S.EventContainer>
              <S.EventContainer>
                {allDay && (
                  <>
                    <label>종료 날짜:</label>
                    <DatePicker
                      selected={newEventEndDate}
                      onChange={(date) => setNewEventEndDate(date)}
                      dateFormat="yyyy/MM/dd"
                    />
                  </>
                )}
                {!allDay && (
                  <>
                    <label>종료 날짜:</label>
                    <DatePicker
                      selected={newEventEndDate}
                      onChange={(date) => setNewEventEndDate(date)}
                      showTimeSelect
                      timeFormat="aa hh:mm"
                      timeIntervals={1}
                      dateFormat="yyyy/MM/dd aa h:mm"
                      timeCaption="time"
                    />
                  </>
                )}
              </S.EventContainer>
              <div>
                <label>일정 제목:</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="일정 제목"
                />
              </div>
              <div>
                <label>누가?:</label>
                <select value={newEventCategory} onChange={handleCategoryChange}>
                  <option value="">새로운 사람</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.name}>{category.name}</option>
                  ))}
                </select>
                {!categories.some(category => category.name === newEventCategory) && (
                  <>
                    <input
                      type="text"
                      value={newEventCategory}
                      onChange={(e) => setNewEventCategory(e.target.value)}
                      placeholder="새 분야"
                    />
                  </>
                )}
                {!categories.some(category => category.name === newEventCategory) && (
                  <>
                    <select 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}>
                      <option value="">색상 선택</option>
                      {availColor.filter(c => !events.some(event => event.color === c)).map((color, index) => (
                        <option key={index} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </>
                )}  
              </div>
              <S.AddButton onClick={addEvent}>추가</S.AddButton>
            </S.FormContent>
          </S.NewEventForm>
        )}
      </S.Body>
    </S.Main>
  );
}

export default CustomCalendar;


