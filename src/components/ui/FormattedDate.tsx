import React from "react";

interface FormattedDateProps {
  date: string;
  className?: string;
}

export function FormattedDate({ date, className = "" }: FormattedDateProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return <span className={className}>{formatDate(date)}</span>;
}
