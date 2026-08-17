import { Box, Card } from '@mui/material';
import { PersonStanding } from 'lucide-react';

export default function DashboardSuggestions() {
  const items = [
    {
      title: 'Enable AI',
      description: 'Enable AI features for better suggestions and insights.',
      icon: <PersonStanding />,
    },
    {
      title: 'Refresh Database',
      description: 'Refresh the database to ensure all data is up-to-date.',
      icon: <PersonStanding />,
    },
    {
      title: 'Enable Mascot',
      description: '...',
      icon: <PersonStanding />,
    },
    {
      title: 'Trigger Indexer',
      description: '...',
      icon: <PersonStanding />,
    }

  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
      {items.map((item, index) => (
        <Card key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: 2, mb: 2 }}>
          <div>{item.icon}</div>
          <div>
            <div>{item.title}</div>
            <div>{item.description}</div>
          </div>
        </Card>
      ))}
    </Box>
  );
}
