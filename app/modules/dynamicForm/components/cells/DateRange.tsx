import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { DateRangeValue } from "../../types";
import { Calendar } from "primereact/calendar";
import { FormEvent, useRef } from "react";
import { asyncTimeout } from "@/app/modules/utils/global";

type DateRangeProps = {
  value?: DateRangeValue;
  onChange: (v: DateRangeValue) => void;
  id: string;
  alignement?: "vertical" | "horizontal";
  invalid?: boolean;
  disabled?: boolean;
  toLabel?: string;
  fromLabel?: string;
  inputClassName: string;
  touchUI?: boolean;
};

function DateRange({
  value,
  onChange,
  alignement = "horizontal",
  id,
  invalid,
  disabled,
  toLabel,
  fromLabel,
  inputClassName,
  touchUI,
}: DateRangeProps) {
  const handleChange = (key: "to" | "from") => (evt: any) => {
    const delayMs =
      key === "from" && value?.to
        ? new Date(value?.to).getTime() - new Date(evt.value).getTime()
        : key === "to" && value?.from
        ? new Date(evt.value ?? 0).getTime() - new Date(value?.from).getTime()
        : 0;
    if (!value) {
      const DEFAULT_NUMBER_RANGE_VALUE: DateRangeValue = {
        from: undefined,
        to: undefined,
        delayMs: 0,
      };
      onChange({
        ...DEFAULT_NUMBER_RANGE_VALUE,
        [key]: evt.value,
        delayMs,
      });
      return;
    }
    onChange({ ...value, [key]: evt.value, delayMs });
  };

  // False focus
  const calendarRef = useRef<any>();
  const handleFalseFocus = async () => {
    // await asyncTimeout(500);
    // calendarRef.current?.focus();
  };
  return (
    <div
      className={`w-full grid gap-2 relative ${
        alignement === "vertical" ? "grid-cols-1" : "grid-cols-2"
      }`}
    >
      {/* This input is created for preventing the calendar to autofocus */}
      <input
        type="text"
        className="outline-none"
        readOnly
        style={{ zIndex: -1, position: "absolute", top: 0, left: 0 }}
        onFocus={handleFalseFocus}
      />
      <div className="col-span-1">
        <div className="p-inputgroup flex-1">
          {fromLabel && <span className="p-inputgroup-addon">{fromLabel}</span>}
          <Calendar
            inputId={`from-${id}`}
            disabled={disabled}
            className="w-full"
            inputClassName={`${inputClassName} ${invalid ? "p-invalid" : ""}`}
            maxDate={value?.to || undefined}
            value={value?.from}
            onChange={handleChange("from")}
            dateFormat="dd/mm/yy"
            touchUI={touchUI}
            ref={calendarRef}
          />
        </div>
      </div>
      <div className="col-span-1">
        <div className="p-inputgroup flex-1">
          {toLabel && <span className="p-inputgroup-addon">{toLabel}</span>}
          <Calendar
            inputId={`to-${id}`}
            disabled={disabled}
            className="w-full"
            inputClassName={`${inputClassName} ${invalid ? "p-invalid" : ""}`}
            minDate={value?.from || undefined}
            value={value?.to}
            onChange={handleChange("to")}
            dateFormat="dd/mm/yy"
            touchUI={touchUI}
          />
        </div>
      </div>
    </div>
  );
}

export default DateRange;

