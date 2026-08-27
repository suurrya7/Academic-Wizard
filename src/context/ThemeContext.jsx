import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
    theme: 'dark',
    toggleTheme: () => {},
    isAuto: true,
});

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [isAuto, setIsAuto] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('aw_theme_preference');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            setTheme(savedTheme);
            setIsAuto(false);
            applyTheme(savedTheme);
            return;
        }

        // Automatic Day/Night detection based on local time
        // Day: 06:00 (6 AM) to 18:30 (6:30 PM) -> Light Mode
        // Night: 18:30 (6:30 PM) to 06:00 (6 AM) -> Dark Mode
        const checkTimeOfDay = () => {
            const currentHour = new Date().getHours();
            const currentMinutes = new Date().getMinutes();
            const timeInMinutes = currentHour * 60 + currentMinutes;
            
            const isDayTime = timeInMinutes >= 360 && timeInMinutes < 1110;
            const targetTheme = isDayTime ? 'light' : 'dark';
            
            setTheme(targetTheme);
            setIsAuto(true);
            applyTheme(targetTheme);
        };

        checkTimeOfDay();

        const interval = setInterval(checkTimeOfDay, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const applyTheme = (t) => {
        const root = document.documentElement;
        if (t === 'light') {
            root.classList.remove('dark');
            root.classList.add('light');
            root.setAttribute('data-theme', 'light');
        } else {
            root.classList.remove('light');
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        }
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        setIsAuto(false);
        localStorage.setItem('aw_theme_preference', nextTheme);
        applyTheme(nextTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isAuto }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
