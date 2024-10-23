import { Box, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <Box sx={{
      backgroundColor: '#f5f5f5',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Container>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center' }}>
              <Image
                src="/kishan_bhai.png"
                alt="Krishi Sadhan"
                width={100}
                height={100}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography textAlign="center" component="h1" variant="h3">Krishi Sadhan</Typography>
            <Typography textAlign="center" component="p" variant="body1">Kisaan upkaran ka ek Matra Sadhan</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
