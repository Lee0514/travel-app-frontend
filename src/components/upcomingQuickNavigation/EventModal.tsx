import React, { useState } from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

interface Props {
  date: Date
  onClose: () => void
  onAdd: (title: string, note: string) => void
}

const Modal = styled.div`
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ccc;
  padding: 1rem;
  z-index: 1000;
  width: 300px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  border-radius: 8px;

  input, textarea {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.4rem;
    font-size: 1rem;
  }

  button {
    margin-right: 0.5rem;
    margin-top: 1rem;
  }
`

const EventModal = ({ date, onClose, onAdd }: Props) => {
  const { t } = useTranslation()
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title, note)
      setTitle("")
      setNote("")
    }
  }

  return (
    <Modal>
      <h3>{t("calendar.addEvent")}: {date.toLocaleDateString()}</h3>
      <input
        placeholder={t("calendar.titlePlaceholder")}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder={t("calendar.notePlaceholder")}
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <div>
        <button onClick={handleSubmit}>{t("calendar.save")}</button>
        <button onClick={onClose}>{t("calendar.cancel")}</button>
      </div>
    </Modal>
  )
}

export default EventModal
