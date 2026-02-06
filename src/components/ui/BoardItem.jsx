import IconBoard from "../Icons/IconBoard"
import { motion } from "framer-motion"
import { useState } from "react"

export default function BoardItem({ name, isCreateNew = false, onClick, isActive = false,  onClose = () => {} }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        setIsHovered(false); 
        onClick();
    }

    return (
        <motion.button
            onClick={()=>{
                handleClick();
                onClose()
            }}
            onMouseEnter={() => !isActive && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`font2 cursor-pointer flex gap-4 items-center relative overflow-hidden py-3.5 -ml-8 pl-8`}
            initial="initial"
            animate={isActive ? "active" : (isHovered ? "hover" : "initial")}
        >
            <motion.div
                className={`absolute inset-0 rounded-r-full ${isActive ? 'bg-purple-635' : 'bg-purple-a8a'}`}
                variants={{
                    initial: { x: '-100%' },
                    hover: { x: 0 },
                    active: { x: 0 }
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut"
                }}
            />

            <motion.span
                className="flex gap-4 items-center relative z-10"
                variants={{
                    initial: { color: isCreateNew ? '#635FC7' : '#828FA3' },
                    hover: { color: '#FFFFFF' },
                    active: { color: '#FFFFFF' },
                }}
            >
                <IconBoard color={isCreateNew ? '#635FC7' : '#828FA3'} />
                {name}
            </motion.span>
        </motion.button>
    )
}