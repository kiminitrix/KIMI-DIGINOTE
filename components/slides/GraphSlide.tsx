import React from 'react';
import { SlideContent, ChartData } from '../../types';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#F43F5E', '#10B981', '#F59E0B', '#6366F1'];

const renderChart = (chart: ChartData) => {
  const data = chart.labels.map((label, index) => ({
    name: label,
    value: chart.data[index],
  }));

  switch (chart.type) {
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }} />
            <Legend />
            <Line type="monotone" dataKey="value" name={chart.dataLabel} stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'bar':
    default:
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }} />
            <Legend />
            <Bar dataKey="value" name={chart.dataLabel} fill="#3B82F6" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
  }
};

export const GraphSlide: React.FC<{ content: SlideContent }> = ({ content }) => {
  if (!content.chart) return <div>No Chart Data</div>;

  return (
    <div className="h-full w-full p-12 bg-slate-900 text-white flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center mb-8"
      >
        <h2 className="text-4xl font-bold mb-2">{content.title}</h2>
        {content.body && <p className="text-slate-400 text-lg">{content.body}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 w-full max-w-5xl bg-slate-800/50 rounded-2xl p-8 border border-slate-700 shadow-xl"
      >
        {renderChart(content.chart)}
      </motion.div>
    </div>
  );
};