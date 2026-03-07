/**
 * Detroit Road Repair Decision Dashboard
 * A frontend mockup for a Detroit road prioritization ML dashboard with a map-first UI.
 * Uses mock data only - no backend. Built for civic planning / GIS-style road repair prioritization.
 */

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Mock data: 12 Detroit road segments with full attributes
const MOCK_ROADS = [
  {
    id: 1,
    roadName: "Michigan Ave",
    district: "Downtown / Corktown",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "City",
    condition: "Poor",
    conditionScore: 28,
    priorityScore: 94,
    potholeReports: 47,
    crashCount: 23,
    trafficVolume: 28500,
    estimatedRepairCost: 420000,
    lastRepairYear: 2015,
    lengthMiles: 2.4,
    notes: "Heavy commercial traffic; multiple pothole complaints. Critical corridor.",
    latitude: 42.3314,
    longitude: -83.065,
  },
  {
    id: 2,
    roadName: "Woodward Ave",
    district: "Midtown / New Center",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "City",
    condition: "Fair",
    conditionScore: 52,
    priorityScore: 72,
    potholeReports: 31,
    crashCount: 41,
    trafficVolume: 35200,
    estimatedRepairCost: 680000,
    lastRepairYear: 2018,
    lengthMiles: 4.2,
    notes: "Major arterial; moderate deterioration in northern segment.",
    latitude: 42.355,
    longitude: -83.065,
  },
  {
    id: 3,
    roadName: "Gratiot Ave",
    district: "Eastside",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "State",
    condition: "Good",
    conditionScore: 78,
    priorityScore: 38,
    potholeReports: 8,
    crashCount: 12,
    trafficVolume: 22100,
    estimatedRepairCost: 195000,
    lastRepairYear: 2021,
    lengthMiles: 3.1,
    notes: "Recently resurfaced; low priority for now.",
    latitude: 42.368,
    longitude: -82.97,
  },
  {
    id: 4,
    roadName: "7 Mile Rd",
    district: "North End",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "County",
    condition: "Poor",
    conditionScore: 31,
    priorityScore: 88,
    potholeReports: 52,
    crashCount: 18,
    trafficVolume: 18900,
    estimatedRepairCost: 510000,
    lastRepairYear: 2014,
    lengthMiles: 5.8,
    notes: "Severe cracking; high pothole density. Residential corridor.",
    latitude: 42.428,
    longitude: -83.095,
  },
  {
    id: 5,
    roadName: "Livernois Ave",
    district: "University District",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "City",
    condition: "Fair",
    conditionScore: 48,
    priorityScore: 65,
    potholeReports: 22,
    crashCount: 15,
    trafficVolume: 12500,
    estimatedRepairCost: 290000,
    lastRepairYear: 2017,
    lengthMiles: 2.9,
    notes: "Avenue of Fashion; needs surface treatment.",
    latitude: 42.385,
    longitude: -83.135,
  },
  {
    id: 6,
    roadName: "Jefferson Ave",
    district: "Rivertown / East Jefferson",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "State",
    condition: "Poor",
    conditionScore: 35,
    priorityScore: 91,
    potholeReports: 38,
    crashCount: 29,
    trafficVolume: 31200,
    estimatedRepairCost: 545000,
    lastRepairYear: 2016,
    lengthMiles: 3.6,
    notes: "Waterfront route; salt damage. High visibility.",
    latitude: 42.325,
    longitude: -83.025,
  },
  {
    id: 7,
    roadName: "Grand River Ave",
    district: "Northwest",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "State",
    condition: "Fair",
    conditionScore: 55,
    priorityScore: 58,
    potholeReports: 19,
    crashCount: 21,
    trafficVolume: 24800,
    estimatedRepairCost: 380000,
    lastRepairYear: 2019,
    lengthMiles: 4.1,
    notes: "Partial repair needed in commercial stretch.",
    latitude: 42.358,
    longitude: -83.085,
  },
  {
    id: 8,
    roadName: "Mack Ave",
    district: "Eastside",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "City",
    condition: "Good",
    conditionScore: 72,
    priorityScore: 42,
    potholeReports: 11,
    crashCount: 9,
    trafficVolume: 14200,
    estimatedRepairCost: 165000,
    lastRepairYear: 2020,
    lengthMiles: 2.2,
    notes: "Stable; routine maintenance recommended.",
    latitude: 42.362,
    longitude: -82.952,
  },
  {
    id: 9,
    roadName: "Fenkell Ave",
    district: "Westside",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "City",
    condition: "Poor",
    conditionScore: 25,
    priorityScore: 96,
    potholeReports: 61,
    crashCount: 14,
    trafficVolume: 11200,
    estimatedRepairCost: 480000,
    lastRepairYear: 2013,
    lengthMiles: 3.4,
    notes: "Among worst in city. Emergency repairs pending.",
    latitude: 42.408,
    longitude: -83.182,
  },
  {
    id: 10,
    roadName: "Vernor Hwy",
    district: "Southwest",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "City",
    condition: "Fair",
    conditionScore: 46,
    priorityScore: 69,
    potholeReports: 27,
    crashCount: 11,
    trafficVolume: 9800,
    estimatedRepairCost: 275000,
    lastRepairYear: 2018,
    lengthMiles: 2.7,
    notes: "Industrial area; heavy truck traffic.",
    latitude: 42.302,
    longitude: -83.102,
  },
  {
    id: 11,
    roadName: "Davison Ave",
    district: "Northwest",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "County",
    condition: "Good",
    conditionScore: 82,
    priorityScore: 25,
    potholeReports: 5,
    crashCount: 7,
    trafficVolume: 15800,
    estimatedRepairCost: 125000,
    lastRepairYear: 2022,
    lengthMiles: 3.2,
    notes: "Well-maintained; minimal intervention needed.",
    latitude: 42.415,
    longitude: -83.108,
  },
  {
    id: 12,
    roadName: "Fort St",
    district: "Southwest",
    city: "Detroit",
    county: "Wayne",
    jurisdiction: "State",
    condition: "Poor",
    conditionScore: 29,
    priorityScore: 89,
    potholeReports: 43,
    crashCount: 19,
    trafficVolume: 26500,
    estimatedRepairCost: 495000,
    lastRepairYear: 2015,
    lengthMiles: 3.8,
    notes: "Major truck route; significant base failure.",
    latitude: 42.282,
    longitude: -83.118,
  },
];

