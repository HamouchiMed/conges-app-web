import { format, isWithinInterval, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
};

export const isOnLeave = (employee, leaveRequests, checkDate = new Date()) => {
  return leaveRequests.some(
    (req) =>
      req.employeeName === employee &&
      req.status === 'approved' &&
      isWithinInterval(checkDate, {
        start: parseISO(req.startDate),
        end: parseISO(req.endDate),
      })
  );
};

export const LEAVE_TYPES = [
  { value: 'annuel', label: 'Congé Annuel' },
  { value: 'maladie', label: 'Congé Maladie' },
  { value: 'personnel', label: 'Congé Personnel' },
  { value: 'maternite', label: 'Congé Maternité' },
  { value: 'sans_solde', label: 'Sans Solde' },
];

export const EMPLOYEES_LIST = [
  'Hamza Choukri',
  'Youssef Amrani',
  'Fatima Zahra',
  'Ahmed Bennani',
  'Sara Idrissi',
  'Karim Tazi',
  'Nadia Ouazzani',
  'Omar Fassi',
];
