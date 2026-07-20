import React, { useState, useMemo } from "react";
import { formatPeriodo } from "./utils/formatPeriodo";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const periodos = useMemo(() => {

    if (rawSeries.length === 0) return [];

    return Object.keys(rawSeries[0].data);

}, [rawSeries]);

const periodosGrafico = useMemo(() => {

    return periodos.map(periodo => ({
        key: periodo,
        label: formatPeriodo(periodo)
    }));

}, [periodos]);

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------
const PERIODS = [
  "2019-12",
  "2020-12",
  "2021-12",
  "2022-12",
  "2023-12",
  "2024-12",
  "2025-12",
  "2026-06",
];

const PERIOD_LABELS = {
  "2019-12": "Dic 2019",
  "2020-12": "Dic 2020",
  "2021-12": "Dic 2021",
  "2022-12": "Dic 2022",
  "2023-12": "Dic 2023",
  "2024-12": "Dic 2024",
  "2025-12": "Dic 2025",
  "2026-06": "Jun 2026",
};


const GROUPS = [
  { id: "regulares", label: "Regulares", accent: "#c2410c" },
  { id: "agrarios", label: "Agrarios", accent: "#15803d" },
  { id: "potestativos", label: "Potestativos", accent: "#ea580c" },
  { id: "otras", label: "Otras coberturas", accent: "#166534" },
  { id: "total", label: "Total general", accent: "#3f6212" },
];

// distinct color per line, drawn from an orange <-> green family
const COLOR_MAP = {
  "01": "#9a3412",
  "1": "#ea580c",
  "2": "#f59e0b",
  "3": "#fb923c",
  "4": "#fdba74",
  "5": "#c2410c",
  "02": "#166534",
  "6": "#16a34a",
  "7": "#4ade80",
  "8": "#65a30d",
  "03": "#7c2d12",
  "9": "#d97706",
  "10": "#eab308",
  "11": "#facc15",
  "12": "#fbbf24",
  "04": "#14532d",
  "13": "#22c55e",
  "14": "#84cc16",
  T: "#3f3f1c",
};

const VARIABLES = [
  { id: "poblacion", label: "Población" },
  { id: "titular", label: "Titular" },
  { id: "derechohabiente", label: "Derechohabiente" },
];

const DEFAULT_SELECTED = ["T", "1", "2", "6"];

function fmt(n) {
  if (n === undefined || n === null) return "-";
  return new Intl.NumberFormat("es-PE").format(n);
}

