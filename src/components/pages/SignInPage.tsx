import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../utils/api/auth.service';
import { Tab, TabList, TabPanel, Tabs } from '@mui/joy';

interface FormElements extends HTMLFormControlsCollection {
    username: HTMLInputElement;
    password: HTMLInputElement;
    persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

function ColorSchemeToggle(props: IconButtonProps) {
    const { onClick, ...other } = props;
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    return (
        <IconButton
            aria-label="toggle light/dark mode"
            size="sm"
            variant="outlined"
            disabled={!mounted}
            onClick={(event) => {
                setMode(mode === 'light' ? 'dark' : 'light');
                onClick?.(event);
            }}
            {...other}
        >
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
    );
}

export default function SignInPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
    const [lorTab, setLorTab] = React.useState(true)
    React.useEffect(() => {
        if (authService.getAuthUser()) {
            navigate(from, { replace: true });
        }
    }, [navigate, from]);

    return (
        <Box>
            <Box
                sx={(theme) => ({
                    width: { xs: '100%', md: '50vw' },
                    transition: 'width var(--Transition-duration)',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255 255 255 / 0.2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: 'rgba(19 19 24 / 0.4)',
                    },
                })}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100dvh',
                        width: '100%',
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{
                            py: 3,
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                            <IconButton variant="soft" color="primary" size="sm">
                                <BadgeRoundedIcon />
                            </IconButton>
                            <Typography level="title-lg">Company logo</Typography>
                        </Box>
                        <ColorSchemeToggle />
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: 'auto',
                            py: 2,
                            pb: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: 400,
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: 'sm',
                            '& form': {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: 'hidden',
                            },
                        }}
                    >

                        {
                            lorTab ? (
                                <>
                                    <Stack gap={4} sx={{ mb: 2 }}>
                                        <Stack gap={1}>
                                            <Typography component="h1" level="h3">
                                                Вход
                                            </Typography>
                                            <Typography level="body-sm">
                                                Вы не имеете аккаунта?{' '}
                                                <Button onClick={()=>setLorTab(false)}  variant='plain'>
                                                    Зарегестрируйтесь
                                                </Button>
                                            </Typography>
                                        </Stack>
                                        <Button
                                            variant="soft"
                                            color="neutral"
                                            fullWidth
                                            disabled

                                        >
                                            Продолжить с Google
                                        </Button>
                                    </Stack><Divider
                                        sx={(theme) => ({
                                            [theme.getColorSchemeSelector('light')]: {
                                                color: { xs: '#FFF', md: 'text.tertiary' },
                                            },
                                        })}
                                    >
                                        или
                                    </Divider><Stack gap={4} sx={{ mt: 2 }}>
                                        <form
                                            onSubmit={async (event: React.FormEvent<SignInFormElement>) => {
                                                event.preventDefault();
                                                const formElements = event.currentTarget.elements;
                                                const data = {
                                                    username: formElements.username.value,
                                                    password: formElements.password.value,
                                                };
                                                try {
                                                    const result = await authService.login(data);
                                                    console.log(result);
                                                    navigate("/");
                                                } catch (error) {
                                                    console.log('ereeer');
                                                }

                                            }}
                                        >
                                            <FormControl required>
                                                <FormLabel>Имя пользователя</FormLabel>
                                                <Input type="text" name="username" />
                                            </FormControl>
                                            <FormControl required>
                                                <FormLabel>Пароль</FormLabel>
                                                <Input type="password" name="password" />
                                            </FormControl>
                                            <Stack gap={4} sx={{ mt: 2 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Checkbox size="sm" label="Запомнить меня" disabled name="persistent" />
                                                    <Link disabled level="title-sm" href="#replace-with-a-link">
                                                        Забыли пароль ?
                                                    </Link>
                                                </Box>
                                                <Button type="submit" fullWidth>
                                                    Войти
                                                </Button>
                                            </Stack>
                                        </form>
                                    </Stack>
                                </>
                            ) : (
                                <>
                                 <Stack gap={4} sx={{ mb: 2 }}>
                                        <Stack gap={1}>
                                            <Typography component="h1" level="h3">
                                                Регистрация
                                            </Typography>
                                            <Typography level="body-sm">
                                                Вы имеете аккаунт?{' '}
                                                <Button onClick={()=>setLorTab(true)}  variant='plain'>
                                                    Войдите
                                                </Button>
                                            </Typography>
                                        </Stack>
                                      
                                    </Stack><Stack gap={4} sx={{ mt: 2 }}>
                                        <form
                                            onSubmit={async (event: React.FormEvent<SignInFormElement>) => {
                                                event.preventDefault();
                                                const formElements = event.currentTarget.elements;
                                                const data = {
                                                    username: formElements.username.value,
                                                    password: formElements.password.value,
                                                };
                                                try {
                                                    const result = await authService.login(data);
                                                    console.log(result);
                                                    navigate("/");
                                                } catch (error) {
                                                    console.log('ereeer');
                                                }

                                            }}
                                        >
                                            <FormControl required>
                                                <FormLabel>E-mail</FormLabel>
                                                <Input type="email" name="email" />
                                            </FormControl>
                                            <FormControl required>
                                                <FormLabel>Пароль</FormLabel>
                                                <Input type="password" name="password" />
                                            </FormControl>
                                            <Stack gap={4} sx={{ mt: 2 }}>
                                              
                                                <Button type="submit" fullWidth>
                                                    Зарегестрироваться
                                                </Button>
                                            </Stack>
                                        </form>
                                    </Stack>
                                </>
                            )
                        }



                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" textAlign="center">
                            © Your company {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: '100%',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: '50vw' },
                    transition:
                        'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    backgroundColor: 'background.level1',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
                    },
                })}
            />
        </Box>
    );
}