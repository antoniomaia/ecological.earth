import React from 'react';
import Grid from '@material-ui/core/grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const LoginForm = () => {
  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 200,
          maxWidth: 300,
          width: '100%',
        }}
      >
        <Typography align="center" variant="h4" gutterBottom>
          Register
        </Typography>
        <TextField
          label="Email"
          type="email"
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
        />
        <div style={{ height: '1rem' }} />
        <Button color="primary" variant="contained" size="large">
          Register
        </Button>
        <div style={{ height: '1rem' }} />
        <Button href="/login" size="large">
          Log in
        </Button>
      </div>
    </Grid>
  );
};

export default LoginForm;