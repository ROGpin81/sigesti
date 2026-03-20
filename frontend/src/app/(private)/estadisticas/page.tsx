"use client";

import { useEffect, useState } from "react";
import {
  getTicketsByStatus,
  getUsersSummary,
  getTicketCycles,
} from "@/services/dashboard.service";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

import { Pie, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

type TicketStatus = {
  status: string;
  total: number;
};

type UserSummary = {
  role: string;
  total: number;
};

type TicketCycle = {
  ticket_id: number;
  correcciones_dev: number;
  retest_qa: number;
};

export default function DashboardPage() {
  const [ticketsStatus, setTicketsStatus] = useState<TicketStatus[]>([]);
  const [usersSummary, setUsersSummary] = useState<UserSummary[]>([]);
  const [ticketCycles, setTicketCycles] = useState<TicketCycle[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const status = await getTicketsByStatus();
        const users = await getUsersSummary();
        const cycles = await getTicketCycles();

        setTicketsStatus(status.datos || []);
        setUsersSummary(users.datos || []);
        setTicketCycles(cycles.datos || []);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      }
    };

    fetchData();
  }, []);

  const coloresEstados = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
  ];

  const coloresUsuarios = ["#2563EB", "#16A34A", "#DC2626", "#9333EA"];

  const ticketsStatusData = {
    labels: ticketsStatus.map((t) => t.status),
    datasets: [
      {
        label: "Tickets",
        data: ticketsStatus.map((t) => t.total),
        backgroundColor: coloresEstados,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const usersData = {
    labels: usersSummary.map((u) => u.role),
    datasets: [
      {
        label: "Usuarios",
        data: usersSummary.map((u) => u.total),
        backgroundColor: coloresUsuarios,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const cyclesData = {
    labels: ticketCycles.map((c) => `Ticket ${c.ticket_id}`),
    datasets: [
      {
        label: "Correcciones DEV",
        data: ticketCycles.map((c) => c.correcciones_dev),
        backgroundColor: "#3B82F6",
      },
      {
        label: "Retest QA",
        data: ticketCycles.map((c) => c.retest_qa),
        backgroundColor: "#F59E0B",
      },
    ],
  };

  const opcionesPieDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  const opcionesBar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div style={{ padding: "30px", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "24px", color: "#0f172a" }}>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            height: "420px",
          }}
        >
          <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
            Tickets por estado
          </h3>
          <div style={{ position: "relative", height: "320px" }}>
            <Pie data={ticketsStatusData} options={opcionesPieDoughnut} />
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            height: "420px",
          }}
        >
          <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
            Usuarios por rol
          </h3>
          <div style={{ position: "relative", height: "320px" }}>
            <Doughnut data={usersData} options={opcionesPieDoughnut} />
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          minHeight: "450px",
        }}
      >
        <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
          Ciclos QA / DEV
        </h3>
        <div style={{ position: "relative", height: "360px" }}>
          <Bar data={cyclesData} options={opcionesBar} />
        </div>
      </div>
    </div>
  );
}