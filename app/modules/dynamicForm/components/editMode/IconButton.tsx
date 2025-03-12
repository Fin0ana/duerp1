type IconButtonProps = React.HTMLAttributes<HTMLSpanElement> & { icon: string };

function IconButton({ icon, ...props }: IconButtonProps) {
  return (
    <span
      {...props}
      className="w-8 h-8 flex items-center justify-center hover:bg-gray-400/50 rounded-full cursor-pointer"
    >
      <span className={icon}></span>
    </span>
  );
}

export default IconButton;
