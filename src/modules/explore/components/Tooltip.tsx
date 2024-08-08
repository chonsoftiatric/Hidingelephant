type ITooltip = {
  button: React.ReactNode;
  text: string;
};

const TooltipComp: React.FC<ITooltip> = ({ button, text }) => {
  return (
    <div className="border-0">
      <div className="tooltip">
        {button}
        <span className="tooltiptext !text-[14px]">{text}</span>
      </div>
    </div>
  );
};

export default TooltipComp;
