import React, { useState } from 'react';
import { Box, Button, Container, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const Display = styled(Paper)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  textAlign: 'right',
  fontSize: '2rem',
  position: 'relative',
}));

const CalcButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  padding: theme.spacing(2),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = async (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      setLoading(true);
      try {
        const result = await backend.calculate(operator, firstOperand, inputValue);
        if ('ok' in result) {
          setDisplay(result.ok.toString());
          setFirstOperand(result.ok);
        } else {
          setDisplay('Error');
        }
      } catch (error) {
        console.error('Calculation error:', error);
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto' }}>
        <Display>
          {display}
          {loading && (
            <CircularProgress
              size={20}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            />
          )}
        </Display>
        <Grid container spacing={1}>
          {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(
            (btn) => (
              <Grid item xs={3} key={btn}>
                <CalcButton
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    if (btn === '=') {
                      performOperation('=');
                    } else if (['+', '-', '*', '/'].includes(btn)) {
                      performOperation(btn);
                    } else if (btn === '.') {
                      inputDecimal();
                    } else {
                      inputDigit(btn);
                    }
                  }}
                >
                  {btn}
                </CalcButton>
              </Grid>
            )
          )}
          <Grid item xs={12}>
            <CalcButton fullWidth variant="contained" color="secondary" onClick={clear}>
              Clear
            </CalcButton>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default App;
