import React, { useState, useMemo } from "react";
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

const RAW_SERIES = [
  {"code": "01", "name": "ASEGURADOS REGULARES", "group": "regulares", "isSubtotal": true, "data": {"2019-12": {"poblacion": 10737607, "titular": 6150604, "derechohabiente": 4587003}, "2020-12": {"poblacion": 10707305, "titular": 6269826, "derechohabiente": 4437479}, "2021-12": {"poblacion": 10576072, "titular": 6281012, "derechohabiente": 4295060}, "2022-12": {"poblacion": 11219880, "titular": 6796347, "derechohabiente": 4423533}, "2023-12": {"poblacion": 11289683, "titular": 6969334, "derechohabiente": 4320349}, "2024-12": {"poblacion": 11188334, "titular": 6949793, "derechohabiente": 4238541}, "2025-12": {"poblacion": 11334806, "titular": 7148087, "derechohabiente": 4186719}, "2026-06": {"poblacion": 11434931, "titular": 7260177, "derechohabiente": 4174754}}},
  {"code": "1", "name": "Trabajador Activo", "group": "regulares", "data": {"2019-12": {"poblacion": 8820448, "titular": 4791596, "derechohabiente": 4028852}, "2020-12": {"poblacion": 8687575, "titular": 4817579, "derechohabiente": 3869996}, "2021-12": {"poblacion": 8581399, "titular": 4829935, "derechohabiente": 3751464}, "2022-12": {"poblacion": 9271269, "titular": 5360655, "derechohabiente": 3910614}, "2023-12": {"poblacion": 9297740, "titular": 5494193, "derechohabiente": 3803547}, "2024-12": {"poblacion": 9182160, "titular": 5461328, "derechohabiente": 3720832}, "2025-12": {"poblacion": 9364449, "titular": 5671463, "derechohabiente": 3692986}, "2026-06": {"poblacion": 9507106, "titular": 5805175, "derechohabiente": 3701931}}},
  {"code": "2", "name": "Pensionista", "group": "regulares", "data": {"2019-12": {"poblacion": 1275600, "titular": 964992, "derechohabiente": 310608}, "2020-12": {"poblacion": 1274582, "titular": 975892, "derechohabiente": 298690}, "2021-12": {"poblacion": 1269341, "titular": 988369, "derechohabiente": 280972}, "2022-12": {"poblacion": 1286728, "titular": 1010531, "derechohabiente": 276197}, "2023-12": {"poblacion": 1324373, "titular": 1053969, "derechohabiente": 270404}, "2024-12": {"poblacion": 1341400, "titular": 1067428, "derechohabiente": 273972}, "2025-12": {"poblacion": 1326016, "titular": 1064159, "derechohabiente": 261857}, "2026-06": {"poblacion": 1336515, "titular": 1074045, "derechohabiente": 262470}}},
  {"code": "3", "name": "Trabajador del Hogar", "group": "regulares", "data": {"2019-12": {"poblacion": 107257, "titular": 72010, "derechohabiente": 35247}, "2020-12": {"poblacion": 137233, "titular": 97219, "derechohabiente": 40014}, "2021-12": {"poblacion": 91250, "titular": 63729, "derechohabiente": 27521}, "2022-12": {"poblacion": 79443, "titular": 56689, "derechohabiente": 22754}, "2023-12": {"poblacion": 76255, "titular": 53975, "derechohabiente": 22280}, "2024-12": {"poblacion": 81141, "titular": 57117, "derechohabiente": 24024}, "2025-12": {"poblacion": 72853, "titular": 52202, "derechohabiente": 20651}, "2026-06": {"poblacion": 63970, "titular": 46318, "derechohabiente": 17652}}},
  {"code": "4", "name": "Pescador Artesanal", "group": "regulares", "data": {"2019-12": {"poblacion": 6357, "titular": 2921, "derechohabiente": 3436}, "2020-12": {"poblacion": 6863, "titular": 3526, "derechohabiente": 3337}, "2021-12": {"poblacion": 5855, "titular": 2928, "derechohabiente": 2927}, "2022-12": {"poblacion": 5450, "titular": 2607, "derechohabiente": 2843}, "2023-12": {"poblacion": 5498, "titular": 2701, "derechohabiente": 2797}, "2024-12": {"poblacion": 4659, "titular": 2227, "derechohabiente": 2432}, "2025-12": {"poblacion": 4344, "titular": 2092, "derechohabiente": 2252}, "2026-06": {"poblacion": 4535, "titular": 2283, "derechohabiente": 2252}}},
  {"code": "5", "name": "Contra. Administ. Serv", "group": "regulares", "data": {"2019-12": {"poblacion": 527945, "titular": 319085, "derechohabiente": 208860}, "2020-12": {"poblacion": 601052, "titular": 375610, "derechohabiente": 225442}, "2021-12": {"poblacion": 628227, "titular": 396051, "derechohabiente": 232176}, "2022-12": {"poblacion": 576990, "titular": 365865, "derechohabiente": 211125}, "2023-12": {"poblacion": 585817, "titular": 364496, "derechohabiente": 221321}, "2024-12": {"poblacion": 578974, "titular": 361693, "derechohabiente": 217281}, "2025-12": {"poblacion": 567144, "titular": 358171, "derechohabiente": 208973}, "2026-06": {"poblacion": 522805, "titular": 332356, "derechohabiente": 190449}}},
  {"code": "02", "name": "ASEGURADOS REGULARES - AGRARIOS", "group": "agrarios", "isSubtotal": true, "data": {"2019-12": {"poblacion": 790302, "titular": 470932, "derechohabiente": 319370}, "2020-12": {"poblacion": 879474, "titular": 552297, "derechohabiente": 327177}, "2021-12": {"poblacion": 699144, "titular": 453060, "derechohabiente": 246084}, "2022-12": {"poblacion": 910185, "titular": 615266, "derechohabiente": 294919}, "2023-12": {"poblacion": 833941, "titular": 564464, "derechohabiente": 269477}, "2024-12": {"poblacion": 811478, "titular": 550478, "derechohabiente": 261000}, "2025-12": {"poblacion": 878054, "titular": 605599, "derechohabiente": 272455}, "2026-06": {"poblacion": 804671, "titular": 544910, "derechohabiente": 259761}}},
  {"code": "6", "name": "Agrario Dependiente", "group": "agrarios", "data": {"2019-12": {"poblacion": 748975, "titular": 449238, "derechohabiente": 299737}, "2020-12": {"poblacion": 837778, "titular": 529440, "derechohabiente": 308338}, "2021-12": {"poblacion": 676597, "titular": 440474, "derechohabiente": 236123}, "2022-12": {"poblacion": 890665, "titular": 604065, "derechohabiente": 286600}, "2023-12": {"poblacion": 816965, "titular": 554436, "derechohabiente": 262529}, "2024-12": {"poblacion": 797299, "titular": 542144, "derechohabiente": 255155}, "2025-12": {"poblacion": 866823, "titular": 598949, "derechohabiente": 267874}, "2026-06": {"poblacion": 793848, "titular": 538473, "derechohabiente": 255375}}},
  {"code": "7", "name": "Agrario Independiente", "group": "agrarios", "data": {"2019-12": {"poblacion": 26908, "titular": 14470, "derechohabiente": 12438}, "2020-12": {"poblacion": 28890, "titular": 16167, "derechohabiente": 12723}, "2021-12": {"poblacion": 22270, "titular": 12459, "derechohabiente": 9811}, "2022-12": {"poblacion": 19486, "titular": 11183, "derechohabiente": 8303}, "2023-12": {"poblacion": 16965, "titular": 10021, "derechohabiente": 6944}, "2024-12": {"poblacion": 14145, "titular": 8317, "derechohabiente": 5828}, "2025-12": {"poblacion": 11212, "titular": 6637, "derechohabiente": 4575}, "2026-06": {"poblacion": 10780, "titular": 6419, "derechohabiente": 4361}}},
  {"code": "8", "name": "Actividad Acuicola", "group": "agrarios", "data": {"2019-12": {"poblacion": 14419, "titular": 7224, "derechohabiente": 7195}, "2020-12": {"poblacion": 12806, "titular": 6690, "derechohabiente": 6116}, "2021-12": {"poblacion": 277, "titular": 127, "derechohabiente": 150}, "2022-12": {"poblacion": 34, "titular": 18, "derechohabiente": 16}, "2023-12": {"poblacion": 11, "titular": 7, "derechohabiente": 4}, "2024-12": {"poblacion": 34, "titular": 17, "derechohabiente": 17}, "2025-12": {"poblacion": 19, "titular": 13, "derechohabiente": 6}, "2026-06": {"poblacion": 43, "titular": 18, "derechohabiente": 25}}},
  {"code": "03", "name": "SEGUROS POTESTATIVOS", "group": "potestativos", "isSubtotal": true, "data": {"2019-12": {"poblacion": 24466, "titular": 22675, "derechohabiente": 1791}, "2020-12": {"poblacion": 23934, "titular": 21600, "derechohabiente": 2334}, "2021-12": {"poblacion": 22394, "titular": 19958, "derechohabiente": 2436}, "2022-12": {"poblacion": 23628, "titular": 21263, "derechohabiente": 2365}, "2023-12": {"poblacion": 22606, "titular": 22034, "derechohabiente": 572}, "2024-12": {"poblacion": 23019, "titular": 22410, "derechohabiente": 609}, "2025-12": {"poblacion": 25052, "titular": 23954, "derechohabiente": 1098}, "2026-06": {"poblacion": 25737, "titular": 24690, "derechohabiente": 1047}}},
  {"code": "9", "name": "Plan Protección Total y Vital", "group": "potestativos", "data": {"2019-12": {"poblacion": 3847, "titular": 3440, "derechohabiente": 407}, "2020-12": {"poblacion": 3585, "titular": 3208, "derechohabiente": 377}, "2021-12": {"poblacion": 3107, "titular": 2805, "derechohabiente": 302}, "2022-12": {"poblacion": 2641, "titular": 2404, "derechohabiente": 237}, "2023-12": {"poblacion": 2342, "titular": 2139, "derechohabiente": 203}, "2024-12": {"poblacion": 2105, "titular": 1937, "derechohabiente": 168}, "2025-12": {"poblacion": 1860, "titular": 1719, "derechohabiente": 141}, "2026-06": {"poblacion": 1783, "titular": 1650, "derechohabiente": 133}}},
  {"code": "10", "name": "EsSalud Independiente Personal-Familiar", "group": "potestativos", "data": {"2019-12": {"poblacion": 668, "titular": 587, "derechohabiente": 81}, "2020-12": {"poblacion": 616, "titular": 546, "derechohabiente": 70}, "2021-12": {"poblacion": 522, "titular": 460, "derechohabiente": 62}, "2022-12": {"poblacion": 457, "titular": 406, "derechohabiente": 51}, "2023-12": {"poblacion": 405, "titular": 367, "derechohabiente": 38}, "2024-12": {"poblacion": 384, "titular": 348, "derechohabiente": 36}, "2025-12": {"poblacion": 367, "titular": 330, "derechohabiente": 37}, "2026-06": {"poblacion": 357, "titular": 319, "derechohabiente": 38}}},
  {"code": "11", "name": "EsSalud Independiente (antiguo)", "group": "potestativos", "data": {"2019-12": {"poblacion": 7882, "titular": 7212, "derechohabiente": 670}, "2020-12": {"poblacion": 6732, "titular": 6193, "derechohabiente": 539}, "2021-12": {"poblacion": 5317, "titular": 4922, "derechohabiente": 395}, "2022-12": {"poblacion": 4510, "titular": 4192, "derechohabiente": 318}, "2023-12": {"poblacion": 3815, "titular": 3560, "derechohabiente": 255}, "2024-12": {"poblacion": 3290, "titular": 3064, "derechohabiente": 226}, "2025-12": {"poblacion": 2776, "titular": 2602, "derechohabiente": 174}, "2026-06": {"poblacion": 2604, "titular": 2441, "derechohabiente": 163}}},
  {"code": "12", "name": "+ Salud Seguro Potestativo", "group": "potestativos", "data": {"2019-12": {"poblacion": 12069, "titular": 11436, "derechohabiente": 633}, "2020-12": {"poblacion": 13001, "titular": 11653, "derechohabiente": 1348}, "2021-12": {"poblacion": 13448, "titular": 11771, "derechohabiente": 1677}, "2022-12": {"poblacion": 16020, "titular": 14261, "derechohabiente": 1759}, "2023-12": {"poblacion": 16044, "titular": 15968, "derechohabiente": 76}, "2024-12": {"poblacion": 17240, "titular": 17061, "derechohabiente": 179}, "2025-12": {"poblacion": 20049, "titular": 19303, "derechohabiente": 746}, "2026-06": {"poblacion": 20993, "titular": 20280, "derechohabiente": 713}}},
  {"code": "04", "name": "OTRAS COBERTURAS", "group": "otras", "isSubtotal": true, "data": {"2019-12": {"poblacion": 259078, "titular": 172353, "derechohabiente": 86725}, "2020-12": {"poblacion": 360450, "titular": 247415, "derechohabiente": 113035}, "2021-12": {"poblacion": 454060, "titular": 313804, "derechohabiente": 140256}, "2022-12": {"poblacion": 460966, "titular": 306229, "derechohabiente": 154737}, "2023-12": {"poblacion": 529752, "titular": 371796, "derechohabiente": 157956}, "2024-12": {"poblacion": 522360, "titular": 363290, "derechohabiente": 159070}, "2025-12": {"poblacion": 570796, "titular": 413464, "derechohabiente": 157332}, "2026-06": {"poblacion": 579731, "titular": 423374, "derechohabiente": 156357}}},
  {"code": "13", "name": "Solicitante de Pensión", "group": "otras", "data": {"2019-12": {"poblacion": 36, "titular": 32, "derechohabiente": 4}, "2020-12": {"poblacion": 8, "titular": 8, "derechohabiente": 0}, "2021-12": {"poblacion": 5, "titular": 5, "derechohabiente": 0}, "2022-12": {"poblacion": 6, "titular": 6, "derechohabiente": 0}, "2023-12": {"poblacion": 6, "titular": 5, "derechohabiente": 1}, "2024-12": {"poblacion": 7, "titular": 7, "derechohabiente": 0}, "2025-12": {"poblacion": 5, "titular": 5, "derechohabiente": 0}, "2026-06": {"poblacion": 2, "titular": 2, "derechohabiente": 0}}},
  {"code": "14", "name": "Beneficiario ley 30478", "group": "otras", "data": {"2019-12": {"poblacion": 259042, "titular": 172321, "derechohabiente": 86721}, "2020-12": {"poblacion": 360442, "titular": 247407, "derechohabiente": 113035}, "2021-12": {"poblacion": 454055, "titular": 313799, "derechohabiente": 140256}, "2022-12": {"poblacion": 460960, "titular": 306223, "derechohabiente": 154737}, "2023-12": {"poblacion": 529746, "titular": 371791, "derechohabiente": 157955}, "2024-12": {"poblacion": 522353, "titular": 363283, "derechohabiente": 159070}, "2025-12": {"poblacion": 570791, "titular": 413459, "derechohabiente": 157332}, "2026-06": {"poblacion": 579729, "titular": 423372, "derechohabiente": 156357}}},
  {"code": "T", "name": "TOTAL", "group": "total", "isTotal": true, "data": {"2019-12": {"poblacion": 11811453, "titular": 6816564, "derechohabiente": 4994889}, "2020-12": {"poblacion": 11971163, "titular": 7091138, "derechohabiente": 4880025}, "2021-12": {"poblacion": 11751670, "titular": 7067834, "derechohabiente": 4683836}, "2022-12": {"poblacion": 12614659, "titular": 7739105, "derechohabiente": 4875554}, "2023-12": {"poblacion": 12675982, "titular": 7927628, "derechohabiente": 4748354}, "2024-12": {"poblacion": 12545191, "titular": 7885971, "derechohabiente": 4659220}, "2025-12": {"poblacion": 12808708, "titular": 8191104, "derechohabiente": 4617604}, "2026-06": {"poblacion": 12845070, "titular": 8253151, "derechohabiente": 4591919}}},
];

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

export default function EvolucionAsegurados() {
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
    return PERIODS.map((p) => {
      const row = { period: PERIOD_LABELS[p] };
      RAW_SERIES.forEach((s) => {
        if (selected.has(s.code)) {
          row[s.code] = s.data[p][variable];
        }
      });
      return row;
    });
  }, [variable, selected]);

  const activeSeries = RAW_SERIES.filter((s) => selected.has(s.code));

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
            const items = RAW_SERIES.filter(
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
                    const s = RAW_SERIES.find((x) => x.code === name);
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
