'use client';

import { useEffect, useState } from 'react';

export default function GitHubDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    console.log("Fetched Data");
    try {
      const res = await fetch('/api/github-events');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(); // Initial
    const interval = setInterval(fetchEvents, 15000); // Every 15s
    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center fw-bold">GitHub Events Dashboard</h1>

      {loading ? (
        <div className="alert alert-secondary text-center">Loading...</div>
      ) : events.length === 0 ? (
        <div className="alert alert-info text-center">No events found.</div>
      ) : (
        <div className="row">
          {events.map((event) => (
            <div key={event._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{event.action}</h5>
                  <p className="card-text mb-1"><strong>Author:</strong> {event.author}</p>
                  <p className="card-text mb-1"><strong>From Branch:</strong> {event.from_branch || '—'}</p>
                  <p className="card-text mb-1"><strong>To Branch:</strong> {event.to_branch || '—'}</p>
                  <p className="card-text mb-1"><strong>Request ID:</strong> {event.request_id}</p>
                  <p className="card-text mb-0"><strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
