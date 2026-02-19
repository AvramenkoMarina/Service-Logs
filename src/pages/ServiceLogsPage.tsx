import Grid from '@mui/material/Grid';
import { Container, Paper, Box, Typography } from '@mui/material';
import { ServiceLogForm } from '../components/ServiceLogForm/ServiceLogForm';
import { ServiceLogsTable } from '../components/ServiceLogsTable/ServiceLogsTable';

export function ServiceLogsPage() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        pt: 4,
        pb: { xs: 6, md: 4 },
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Service Logs
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        alignItems="stretch"
        sx={{
          height: {
            xs: 'calc(100vh - 180px)',
            md: 'calc(100vh - 180px)',
            lg: 'calc(100vh - 140px)',
          },
        }}
      >
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper
            elevation={3}
            sx={{
              px: 2,
              pt: 2,
              pb: 4,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              height: {
                xs: 'auto',
                md: 'auto',
                lg: '100%',
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, pb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              Service Log Form
            </Typography>
            <ServiceLogForm />
          </Paper>
        </Grid>

        <Grid
          size={{ xs: 12, md: 8, lg: 9 }}
          sx={{
            display: 'flex',
            height: {
              xs: 'auto',
              md: 'auto',
              lg: '100%',
            },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
            }}
          >
            <ServiceLogsTable />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