export default function EvolucionAsegurados({ rawSeries }) {
  const [variable, setVariable] = useState("poblacion");
  const [selected, setSelected] = useState(new Set(DEFAULT_SELECTED));
  const [openGroups, setOpenGroups] = useState(
    new Set(["regulares", "total"])
  );

  const toggleSeries = (code) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const toggleGroup = (id) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const chartData = useMemo(() => {
    return periodos.map((p) => {
      const row = { period: formatPeriodo(p) };
      rawSeries.forEach((s) => {
        if (selected.has(s.code)) {
          row[s.code] = s.data[p][variable];
        }
      });
      return row;
    });
  }, [variable, selected]);

  const activeSeries = rawSeries.filter((s) => selected.has(s.code));

  return (
    <div
      style={{
        fontFamily:
          "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
        background: "#fdf8f0",
        color: "#292019",
        minHeight: "100%",
        padding: "28px 24px 40px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .evol-mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
        .evol-checkbox {
          appearance: none; width: 14px; height: 14px; border-radius: 3px;
          border: 1.5px solid #a3a3a3; cursor: pointer; position: relative;
          flex-shrink: 0; margin-top: 2px;
        }
        .evol-checkbox:checked { border-color: transparent; }
        .evol-checkbox:checked::after {
          content: ''; position: absolute; inset: 0; border-radius: 3px;
          background: var(--dot-color, #ea580c);
        }
        .evol-radio {
          border: none; cursor: pointer; padding: 6px 14px; border-radius: 999px;
          font-size: 13px; font-family: inherit; transition: all .15s ease;
        }
        .evol-group-header {
          cursor: pointer; display: flex; align-items: center; gap: 8px;
          padding: 6px 0; user-select: none;
        }
        .evol-item {
          display: flex; align-items: flex-start; gap: 8px; padding: 3px 0 3px 20px;
          font-size: 12.5px; cursor: pointer; line-height: 1.35;
        }
        .evol-item:hover { color: #ea580c; }
      `}</style>

      {/* Header */}
      <div
        style={{
          borderBottom: "2px solid #292019",
          paddingBottom: "14px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <div
            className="evol-mono"
            style={{
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: "#c2410c",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            Boletín estadístico · Dic 2019 – Jun 2026
          </div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 600 }}>
            Población asegurada por tipo de seguro
          </h1>
        </div>
        <div className="evol-mono" style={{ fontSize: "11px", color: "#78716c" }}>
          19 categorías · 8 periodos semestrales/anuales
        </div>
      </div>

      {/* Variable switch */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {VARIABLES.map((v) => (
          <button
            key={v.id}
            className="evol-radio"
            onClick={() => setVariable(v.id)}
            style={{
              background: variable === v.id ? "#292019" : "transparent",
              color: variable === v.id ? "#fdf8f0" : "#292019",
              border: variable === v.id ? "none" : "1.5px solid #d6d3d1",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "24px",
        }}
      >
        {/* Sidebar: series selector */}
        <div
          style={{
            borderRight: "1px solid #e7e0d5",
            paddingRight: "16px",
          }}
        >
          <div
            className="evol-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: "#a8a29e",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Series ({selected.size} activas)
          </div>
          {GROUPS.map((g) => {
            const items = rawSeries.filter(
              (s) => s.group === g.id && !s.isTotal
            );
            const isOpen = openGroups.has(g.id);
            return (
              <div key={g.id} style={{ marginBottom: "2px" }}>
                <div
                  className="evol-group-header"
                  onClick={() => toggleGroup(g.id)}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#78716c",
                      width: "10px",
                      display: "inline-block",
                    }}
                  >
                    {isOpen ? "▾" : "▸"}
                  </span>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "2px",
                      background: g.accent,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>
                    {g.label}
                  </span>
                </div>
                {isOpen &&
                  items.map((s) => (
                    <label className="evol-item" key={s.code}>
                      <input
                        type="checkbox"
                        className="evol-checkbox"
                        style={{ "--dot-color": COLOR_MAP[s.code] }}
                        checked={selected.has(s.code)}
                        onChange={() => toggleSeries(s.code)}
                      />
                      <span
                        style={{
                          fontWeight: s.isSubtotal ? 700 : 400,
                          fontStyle: s.isSubtotal ? "italic" : "normal",
                        }}
                      >
                        {s.name}
                      </span>
                    </label>
                  ))}
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div>
          <div style={{ width: "100%", height: 420 }}>
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 24, bottom: 10, left: 0 }}
              >
                <CartesianGrid stroke="#e7e0d5" strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: "#57534e" }}
                  axisLine={{ stroke: "#d6d3d1" }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) =>
                    v >= 1000000
                      ? (v / 1000000).toFixed(1) + "M"
                      : v >= 1000
                      ? (v / 1000).toFixed(0) + "k"
                      : v
                  }
                  tick={{ fontSize: 11, fill: "#57534e" }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const s = rawSeries.find((x) => x.code === name);
                    return [fmt(value), s ? s.name : name];
                  }}
                  contentStyle={{
                    background: "#292019",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#fdf8f0" }}
                  itemStyle={{ color: "#fdf8f0" }}
                />
                {activeSeries.map((s) => (
                  <Line
                    key={s.code}
                    type="monotone"
                    dataKey={s.code}
                    name={s.code}
                    stroke={COLOR_MAP[s.code]}
                    strokeWidth={s.isTotal ? 3 : 2}
                    strokeDasharray={s.isSubtotal ? "5 3" : undefined}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend / values table */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            {activeSeries.map((s) => {
              const first = s.data[PERIODS[0]][variable];
              const last = s.data[PERIODS[PERIODS.length - 1]][variable];
              const delta = first ? ((last - first) / first) * 100 : 0;
              return (
                <div
                  key={s.code}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    padding: "6px 10px",
                    background: "#f5efe3",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "9px",
                      height: "9px",
                      borderRadius: "2px",
                      background: COLOR_MAP[s.code],
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                  <span className="evol-mono" style={{ color: "#78716c" }}>
                    {fmt(last)}
                  </span>
                  <span
                    className="evol-mono"
                    style={{
                      color: delta >= 0 ? "#166534" : "#c2410c",
                      fontWeight: 600,
                    }}
                  >
                    {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
          <div
            className="evol-mono"
            style={{
              fontSize: "10.5px",
              color: "#a8a29e",
              marginTop: "14px",
            }}
          >
            Variación calculada entre Dic 2019 y Jun 2026. Líneas punteadas =
            subtotales de grupo. (*) Regulares a partir de 2021 según Ley
            31110.
          </div>
        </div>
      </div>
    </div>
  );
}
