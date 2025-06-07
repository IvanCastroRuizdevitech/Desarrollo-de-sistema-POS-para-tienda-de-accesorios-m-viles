import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

// Declaración de módulo para extender la paleta de colores de Material UI
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary: PaletteOptions['primary'];
    neutral: PaletteOptions['primary'];
  }
}

// Crear tema claro
export const lightTheme = responsiveFontSizes(
  createTheme(
    {
      palette: {
        mode: 'light',
        primary: {
          main: '#3f51b5',
          light: '#757de8',
          dark: '#002984',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#f50057',
          light: '#ff5983',
          dark: '#bb002f',
          contrastText: '#ffffff',
        },
        tertiary: {
          main: '#00bcd4',
          light: '#62efff',
          dark: '#008ba3',
          contrastText: '#ffffff',
        },
        neutral: {
          main: '#64748B',
          light: '#E2E8F0',
          dark: '#334155',
          contrastText: '#ffffff',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#1a1a1a',
          secondary: '#555555',
        },
        error: {
          main: '#d32f2f',
        },
        warning: {
          main: '#ff9800',
        },
        info: {
          main: '#2196f3',
        },
        success: {
          main: '#4caf50',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 600,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 500,
        },
        h6: {
          fontWeight: 500,
        },
        subtitle1: {
          fontWeight: 500,
        },
        subtitle2: {
          fontWeight: 500,
        },
        body1: {
          fontSize: '1rem',
        },
        body2: {
          fontSize: '0.875rem',
        },
        button: {
          fontWeight: 500,
          textTransform: 'none',
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              },
            },
            contained: {
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
              borderRadius: 12,
            },
          },
        },
        MuiCardHeader: {
          styleOverrides: {
            root: {
              padding: '16px 24px',
            },
          },
        },
        MuiCardContent: {
          styleOverrides: {
            root: {
              padding: '16px 24px',
              '&:last-child': {
                paddingBottom: 16,
              },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              fontWeight: 600,
              backgroundColor: '#f5f5f5',
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              '&:nth-of-type(even)': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: '#ffffff',
              border: 'none',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 16,
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 12,
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
      },
    },
    esES // Configuración regional para español
  )
);

// Crear tema oscuro
export const darkTheme = responsiveFontSizes(
  createTheme(
    {
      palette: {
        mode: 'dark',
        primary: {
          main: '#90caf9',
          light: '#c3fdff',
          dark: '#5d99c6',
          contrastText: '#000000',
        },
        secondary: {
          main: '#f48fb1',
          light: '#ffc1e3',
          dark: '#bf5f82',
          contrastText: '#000000',
        },
        tertiary: {
          main: '#80deea',
          light: '#b4ffff',
          dark: '#4bacb8',
          contrastText: '#000000',
        },
        neutral: {
          main: '#94A3B8',
          light: '#CBD5E1',
          dark: '#64748B',
          contrastText: '#000000',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b0b0b0',
        },
        error: {
          main: '#f44336',
        },
        warning: {
          main: '#ff9800',
        },
        info: {
          main: '#29b6f6',
        },
        success: {
          main: '#66bb6a',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 600,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 500,
        },
        h6: {
          fontWeight: 500,
        },
        subtitle1: {
          fontWeight: 500,
        },
        subtitle2: {
          fontWeight: 500,
        },
        body1: {
          fontSize: '1rem',
        },
        body2: {
          fontSize: '0.875rem',
        },
        button: {
          fontWeight: 500,
          textTransform: 'none',
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
              },
            },
            contained: {
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
              backgroundImage: 'none',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: 12,
              backgroundImage: 'none',
            },
          },
        },
        MuiCardHeader: {
          styleOverrides: {
            root: {
              padding: '16px 24px',
            },
          },
        },
        MuiCardContent: {
          styleOverrides: {
            root: {
              padding: '16px 24px',
              '&:last-child': {
                paddingBottom: 16,
              },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              '&:nth-of-type(even)': {
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: '#1e1e1e',
              border: 'none',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 16,
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 12,
              backgroundImage: 'none',
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
      },
    },
    esES // Configuración regional para español
  )
);

export default lightTheme;

