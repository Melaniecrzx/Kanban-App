export default function IconOptions({ w = 5, h = 20, isOpen = false }) {
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 5 20"
      xmlns="http://www.w3.org/2000/svg"
      fill={isOpen ? '#635FC7' : '#828FA3'}
      className="transition-colors duration-200"
      style={{ 
        transform: isOpen ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <g fillRule="evenodd">
        <circle cx="2.308" cy="2.308" r="2.308"/>
        <circle cx="2.308" cy="10" r="2.308"/>
        <circle cx="2.308" cy="17.692" r="2.308"/>
      </g>
    </svg>
  );
}