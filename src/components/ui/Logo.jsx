import logoDark from "../../assets/logo-dark.svg";
import logoLight from "../../assets/logo-light.svg";
import logoMobile from "../../assets/logo-mobile.svg";


export default function Logo() {
    return (
        <>
            <img src={logoMobile} alt='logo' className=" md:hidden" />
            <img src={logoDark} alt='logo' className="h-6.25 w-38.25 hidden md:block dark:hidden" />
            <img src={logoLight} alt='logo' className="h-6.25 w-38.25 hidden dark:md:block" />

        </>
    )
}