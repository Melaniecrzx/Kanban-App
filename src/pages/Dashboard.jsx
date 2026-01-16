import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Dashboard() {
    return(
        <>
        <button onClick={() => signOut(auth)}>X</button>
        </>
    )
}