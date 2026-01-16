export default function Button({
    children,
    large = false,
    primary = false,
    secondary = false,
    disabled =false,
    onClick
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`cursor-pointer rounded-[20px] w-63.75 ${primary
                    ? "bg-purple-635 hover:bg-purple-a8a text-white"
                    : secondary
                        ? "bg-grey-f4f hover:bg-grey-e4e text-purple-635"
                        : "bg-red-e45 hover:bg-red-ff9 text-white"
                }
                ${large 
                    ? "h-12"
                    : "h-10"
                }
        `}>
            {children}
        </button>
    )
}