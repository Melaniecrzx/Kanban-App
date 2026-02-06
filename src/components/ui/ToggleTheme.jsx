import { useTheme } from "../../store/ThemeProvider";
import darkThemeIcon from "../../assets/icon-dark-theme.svg";
import lightThemeIcon from "../../assets/icon-light-theme.svg"
import { Switch } from "@headlessui/react";

export default function ToogleTheme() {
    const { isDark, toggleTheme } = useTheme();
    return (
        <div className={`flex gap-5 w-60 justify-center align-items items-center rounded-md py-3.5 ${isDark ? "bg-grey-202": "bg-grey-f4f"}`}>
            <img src={lightThemeIcon} alt="Sun Icon" className="w-4 h-4" />

            <Switch
                checked={isDark}
                onChange={toggleTheme}
                className={`bg-purple-635 relative inline-flex h-5 w-10 items-center rounded-full cursor-pointer`}
            >
                <span
                    className={`${isDark ? 'translate-x-5.5' : 'translate-x-1'
                        } inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform`}
                />
            </Switch>
            <img src={darkThemeIcon} alt="Moon Icon" className="w-4 h-4" />
        </div>
    )
}