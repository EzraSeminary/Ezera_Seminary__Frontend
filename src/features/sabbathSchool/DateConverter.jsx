import PropTypes from "prop-types";
import { EthDateTime } from "ethiopian-calendar-date-converter";

const DateConverter = ({ gregorianDate }) => {
  const [day, month, year] = gregorianDate.split("/").map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return <div>Invalid date format: {gregorianDate}</div>;
  }
  const ethDateTime = EthDateTime.fromEuropeanDate(
    new Date(year, month - 1, day)
  );
  const ethiopianMonthNames = [
    "መስከረም",
    "ጥቅምት",
    "ህዳር",
    "ታህሳስ",
    "ጥር",
    "የካቲት",
    "መጋቢት",
    "ሚያዝያ",
    "ግንቦት",
    "ሰኔ",
    "ሐምሌ",
    "ነሃሴ",
    "ጳጉሚ",
  ];

  const ethiopianMonthName = ethiopianMonthNames[ethDateTime.month - 1];

  return (
    <div>
      <p>
        {ethiopianMonthName} {ethDateTime.date}
      </p>
    </div>
  );
};

DateConverter.propTypes = {
  gregorianDate: PropTypes.string.isRequired,
};

export default DateConverter;
