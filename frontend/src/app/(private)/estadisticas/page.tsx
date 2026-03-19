"use client";

import { useEffect, useState } from "react";
import {
  getTicketsByStatus,
  getUsersSummary,
  getTicketCycles
} from "@/services/dashboard.service";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import { Pie, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function DashboardPage() {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ticketsStatus, setTicketsStatus] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [usersSummary, setUsersSummary] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ticketCycles, setTicketCycles] = useState<any[]>([]);

  useEffect(() => {

    const fetchData = async () => {

      const status = await getTicketsByStatus();
      const users = await getUsersSummary();
      const cycles = await getTicketCycles();

      setTicketsStatus(status.datos);
      setUsersSummary(users.datos);
      setTicketCycles(cycles.datos);

    };

    fetchData();

  }, []);

  const ticketsStatusData = {
    labels: ticketsStatus.map(t => t.status),
    datasets: [
      {
        label: "Tickets",
        data: ticketsStatus.map(t => t.total)
      }
    ]
  };

  const usersData = {
    labels: usersSummary.map(u => u.role),
    datasets: [
      {
        label: "Usuarios",
        data: usersSummary.map(u => u.total)
      }
    ]
  };

  const cyclesData = {
    labels: ticketCycles.map(c => `Ticket ${c.ticket_id}`),
    datasets: [
      {
        label: "Correcciones DEV",
        data: ticketCycles.map(c => c.correcciones_dev)
      },
      {
        label: "Retest QA",
        data: ticketCycles.map(c => c.retest_qa)
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Estadísticas del sistema
        </h1>
      </div>

      <div style={{ padding: "30px", backgroundColor: "#f9f9f9a9", borderRadius: "8px" }}>

      <div style={{ width: "300px", marginBottom: "50px"  }}>
        <h3>Tickets por estado</h3>
        <Pie data={ticketsStatusData} />
      </div>

      <div style={{ width: "300px", marginBottom: "50px" }}>
        <h3>Usuarios por rol</h3>
        <Doughnut data={usersData} />
      </div>

      <div style={{ width: "600px" }}>
        <h3>Ciclos QA / DEV</h3>
        <Bar data={cyclesData} />
      </div>

    </div>
    </div>

  );

}