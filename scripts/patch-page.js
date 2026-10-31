const fs = require('fs');
const path = 'd:/Salih KAVAKCI/FinAi/FinAl/final-web/src/app/dashboard/economic-calendar/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes('AddToCalendarWidget')) {
  content = content.replace(
    'import IndicatorHistoryBarChart from "@/components/calendar/IndicatorHistoryBarChart";',
    'import IndicatorHistoryBarChart from "@/components/calendar/IndicatorHistoryBarChart";\r\nimport AddToCalendarWidget from "@/components/calendar/AddToCalendarWidget";'
  );
}

// 2. Add AddToCalendarWidget next to date in header
const searchStr = '<h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#00008B] tracking-tight leading-tight">';
const targetBlock = `<div className="w-full pt-1 pb-2 space-y-3">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#00008B] tracking-tight leading-tight">
                        {event.event}
                    </h1>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
                        <div className="flex items-center text-xs font-bold text-slate-500">
                            <span className="inline-flex items-center gap-1.5 text-slate-500 font-bold">
                                <CalendarIcon className="w-4 h-4 text-[#00008B]" /> {event.dateFormatted || 'Bugün'} · {event.time} TSİ
                            </span>
                        </div>
                        <AddToCalendarWidget event={event} />
                    </div>
                </div>`;

const oldBlockRegex = /<div className="w-full pt-1 pb-2 space-y-2">[\s\S]*?<\/h1>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

if (oldBlockRegex.test(content)) {
  content = content.replace(oldBlockRegex, targetBlock);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully updated page.tsx with AddToCalendarWidget');
} else {
  console.log('Regex did not match');
}
