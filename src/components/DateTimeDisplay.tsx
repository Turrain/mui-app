import React, { FC } from 'react';
import { Sheet, Typography } from '@mui/joy';

const DateTimeDisplay: FC = () => {
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup the timer on component unmount
    }, []);

    // const formatDateTime = (date: Date) => {
    //     return date.toLocaleString(); // Modify this if you need a different format
    // };

    const formatDateTime = (date: Date): string => {
        // Format the date to day/month/year hour:minute:second using UTC
        return new Intl.DateTimeFormat('default', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZoneName: 'short',
        }).format(date);
      };

    return (
        <Sheet
            color='primary'
            variant='soft'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 1,
                borderRadius: 8,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Typography level="body-sm" fontWeight={700}>
                {formatDateTime(currentTime).split(',')[0]}
            </Typography>
            <Typography level="body-lg" fontWeight={700}>
                {formatDateTime(currentTime).split(',')[1]}
            </Typography>
        </Sheet>
    );
};

export default DateTimeDisplay;