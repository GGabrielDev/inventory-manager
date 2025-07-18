import { Container, Typography, Button } from '@mui/material';

const LandingPage: React.FC = () => {
  return (
    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Our Inventory Manager
      </Typography>
      <Typography variant="h5" component="p" gutterBottom>
        Manage your inventory efficiently and effectively.
      </Typography>
      <Button variant="contained" color="primary" href="/dashboard">
        Get Started
      </Button>
    </Container>
  );
};

export default LandingPage;
