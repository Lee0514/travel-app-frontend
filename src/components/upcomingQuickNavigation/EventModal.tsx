import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, SaveButton, CancelButton } from "./EventModal.styles";

interface Props {
  date: Date;
  onClose: () => void;
  onAdd: (title: string, note: string) => void;
}

const formatDateISO = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

const EventModal = ({ date, onClose, onAdd }: Props) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title, note);
      setTitle("");
      setNote("");
    }
  };

  return (
    <Modal>
      <h3>
        {t("calendar.addEvent")}: {formatDateISO(date)}
      </h3>
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
        <SaveButton onClick={handleSubmit}>{t("calendar.save")}</SaveButton>
        <CancelButton onClick={onClose}>{t("calendar.cancel")}</CancelButton>
      </div>
    </Modal>
  );
};

export default EventModal;