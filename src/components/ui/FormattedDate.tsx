export function FormattedDate({ date }: { date: string }) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return <>{formatDate(date)}</>;
}
