import React, { useState, useEffect } from 'react';
import './MoodDiary.css';

// Компонент мини-дневника настроения
const MoodDiary = () => {
  // Состояние для хранения записей настроения
  const [moodEntries, setMoodEntries] = useState([]);
  // Текущее выбранное настроение
  const [selectedMood, setSelectedMood] = useState(null);
  // Заметка к настроению
  const [note, setNote] = useState('');

  // Варианты настроений с emoji
  const moods = [
    { emoji: '😊', name: 'Радость', color: '#FFD700' },
    { emoji: '😢', name: 'Грусть', color: '#4A90E2' },
    { emoji: '😴', name: 'Усталость', color: '#9B9B9B' },
    { emoji: '😡', name: 'Злость', color: '#FF6B6B' },
    { emoji: '😌', name: 'Спокойствие', color: '#98D8C8' },
    { emoji: '🤩', name: 'Восторг', color: '#FF69B4' },
    { emoji: '😰', name: 'Тревога', color: '#FFA500' },
    { emoji: '🤔', name: 'Задумчивость', color: '#B19CD9' }
  ];

  // Загрузка записей из localStorage при монтировании компонента
  useEffect(() => {
    const saved = localStorage.getItem('moodEntries');
    if (saved) {
      setMoodEntries(JSON.parse(saved));
    }
  }, []);

  // Сохранение записи настроения
  const saveMood = () => {
    if (!selectedMood) return;

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      note: note,
      date: new Date().toLocaleDateString('ru-RU'),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newEntry, ...moodEntries];
    setMoodEntries(updated);
    localStorage.setItem('moodEntries', JSON.stringify(updated));

    // Сброс формы
    setSelectedMood(null);
    setNote('');
  };

  // Удаление записи
  const deleteEntry = (id) => {
    const updated = moodEntries.filter(entry => entry.id !== id);
    setMoodEntries(updated);
    localStorage.setItem('moodEntries', JSON.stringify(updated));
  };

  return (
    <div className="mood-diary">
      <div className="container">
        {/* Заголовок */}
        <header className="header">
          <h1 className="title">📔 Дневник настроения</h1>
          <p className="subtitle">Как вы себя чувствуете сегодня?</p>
        </header>

        {/* Выбор настроения */}
        <div className="mood-selector">
          <div className="moods-grid">
            {moods.map((mood) => (
              <button
                key={mood.name}
                className={`mood-button ${selectedMood?.name === mood.name ? 'selected' : ''}`}
                onClick={() => setSelectedMood(mood)}
                style={{
                  '--mood-color': mood.color
                }}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-name">{mood.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Форма заметки */}
        {selectedMood && (
          <div className="note-section">
            <textarea
              className="note-input"
              placeholder="Добавьте заметку о вашем настроении (необязательно)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
            />
            <button className="save-button" onClick={saveMood}>
              Сохранить запись
            </button>
          </div>
        )}

        {/* История записей */}
        {moodEntries.length > 0 && (
          <div className="history-section">
            <h2 className="history-title">История записей</h2>
            <div className="entries-list">
              {moodEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="entry-card"
                  style={{ '--entry-color': entry.mood.color }}
                >
                  <div className="entry-header">
                    <div className="entry-mood">
                      <span className="entry-emoji">{entry.mood.emoji}</span>
                      <span className="entry-mood-name">{entry.mood.name}</span>
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="entry-datetime">
                    {entry.date} в {entry.time}
                  </div>
                  {entry.note && (
                    <div className="entry-note">{entry.note}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Пустое состояние */}
        {moodEntries.length === 0 && (
          <div className="empty-state">
            <div className="empty-emoji">📝</div>
            <p>Пока нет записей. Выберите настроение, чтобы начать!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodDiary;
