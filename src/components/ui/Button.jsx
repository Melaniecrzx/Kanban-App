export default function Button({
    children,
    type,
    large = false,
    primary = false,
    secondary = false,
    disabled = false,
    className,
    onClick
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex justify-center items-center rounded-3xl md:rounded-[20px] px-4
                ${disabled 
                    ? "bg-purple-a8a text-white cursor-not-allowed"
                    : primary
                        ? "bg-purple-635 hover:bg-purple-a8a text-white cursor-pointer"
                        : secondary
                            ? "bg-grey-f4f hover:bg-grey-e4e text-purple-635 cursor-pointer"
                            : "bg-red-e45 hover:bg-red-ff9 text-white cursor-pointer"
                }
                ${large ? "py-4" : "py-2.5"}
                ${className}
            `}
            type={type}>
            {children}
        </button>
    )
}