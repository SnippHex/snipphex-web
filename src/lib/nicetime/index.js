const thresholds = {
  ss: 44,
  m : 45,
  h : 22,
  d : 26,
  M : 11
};

const format = {
  s: 'a few seconds ago',
  ss: '%d seconds ago',
  m: 'a minute ago',
  mm: '%d minutes ago',
  h: 'an hour ago',
  hh: '%d hours ago',
  d: 'a day ago',
  dd: '%d days ago',
  M: 'a month ago',
  MM: '%d months ago',
  y: 'a year go',
  YY: '%d years ago'
};

export default function nicetime(from, to) {
  to = to || new Date().getTime();
  if (from instanceof Date) {
    from = from.getTime();
  }

  const d = to - from;
  const r = Math.round;
  const seconds = r(d / 1000);
  const minutes = r(seconds / 60);
  const hours = r(minutes / 60);
  const days = r(hours / 24);
  const months = r(days / 30);
  const years = r(months / 12);

  const res = seconds <= thresholds.ss && ['s', seconds]  ||
							minutes <= 1             && ['m']           ||
							minutes < thresholds.m   && ['mm', minutes] ||
							hours   <= 1             && ['h']           ||
							hours   < thresholds.h   && ['hh', hours]   ||
							days    <= 1             && ['d']           ||
							days    < thresholds.d   && ['dd', days]    ||
							months  <= 1             && ['M']           ||
							months  < thresholds.M   && ['MM', months]  ||
							years   <= 1             && ['y']           || ['yy', years];

  return format[res[0]].replace('%d', res[1]);
}
