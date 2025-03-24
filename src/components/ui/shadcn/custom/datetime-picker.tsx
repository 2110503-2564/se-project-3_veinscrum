import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/custom/popover-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/shadcn/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";

interface DateTimePicker24hProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  format?: string;
  className?: string;
  minuteStep?: number;
}

export function DateTimePicker24h({
  value,
  onChange,
  placeholder = "MM/DD/YYYY hh:mm",
  format: dateFormat = "d MMM yyyy HH:mm",
  className,
  minuteStep = 5,
}: DateTimePicker24hProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from(
    { length: 60 / minuteStep },
    (_, i) => i * minuteStep,
  );

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Preserve current time when selecting a new date
      if (date) {
        selectedDate.setHours(date.getHours(), date.getMinutes());
      }

      setDate(selectedDate);
      onChange?.(selectedDate);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute",
    value: number,
    e: React.MouseEvent,
  ) => {
    // Prevent the event from bubbling up and triggering form submission
    e.preventDefault();

    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(value);
      } else if (type === "minute") {
        newDate.setMinutes(value);
      }
      setDate(newDate);
      onChange?.(newDate);
    } else {
      // Create a new date if none exists
      const newDate = new Date();
      if (type === "hour") {
        newDate.setHours(value);
      } else if (type === "minute") {
        newDate.setMinutes(value);
      }
      setDate(newDate);
      onChange?.(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col sm:flex-row">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() === hour ? "default" : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={(e) => handleTimeChange("hour", hour, e)}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {minutes.reverse().map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={(e) => handleTimeChange("minute", minute, e)}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