function getPriorityColor(priorityScore) {
  if (priorityScore >= 80) return "#dc2626";
  if (priorityScore >= 60) return "#ea580c";
  if (priorityScore >= 40) return "#ca8a04";
  return "#16a34a";
}

function createCustomIcon(priorityScore, isSelected) {
  const color = getPriorityColor(priorityScore);
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 24px;
      height: 24px;
      background: ${color};
      border: 3px solid ${isSelected ? "#1e3a5f" : "white"};
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function MapHighlight({ selectedRoad }) {
  const map = useMap();
  if (selectedRoad) {
    map.flyTo([selectedRoad.latitude, selectedRoad.longitude], 14, { duration: 0.5 });
  }
  return null;
}

export default function App() {
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Highest Priority");

  const filteredAndSortedRoads = useMemo(() => {
    let result = [...MOCK_ROADS];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.roadName.toLowerCase().includes(term) ||
          r.district.toLowerCase().includes(term)
      );
    }

    if (conditionFilter !== "All") {
      result = result.filter(
        (r) => r.condition.toLowerCase() === conditionFilter.toLowerCase()
      );
    }

    if (jurisdictionFilter !== "All") {
      result = result.filter(
        (r) =>
          r.jurisdiction.toLowerCase() === jurisdictionFilter.toLowerCase()
      );
    }

    switch (sortBy) {
      case "Highest Priority":
        result.sort((a, b) => b.priorityScore - a.priorityScore);
        break;
      case "Lowest Priority":
        result.sort((a, b) => a.priorityScore - b.priorityScore);
        break;
      case "Worst Condition":
        result.sort((a, b) => a.conditionScore - b.conditionScore);
        break;
      case "Best Condition":
        result.sort((a, b) => b.conditionScore - a.conditionScore);
        break;
      default:
        break;
    }

    return result;
  }, [searchTerm, conditionFilter, jurisdictionFilter, sortBy]);

  const stats = useMemo(() => {
    const total = MOCK_ROADS.length;
    const poor = MOCK_ROADS.filter((r) => r.condition === "Poor").length;
    const fair = MOCK_ROADS.filter((r) => r.condition === "Fair").length;
    const good = MOCK_ROADS.filter((r) => r.condition === "Good").length;
    const avgScore =
      total > 0
        ? Math.round(
            MOCK_ROADS.reduce((sum, r) => sum + r.priorityScore, 0) / total
          )
        : 0;
    return { total, poor, fair, good, avgScore };
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h1>Detroit Road Repair Decision Dashboard</h1>
        <p className="subtitle">
          Prioritizing Detroit road segments using pavement condition data and
          machine learning-based repair scoring
        </p>
      </header>

      {/* Summary Cards */}
      <section className="summary-cards">
        <div className="card">
          <span className="card-value">{stats.total}</span>
          <span className="card-label">Total Road Segments</span>
        </div>
        <div className="card card-poor">
          <span className="card-value">{stats.poor}</span>
          <span className="card-label">Poor Condition</span>
        </div>
        <div className="card card-fair">
          <span className="card-value">{stats.fair}</span>
          <span className="card-label">Fair Condition</span>
        </div>
        <div className="card card-good">
          <span className="card-value">{stats.good}</span>
          <span className="card-label">Good Condition</span>
        </div>
        <div className="card card-score">
          <span className="card-value">{stats.avgScore}</span>
          <span className="card-label">Avg Priority Score</span>
        </div>
      </section>

      {/* Filters */}
      <aside className="sidebar">
        <div className="filter-section">
          <label>Search by road name</label>
          <input
            type="text"
            placeholder="e.g. Woodward, Michigan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-section">
          <label>Pavement Condition</label>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Poor">Poor</option>
            <option value="Fair">Fair</option>
            <option value="Good">Good</option>
          </select>
        </div>
        <div className="filter-section">
          <label>Jurisdiction</label>
          <select
            value={jurisdictionFilter}
            onChange={(e) => setJurisdictionFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="City">City</option>
            <option value="County">County</option>
            <option value="State">State</option>
            <option value="Private">Private</option>
          </select>
        </div>
        <div className="filter-section">
          <label>Sort by</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="Highest Priority">Highest Priority</option>
            <option value="Lowest Priority">Lowest Priority</option>
            <option value="Worst Condition">Worst Condition</option>
            <option value="Best Condition">Best Condition</option>
          </select>
        </div>
      </aside>

      {/* Main content: Map + Road List */}
      <main className="main-content">
        <div className="map-container">
          <h2 className="map-title">Detroit Road Priority Map</h2>
          <div className="map-wrapper">
            <MapContainer
              center={[42.3314, -83.0458]}
              zoom={11}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapHighlight selectedRoad={selectedRoad} />
              {filteredAndSortedRoads.map((road) => (
                <Marker
                  key={road.id}
                  position={[road.latitude, road.longitude]}
                  icon={createCustomIcon(
                    road.priorityScore,
                    selectedRoad?.id === road.id
                  )}
                  eventHandlers={{
                    click: () => setSelectedRoad(road),
                  }}
                >
                  <Popup>
                    <strong>{road.roadName}</strong>
                    <br />
                    {road.condition} · Score: {road.priorityScore}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="road-list-panel">
          <h3>Road List</h3>
          <div className="road-table-wrapper">
            <table className="road-table">
              <thead>
                <tr>
                  <th>Road Name</th>
                  <th>District</th>
                  <th>Jurisdiction</th>
                  <th>Condition</th>
                  <th>Cond. Score</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedRoads.map((road) => (
                  <tr
                    key={road.id}
                    className={selectedRoad?.id === road.id ? "selected" : ""}
                    onClick={() => setSelectedRoad(road)}
                  >
                    <td>{road.roadName}</td>
                    <td>{road.district}</td>
                    <td>{road.jurisdiction}</td>
                    <td>
                      <span className={`badge badge-${road.condition.toLowerCase()}`}>
                        {road.condition}
                      </span>
                    </td>
                    <td>{road.conditionScore}</td>
                    <td>
                      <span
                        className="priority-cell"
                        style={{ color: getPriorityColor(road.priorityScore) }}
                      >
                        {road.priorityScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAndSortedRoads.length === 0 && (
              <p className="no-results">No roads match your filters.</p>
            )}
          </div>
        </div>
      </main>

      {/* Selected Road Detail Panel */}
      <section className="detail-panel">
        <h3>Selected Road Details</h3>
        {selectedRoad ? (
          <div className="detail-content">
            <h4>{selectedRoad.roadName}</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">District / Area</span>
                <span className="detail-value">{selectedRoad.district}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">City</span>
                <span className="detail-value">{selectedRoad.city}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">County</span>
                <span className="detail-value">{selectedRoad.county}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Jurisdiction</span>
                <span className="detail-value">{selectedRoad.jurisdiction}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pavement Condition</span>
                <span
                  className={`badge badge-${selectedRoad.condition.toLowerCase()}`}
                >
                  {selectedRoad.condition}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Condition Score</span>
                <span className="detail-value">{selectedRoad.conditionScore}</span>
              </div>
              <div className="detail-item detail-priority">
                <span className="detail-label">Priority Score</span>
                <span
                  className="detail-value priority-badge"
                  style={{
                    background: getPriorityColor(selectedRoad.priorityScore),
                    color: "white",
                  }}
                >
                  {selectedRoad.priorityScore}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pothole Reports</span>
                <span className="detail-value">{selectedRoad.potholeReports}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Crash Count</span>
                <span className="detail-value">{selectedRoad.crashCount}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Traffic Volume</span>
                <span className="detail-value">
                  {selectedRoad.trafficVolume.toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Length</span>
                <span className="detail-value">{selectedRoad.lengthMiles} mi</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Repair Year</span>
                <span className="detail-value">{selectedRoad.lastRepairYear}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Est. Repair Cost</span>
                <span className="detail-value">
                  ${selectedRoad.estimatedRepairCost.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="detail-notes">
              <span className="detail-label">Notes / Priority Reason</span>
              <p>{selectedRoad.notes}</p>
            </div>
          </div>
        ) : (
          <p className="no-selection">
            Click a road on the map or in the table to view details.
          </p>
        )}
      </section>
    </div>
  );
}
