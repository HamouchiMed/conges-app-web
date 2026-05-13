import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch employees from DB
  const fetchEmployees = useCallback(async () => {
    try {
      const data = await api.getEmployees();
      setEmployees(data.map((e) => e.name));
    } catch (err) {
      console.error('Fetch employees error:', err);
    }
  }, []);

  // Fetch leave requests from DB
  const fetchLeaves = useCallback(async () => {
    try {
      const data = await api.getLeaves();
      setLeaveRequests(data);
    } catch (err) {
      console.error('Fetch leaves error:', err);
    }
  }, []);

  // Fetch meetings from DB
  const fetchMeetings = useCallback(async () => {
    try {
      const data = await api.getMeetings();
      setMeetings(data);
    } catch (err) {
      console.error('Fetch meetings error:', err);
    }
  }, []);

  // Load all data on mount
  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
    fetchMeetings();
  }, [fetchEmployees, fetchLeaves, fetchMeetings]);

  const login = async (name, role) => {
    try {
      setLoading(true);
      const data = await api.login(name, role);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Login error:', err);
      // Fallback: set user locally if API fails
      setUser({ name, role });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addLeaveRequest = async (request) => {
    try {
      setLoading(true);
      const newLeave = await api.createLeave(request);
      setLeaveRequests((prev) => [newLeave, ...prev]);
      return newLeave;
    } catch (err) {
      console.error('Add leave error:', err);
      // Fallback: add locally
      const fallback = {
        ...request,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setLeaveRequests((prev) => [fallback, ...prev]);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      setLoading(true);
      await api.updateLeaveStatus(id, status);
      setLeaveRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
    } catch (err) {
      console.error('Update leave error:', err);
      // Fallback: update locally
      setLeaveRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
    } finally {
      setLoading(false);
    }
  };

  const addMeeting = async (meeting) => {
    try {
      setLoading(true);
      const newMeeting = await api.createMeeting(meeting);
      setMeetings((prev) => [newMeeting, ...prev]);
      return newMeeting;
    } catch (err) {
      console.error('Add meeting error:', err);
      // Fallback: add locally
      const fallback = {
        ...meeting,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setMeetings((prev) => [fallback, ...prev]);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    leaveRequests,
    addLeaveRequest,
    updateLeaveStatus,
    meetings,
    addMeeting,
    employees,
    loading,
    refreshData: () => {
      fetchLeaves();
      fetchMeetings();
      fetchEmployees();
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
