import { Bug, ChevronLast, CircleCheckBig, Cpu, Gauge, Hourglass, List } from 'lucide-react';

const items = [
  {
    key: 'processed',
    label: 'Processed',
    icon: <Cpu size={24} />
  },
  {
    key: 'total',
    label: 'Total',
    // showChart: false,
    icon: <List size={24} />
  },
  {
    key: 'generated',
    label: 'Generated',
    icon: <CircleCheckBig size={24} />
  },
  {
    key: 'skipped',
    label: 'Remaining',
    icon: <ChevronLast size={24} />
  },
  {
    key: 'failed',
    label: 'Failed',
    icon: <Bug size={24} />
  },
  {
    key: 'img/s',
    label: 'Rate (img/s)',
    icon: <Gauge size={24} />
  },
  {
    key: 'ETA',
    label: 'ETA (min)',
    format: (value: string) => Math.round(Number(value) / 1000 / 60) + 'm',
    icon: <Hourglass size={24} />
  }
]

export const parseIndexerLine = (line: string) => {
  const splitLines = line.split('|')

  return items.reduce((acc, item) => {
    const foundLine = splitLines.find(line => line.includes(item.key))
    if (foundLine) {
      const value = foundLine.split(item.key)[1].trim().split(' ')[1]
      acc[item.key] = value
    }

    return acc
  }, {} as Record<string, string>)
}

export const parseRichIndexerLine = (line: string) => {
  const splitLines = line.split('|')

  return items.reduce((acc, item) => {
    const foundLine = splitLines.find(line => line.includes(item.key))
    if (foundLine) {
      const value = foundLine.split(item.key)[1].trim().split(' ')[1]
      acc[item.key] = {...item, value }
    }

    return acc
  }, {} as Record<string, any>)
}
